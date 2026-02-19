<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { AuctionDetail } from "../../../../../types/auctions";

// Icons
import InfoIcon from "@/assets/icons/info.svg?raw";
import PointRawIcon from "@/assets/icons/point.svg?raw";

const props = defineProps<{
  typeShared: string;
  auction: AuctionDetail;
}>();

const skeleton = ref<boolean>(false);
const currentTime = ref(Date.now());

let intervalId: number | null = null;

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function calculateProgress(): number {
  if (props.auction.targetSum === 0) return 0;
  if (props.auction.purchasedSum >= props.auction.targetSum) return 100;
  return Math.min((props.auction.purchasedSum / props.auction.targetSum) * 100, 100);
}

function isAuctionClosed(): boolean {
  return props.auction.purchasedSum >= props.auction.targetSum;
}

function calculateTimeRemaining(): string {
  const deadlineTime = new Date(props.auction.deadline).getTime();
  const diff = deadlineTime - currentTime.value;
  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function isTimeEnded(): boolean {
  const deadlineTime = new Date(props.auction.deadline).getTime();
  return currentTime.value >= deadlineTime;
}

const remainingPercentage = computed(() => {
  const progress = calculateProgress();
  return Math.round(100 - progress);
});
</script>

<template>
  <div class="info" :class="{ skeleton }">

    <div class="head">
      <div v-if="props.typeShared === 'gift'" class="context">
        <h4>{{ props.auction.gift.title }}</h4>
        <p>#{{ formatNumber(props.auction.gift.num) }}</p>
      </div>
      <div v-if="props.typeShared === 'anonymous'" class="context">
        <h4>Anonymous Numbers</h4>
        <p>+888 0364 8927</p>
      </div>
      <div class="status" :class="isAuctionClosed() ? 'closed' : 'fundraising'">
        <p>{{ isAuctionClosed() ? 'closed' : 'collecting' }}</p>
      </div>
    </div>

    <div class="progress">
      <div class="progress-line">
        <div class="line" :style="{ '--w-progress': calculateProgress() + '%' }"></div>
      </div>

      <div class="context">
        <h4>Collection progress</h4>
        <p>{{ Math.round(calculateProgress()) }}%</p>
      </div>
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>Collection ends in</p>
          <h4 :class="{ 'time-ended': isTimeEnded() }">{{ calculateTimeRemaining() }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>you core points</p>
          <span>
            <h4>0</h4>
            <div class="kit-icon" v-html="PointRawIcon"></div>
          </span>
        </div>
        <div class="mark">
          <div class="kit-icon" v-html="InfoIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Info.scss" scoped></style>
<style scoped>
.time-ended {
  color: #FF1B54 !important;
}
</style>