<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModal } from "../../components/common/Modal";
import { hideMenu } from "../../utils/useApp";
import type { CraftPool } from "../../types/craft";
import { craftApi } from "../../api/craft";

import Head from "./Components/Head/Head.vue";
import Info from "./Components/Info/Info.vue";
import Participants from "./Components/Participants/Participants.vue";
import Controls from "./Components/Controls/Controls.vue";
import Voting from "./Components/Voting/Voting.vue";
import BringGifts from "./Components/Modals/BringGifts.vue";
import CreateVote from "./Components/Modals/CreateVote.vue";

const route = useRoute();
const router = useRouter();
const { open } = useModal();

const pool = ref<CraftPool | null>(null);
const loading = ref(true);

const scrollRef = ref<HTMLElement | null>(null);
const scrollValue = ref(0);
const MAX_OFFSET = 350;
const isBlockerExpanded = ref(false);
let scrollEndTimer: number | null = null;

const handleScroll = () => {
  const el = scrollRef.value;
  if (!el) return;
  scrollValue.value = Math.min(Math.max(el.scrollTop, 0), MAX_OFFSET);

  if (scrollEndTimer !== null) clearTimeout(scrollEndTimer);
  scrollEndTimer = window.setTimeout(() => {
    const p = scrollValue.value / MAX_OFFSET;
    if (p > 0.3 && p < 0.8) isBlockerExpanded.value = true;
    if (p <= 0.2) isBlockerExpanded.value = false;
  }, 120);
};

const progress = computed(() => scrollValue.value / MAX_OFFSET);

const headStyle = computed(() => {
  const p = progress.value;
  return {
    transform: `translateY(${60 * p}px) scale(${1 - p * 0.06})`,
    opacity: String(1 - p * 0.03),
  };
});

const overlayStyle = computed(() => ({
  opacity: String(0.8 * progress.value),
}));

const poolId = computed(() => route.params.id as string);
const membersCount = computed(() => pool.value?.members?.length || 0);
const maxMembers = computed(() => 4);
const isFull = computed(() => membersCount.value >= maxMembers.value);
const isCompleted = computed(() => pool.value?.status === "COMPLETED");
const isActive = computed(() => pool.value?.status === "ACTIVE");

async function fetchPool() {
  try {
    loading.value = true;
    pool.value = await craftApi.getCraftById(poolId.value);
  } catch (e) {
    console.error("Failed to fetch pool:", e);
    pool.value = null;
  } finally {
    loading.value = false;
  }
}

async function handleBringGifts() {
  const modal = open(BringGifts, {
    poolId: poolId.value,
    collectionName: pool.value?.giftInfo?.collectionName || "",
    onSuccess: () => fetchPool(),
  });
  await modal.done.catch(() => null);
}

async function handleCreateVote() {
  const modal = open(CreateVote, {
    poolId: poolId.value,
    pool: pool.value,
  });
  await modal.done.catch(() => null);
}

function handleLeaveAsset() {
  // Future feature
}

function goBack() {
  router.back();
}

onMounted(() => {
  hideMenu();
  fetchPool();
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

    <template v-else-if="pool">
      <div
        class="head-wrapper"
        :style="headStyle"
        :class="{ 'head--hidden': isBlockerExpanded }"
      >
        <div class="bg-overlay" :style="overlayStyle"></div>
        <Head :pool="pool" />
      </div>

      <div
        class="blocker"
        :class="{ 'blocker--expanded': isBlockerExpanded }"
      >
        <Info
          :pool="pool"
          :is-completed="isCompleted"
          :is-active="isActive"
          :is-full="isFull"
          :members-count="membersCount"
          :max-members="maxMembers"
        />

        <!-- YOUR SHARE + ATTACHED bundles for completed -->
        <div v-if="isCompleted" class="share-bundles">
          <div class="bundle">
            <p class="lbl">YOUR SHARE</p>
            <h4 class="val accent">22%</h4>
          </div>
          <div class="bundle">
            <p class="lbl">ATTACHED</p>
            <div class="val-row">
              <h4 class="val">0.50</h4>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="#355DFF"/>
                <path d="M5.5 6.5h7M7 6.5L9 12.5l2-6" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- DAO Voting section (only for completed pools) -->
        <Voting v-if="isCompleted" :pool="pool" />

        <div class="title">
          <h4>Participants</h4>
        </div>

        <Participants :pool="pool" />
      </div>

      <div class="controls">
        <Controls
          :pool="pool"
          :is-active="isActive"
          :is-full="isFull"
          :is-completed="isCompleted"
          @back="goBack"
          @bring-gifts="handleBringGifts"
          @create-vote="handleCreateVote"
          @leave-asset="handleLeaveAsset"
        />
      </div>
    </template>

    <div v-else class="error-wrapper">
      <p>Pool not found</p>
    </div>
  </div>
</template>

<style lang="scss" src="./CraftPoolDetail.scss" scoped></style>
<style scoped>
.section-scroll {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.head-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  will-change: transform, opacity;
  transform-origin: top center;
  transition: transform 0.12s linear, opacity 0.12s linear;
}

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

.blocker--expanded {
  min-height: 100vh;
  padding-top: 16px;
}

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
}

.loading-wrapper .loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #355DFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-wrapper p {
  color: #355DFF;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

/* Share bundles for completed pools */
.share-bundles {
  display: flex;
  gap: 12px;
  width: 100%;
}

.share-bundles .bundle {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  background: #F8F8FB;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.share-bundles .lbl {
  color: rgba(0, 0, 0, 0.50);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.share-bundles .val {
  color: #000;
  font-size: 14px;
  font-weight: 500;
}

.share-bundles .val.accent {
  color: #30C15E;
}

.share-bundles .val-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
