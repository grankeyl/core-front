<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { AuctionDetail } from "@/types/auctions";

// Icons
import InfoIcon from "@/assets/icons/info.svg?raw";
import PointRawIcon from "@/assets/icons/point.svg?raw";

const props = defineProps<{
  typeShared: string;
  auction: AuctionDetail;
}>();

const skeleton = ref<boolean>(false);
const firstGift = computed(() => props.auction.gifts?.[0]);
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
  const { purchasedSum, targetSum } = props.auction;
  if (targetSum === 0) return purchasedSum > 0 ? 100 : 0;
  return Math.min((purchasedSum / targetSum) * 100, 100);
}

function isAuctionClosed(): boolean {
  const s = props.auction.status;
  if (s === "COMPLETED" || s === "CANCELLED") return true;
  const deadlineTime = new Date(props.auction.deadline).getTime();
  if (currentTime.value >= deadlineTime) return true;
  if (props.auction.targetSum > 0 && props.auction.purchasedSum >= props.auction.targetSum) return true;
  return false;
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

</script>

<template>
  <div class="info" :class="{ skeleton }">

    <div class="head">
      <div v-if="props.typeShared === 'gift' && firstGift" class="context">
        <h4>{{ firstGift.title }}</h4>
        <p>#{{ formatNumber(firstGift.num ?? 0) }}</p>
      </div>
      <div v-if="props.typeShared === 'anonymous'" class="context">
        <h4>Anonymous Numbers</h4>
        <p>+888 0364 8927</p>
      </div>
      <div class="status" :class="isAuctionClosed() ? 'closed' : 'fundraising'">
        <p>{{ isAuctionClosed() ? "closed" : (props.auction.status === "ACTIVE" ? "active" : "collecting") }}</p>
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
            <h4>{{ formatNumber(props.auction.mySum ?? 0) }}</h4>
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