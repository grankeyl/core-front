<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { hideMenu } from "../../utils/useApp";
import { auctionsApi } from "../../api/auctions";
import type { AuctionDetail } from "../../types/auctions";

import Head from "./Components/Head/Head.vue";
import Info from "./Components/Info/Info.vue";
import Sections from "./Components/Sections/Sections.vue";
import Controls from "./Components/Controls/Controls.vue";

import TelegramModule from "../../hooks/useTelegram";

const route = useRoute();
const typeShared = ref('gift');
const auction = ref<AuctionDetail | null>(null);
const loading = ref(true);

const scrollRef = ref<HTMLElement | null>(null);
const scrollValue = ref(0);

const MAX_OFFSET = 350;

const handleScroll = () => {
  const el = scrollRef.value;
  if (!el) return;
  const s = el.scrollTop;
  scrollValue.value = Math.min(Math.max(s, 0), MAX_OFFSET);
  if (scrollEndTimer !== null) {
    clearTimeout(scrollEndTimer);
  }

  scrollEndTimer = window.setTimeout(() => {
    const p = scrollValue.value / MAX_OFFSET;
    if (p > 0.3 && p < 0.8) {
      isBlockerExpanded.value = true;
    }
    if (p <= 0.2) {
      isBlockerExpanded.value = false;
    }
  }, 120);
};

const progress = computed(() => scrollValue.value / MAX_OFFSET);

const isBlockerExpanded = ref(false);
let scrollEndTimer: number | null = null;

const headStyle = computed(() => {
  const p = progress.value;
  const scale = 1 - p * 0.06;
  const translateY = 60 * p;
  const opacity = 1 - p * 0.03;

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: String(opacity),
  };
});

const overlayStyle = computed(() => {
  const p = progress.value;
  const alpha = 0.8 * p;
  return {
    opacity: String(alpha),
  };
});

function normalizeAuction(raw: any): AuctionDetail & { giftsCount?: number } {
  // API returns gifts: { gift, count } — normalize to gifts: Gift[]
  let gifts: any[] = [];
  let giftsCount = 1;
  if (raw.gifts) {
    if (Array.isArray(raw.gifts)) {
      gifts = raw.gifts;
      giftsCount = gifts.length;
    } else if (raw.gifts.gift) {
      gifts = [raw.gifts.gift];
      giftsCount = raw.gifts.count ?? 1;
    }
  }
  return { ...raw, gifts, giftsCount };
}

async function handleParticipated() {
  await new Promise((r) => setTimeout(r, 300));
  await fetchAuction();
}

async function fetchAuction() {
  try {
    loading.value = true;
    const id = route.params.id as string;
    if (!id) {
      console.error("Auction ID is missing");
      return;
    }
    const raw = await auctionsApi.getAuctionById(id);
    auction.value = normalizeAuction(raw);

    if (auction.value && auction.value.gifts?.length) {
      typeShared.value = "gift";
    }
  } catch (error) {
    console.error("Failed to fetch auction:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  TelegramModule.hideBackButton();
  hideMenu();
  fetchAuction();
});
</script>

<template>
  <div
    ref="scrollRef"
    class="section section-scroll"
    :class="{ 'section-loading': loading }"
    @scroll="handleScroll"
  >
    <div v-if="loading" class="loading-wrapper">
      <div class="loader"></div>
    </div>
    <template v-else-if="auction">
      <div
        class="head-wrapper"
        :style="headStyle"
        :class="{ 'head--hidden': isBlockerExpanded }"
      >
        <div class="bg-overlay" :style="overlayStyle"></div>
        <Head
          :typeShared="typeShared"
          :auction="auction"
        />
      </div>

      <div
        class="blocker"
        :class="{ 'blocker--expanded': isBlockerExpanded }"
      >
        <Info
          :typeShared="typeShared"
          :auction="auction"
        />
        <div class="title">
          <h4>Participants</h4>
        </div>
        <Sections
          :typeShared="typeShared"
          :auction="auction"
        />
      </div>

      <div class="controls">
        <Controls :auction="auction" @participated="handleParticipated" />
      </div>
    </template>
    <div v-else class="error-wrapper">
      <p>Auction not found</p>
    </div>
  </div>
</template>

<style lang="scss" src="./BurnItem.scss" scoped></style>
<style scoped>
.section-scroll {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* хедер сверху */
.head-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  will-change: transform, opacity;
  transform-origin: top center;
  transition: transform 0.12s linear, opacity 0.12s linear;
}

/* чёрный оверлей по фону */
.bg-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.12s linear;
  border-radius: 18px 18px 0 0;
  overflow: hidden;
  margin-top: -14px;
}

.blocker {
  position: relative;
  z-index: 2;
  transition: min-height 0.25s ease, padding-top 0.25s ease, transform 0.25s ease;
}

/* когда отпустили палец в середине */
.blocker--expanded {
  min-height: 100vh;       /* растягиваем на экран */
  padding-top: 16px;
}

/* чтобы хед как будто ушёл */
.head--hidden {
  opacity: 0;
  transform: translateY(-40px) scale(0.94);
}

.section-loading {
  background: #F8F8FB;
}

.loading-wrapper,
.error-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: #F8F8FB;

  p {
    color: rgba(0, 0, 0, 0.50);
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: #FF1B54;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

.error-wrapper p {
  color: #FF1B54;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>