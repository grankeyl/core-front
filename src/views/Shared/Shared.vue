<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useModal } from "../../components/common/Modal";
import { fundsApi } from "../../api/funds";
import type { FundDetail } from "../../types/funds";

import Head from "./Components/Head/Head.vue";
import Info from "./Components/Info/Info.vue";
import Sections from "./Components/Sections/Sections.vue";
import Button from "./Components/Button/Button.vue";
import BuyShares from "./Components/Modals/BuyShares.vue";

import TelegramModule from "../../hooks/useTelegram";
import { hideMenu } from "../../utils/useApp";

const route = useRoute();
const { open } = useModal();

const typeShared = ref('gift');
const fund = ref<FundDetail | null>(null);
const loading = ref(true);

const scrollRef = ref<HTMLElement | null>(null);
const scrollValue = ref(0);

const MAX_OFFSET = 350;

async function buyShares() {
  if (!fund.value) return;

  const choose = open(BuyShares, {
    fund: fund.value,
  });

  const result = await choose.done.catch(() => null);

  // Если покупка успешна, перезагружаем данные фонда
  if (result) {
    await fetchFund();
  }
}

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

async function fetchFund() {
  try {
    loading.value = true;
    const id = route.params.id as string;
    if (!id) {
      console.error("Fund ID is missing");
      return;
    }
    fund.value = await fundsApi.getFundById(id);

    // Определяем typeShared на основе данных
    if (fund.value && fund.value.gift) {
      typeShared.value = 'gift';
    } else {
      typeShared.value = 'anonymous';
    }
  } catch (error) {
    console.error("Failed to fetch fund:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  TelegramModule.hideBackButton();
  hideMenu();
  fetchFund();
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
    <template v-else-if="fund">
      <div
        class="head-wrapper"
        :style="headStyle"
        :class="{ 'head--hidden': isBlockerExpanded }"
      >
        <div class="bg-overlay" :style="overlayStyle"></div>
        <Head
          :typeShared="typeShared"
          :fund="fund"
        />
      </div>

      <div
        class="blocker"
        :class="{ 'blocker--expanded': isBlockerExpanded }"
      >
        <Info
          :typeShared="typeShared"
          :fund="fund"
        />
        <Sections
          :typeShared="typeShared"
          :fund="fund"
        />
      </div>

      <Button
        @buy-shares="buyShares"
        :fund="fund"
      />
    </template>
    <div v-else class="error-wrapper">
      <p>Fund not found</p>
    </div>
  </div>
</template>

<style lang="scss" src="./Shared.scss" scoped></style>
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
    border-top-color: #355DFF;
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