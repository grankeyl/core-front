<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Fund } from "../../../../types/funds";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

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
  typeItems: any[];
  statusItems: any[];
  sortByActive: string;
  sortByItems: any[];
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
  router.push(`/shared/${id}`);
}

function getStatusClass(fund: Fund): string {
  // Если все доли проданы, считаем закрытым
  if (fund.purchasedFractionNum >= fund.fractionNum) return 'close';
  return fund.status === 'ACTIVE' ? 'fundraising' : 'close';
}

function calculateProgress(fund: Fund): number {
  if (fund.fractionNum === 0) return 0;
  // Если все доли проданы или не активен, показываем 100%
  if (fund.status !== 'ACTIVE' || fund.purchasedFractionNum >= fund.fractionNum) return 100;
  return Math.min((fund.purchasedFractionNum / fund.fractionNum) * 100, 100);
}

function isFundClosed(fund: Fund): boolean {
  return fund.status !== 'ACTIVE' || fund.purchasedFractionNum >= fund.fractionNum;
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

// Computed values for filter labels
function getTypeLabel(): string {
  const activeTypes = props.typeItems.filter(item => item.active);
  if (activeTypes.length === 0 || activeTypes.length === props.typeItems.length) {
    return 'All';
  }
  if (activeTypes.length === 1) {
    return activeTypes[0].title;
  }
  return `${activeTypes.length} selected`;
}

function getStatusLabel(): string {
  const activeStatuses = props.statusItems.filter(item => item.active);
  if (activeStatuses.length === 0 || activeStatuses.length === props.statusItems.length) {
    return 'All';
  }
  if (activeStatuses.length === 1) {
    return activeStatuses[0].title;
  }
  return `${activeStatuses.length} selected`;
}

function getSortByLabel(): string {
  const activeSort = props.sortByItems.find(item => item.id === props.sortByActive);
  return activeSort ? activeSort.title : 'Latest';
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
          <h4>{{ getTypeLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="item" @click="openStatus">
        <div class="context">
          <p>status</p>
          <h4>{{ getStatusLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="item" @click="openSortBy">
        <div class="context">
          <p>sort by</p>
          <h4>{{ getSortByLabel() }}</h4>
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
              <p>#{{ fund.gift.num }}</p>
            </div>
            <div class="status" :class="getStatusClass(fund)">
              <p>{{ isFundClosed(fund) ? 'Closed' : 'Fundraising' }}</p>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <div class="mark">
                <p>PRICE</p>
              </div>
              <div class="amount">
                <h4>{{ formatNumber(fund.valuation) }}</h4>
                <img :src="TonIcon" alt="ton-icon" />
              </div>
            </div>

            <div class="stat">
              <div class="mark">
                <p>Collected</p>
              </div>
              <div class="amount">
                <h4>{{ formatNumber(fund.purchasedFractionNum * fund.fractionPrice) }}</h4>
                <img :src="TonIcon" alt="ton-icon" />
              </div>
            </div>

            <div class="stat">
              <div class="mark">
                <p>share price</p>
              </div>
              <div class="amount">
                <h4>{{ formatNumber(fund.fractionPrice) }}</h4>
                <img :src="TonIcon" alt="ton-icon" />
              </div>
            </div>
          </div>
          <div class="progress">
            <div class="progress-line">
              <div class="line" :class="{ done: isFundClosed(fund) }" :style="{ '--w-progress': `${calculateProgress(fund)}%` }"></div>
            </div>
            <div class="context">
              <h4>Share pool</h4>
              <p v-if="!isFundClosed(fund)">{{ formatNumber(fund.purchasedFractionNum) }}/{{ formatNumber(fund.fractionNum) }}</p>
              <p v-else>{{ formatNumber(fund.fractionNum) }}/{{ formatNumber(fund.fractionNum) }}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p v-if="!isFundClosed(fund)">Time until fundraising end</p>
          <p v-else>Funding Closed</p>
          <p v-if="!isFundClosed(fund)" class="timer" :class="{ ended: isTimeEnded(fund.deadline) }">
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