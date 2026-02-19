<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Fund } from "../../../../types/funds";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";
import FireRawIcon from "@/assets/icons/fire.svg?raw";

const router = useRouter();
const currentTime = ref(Date.now());

const emit = defineEmits<{
  (e: "open-type"): void;
  (e: "open-status"): void;
  (e: "open-sort-by"): void;
}>();

const props = defineProps<{
  funds: Fund[];
  loading: boolean;
}>();

function openType() {
  emit('open-type');
}

function openStatus() {
  emit('open-status');
}

function openSortBy() {
  emit('open-sort-by');
}

function openItem(id: string) {
  router.push(`/burn/item/${id}`);
}

function getStatusClass(status: string): string {
  return status === 'ACTIVE' ? 'burn' : 'close';
}

function calculateProgress(fund: Fund): number {
  if (fund.fractionNum === 0) return 0;
  const progress = (fund.purchasedFractionNum / fund.fractionNum) * 100;
  return Math.min(progress, 100);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function calculateTimeRemaining(deadline: string): string {
  const deadlineTime = new Date(deadline).getTime();
  const diff = deadlineTime - currentTime.value;

  if (diff <= 0) {
    return 'Ended';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function isTimeEnded(deadline: string): boolean {
  const deadlineTime = new Date(deadline).getTime();
  return deadlineTime - currentTime.value <= 0;
}

let timerInterval: number | null = null;

onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000) as unknown as number;
});

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
</script>

<template>
  <div class="items" :class="{ skeleton: loading }">
    <div class="filters">
      <div class="item" @click="openType">
        <div class="context">
          <p>TYPE</p>
          <h4>All</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="item" @click="openStatus">
        <div class="context">
          <p>status</p>
          <h4>Fundraising</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="item" @click="openSortBy">
        <div class="context">
          <p>sort by</p>
          <h4>Price: Low</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
    </div>

    <div class="lists">
      <div v-if="loading && funds.length === 0" class="loading-message">
        <p>Loading funds...</p>
      </div>
      <div v-else-if="!loading && funds.length === 0" class="empty-message">
        <p>No funds available</p>
      </div>
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="item"
        @click="openItem(fund.id)"
      >
        <div class="inner">
          <div class="head">
            <div class="image">
              <img :src="fund.gift.image" :alt="fund.gift.title">
            </div>
            <div class="context">
              <h4>{{ fund.gift.title }}</h4>
              <span>x1</span>
            </div>
            <div class="status" :class="getStatusClass(fund.status)">
              <div class="kit-icon" v-html="FireRawIcon"></div>
              <p>{{ fund.status === 'ACTIVE' ? 'Burn' : 'Closed' }}</p>
            </div>
          </div>
          <div class="progress">
            <div class="progress-line">
              <div class="line" :style="{ '--w-progress': `${calculateProgress(fund)}%` }"></div>
            </div>
            <div class="context">
              <h4>Remaining until burn</h4>
              <p>{{ Math.round(calculateProgress(fund)) }}%</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p v-if="fund.status === 'ACTIVE'">Time until burn cancellation</p>
          <p v-else>Burn {{ fund.status === 'COMPLETED' ? 'Completed' : 'Cancelled' }}</p>
          <p v-if="fund.status === 'ACTIVE'" class="timer" :class="{ ended: isTimeEnded(fund.deadline) }">
            {{ calculateTimeRemaining(fund.deadline) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
<style scoped>
</style>
