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

function openItem(fund: Fund) {
  if (fund.status === 'CANCELLED') return;
  router.push(`/shared/${fund.id}`);
}

function getStatusClass(fund: Fund): string {
  switch (fund.status) {
    case 'ACTIVE': return 'active';
    case 'BUYING': return 'buying';
    case 'COMPLETED': return 'completed';
    case 'CANCELLED': return 'cancelled';
    default: return 'active';
  }
}

function getStatusLabel(fund: Fund): string {
  switch (fund.status) {
    case 'ACTIVE': return 'Active';
    case 'BUYING': return 'Buying';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    default: return fund.status;
  }
}

function calculateProgress(fund: Fund): number {
  if (fund.fractionNum === 0) return 0;
  if (fund.status === 'COMPLETED' || fund.status === 'BUYING') return 100;
  if (fund.status === 'CANCELLED') {
    return Math.min((fund.purchasedFractionNum / fund.fractionNum) * 100, 100);
  }
  return Math.min((fund.purchasedFractionNum / fund.fractionNum) * 100, 100);
}

function isProgressDone(fund: Fund): boolean {
  return fund.status === 'COMPLETED' || fund.status === 'BUYING' ||
    fund.purchasedFractionNum >= fund.fractionNum;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function calculateTimeRemaining(deadline: string): string {
  const deadlineTime = new Date(deadline).getTime();
  const diff = deadlineTime - currentTime.value;
  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function isTimeEnded(deadline: string): boolean {
  return new Date(deadline).getTime() - currentTime.value <= 0;
}

function getFooterText(fund: Fund): string {
  switch (fund.status) {
    case 'ACTIVE': return 'Time until fundraising end';
    case 'BUYING': return 'Gift is being purchased';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    default: return '';
  }
}

function getTypeLabel(): string {
  const activeTypes = props.typeItems.filter(item => item.active);
  if (activeTypes.length === 0 || activeTypes.length === props.typeItems.length) return 'All';
  if (activeTypes.length === 1) return activeTypes[0].title;
  return `${activeTypes.length} selected`;
}

function getStatusLabel2(): string {
  const activeStatuses = props.statusItems.filter(item => item.active);
  if (activeStatuses.length === 0 || activeStatuses.length === props.statusItems.length) return 'All';
  if (activeStatuses.length === 1) return activeStatuses[0].title;
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
      <div class="item" @click="emit('open-type')">
        <div class="context">
          <p>TYPE</p>
          <h4>{{ getTypeLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
      <div class="item" @click="emit('open-status')">
        <div class="context">
          <p>status</p>
          <h4>{{ getStatusLabel2() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
      <div class="item" @click="emit('open-sort-by')">
        <div class="context">
          <p>sort by</p>
          <h4>{{ getSortByLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
    </div>

    <div class="lists">
      <template v-if="loading && funds.length === 0">
        <div v-for="i in 4" :key="i" class="item sk-card">
          <div class="inner">
            <div class="head">
              <div class="sk-image sk-load"></div>
              <div class="sk-context">
                <div class="sk-line sk-load" style="width: 60%"></div>
                <div class="sk-line sk-load" style="width: 35%"></div>
              </div>
              <div class="sk-badge sk-load"></div>
            </div>
            <div class="stats">
              <div v-for="j in 3" :key="j" class="stat">
                <div class="sk-line sk-load" style="width: 50%; height: 10px"></div>
                <div class="sk-line sk-load" style="width: 70%; height: 16px; margin-top: 4px"></div>
              </div>
            </div>
            <div class="sk-progress sk-load"></div>
          </div>
          <div class="sk-footer sk-load"></div>
        </div>
      </template>
      <div v-else-if="!loading && funds.length === 0" class="empty-message">
        <p>No funds available</p>
      </div>
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="item"
        @click="openItem(fund)"
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
              <p>{{ getStatusLabel(fund) }}</p>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <div class="mark"><p>PRICE</p></div>
              <div class="amount">
                <h4>{{ formatNumber(fund.valuation) }}</h4>
                <img :src="TonIcon" alt="" />
              </div>
            </div>
            <div class="stat">
              <div class="mark"><p>Collected</p></div>
              <div class="amount">
                <h4>{{ formatNumber(fund.purchasedFractionNum * fund.fractionPrice) }}</h4>
                <img :src="TonIcon" alt="" />
              </div>
            </div>
            <div class="stat">
              <div class="mark"><p>share price</p></div>
              <div class="amount">
                <h4>{{ formatNumber(fund.fractionPrice) }}</h4>
                <img :src="TonIcon" alt="" />
              </div>
            </div>
          </div>
          <div class="progress">
            <div class="progress-line">
              <div
                class="line"
                :class="{
                  done: isProgressDone(fund),
                  cancelled: fund.status === 'CANCELLED'
                }"
                :style="{ '--w-progress': `${calculateProgress(fund)}%` }"
              ></div>
            </div>
            <div class="context">
              <h4>Share pool</h4>
              <p>{{ formatNumber(fund.purchasedFractionNum) }}/{{ formatNumber(fund.fractionNum) }}</p>
            </div>
          </div>
        </div>
        <div class="footer" :class="getStatusClass(fund)">
          <p>{{ getFooterText(fund) }}</p>
          <p
            v-if="fund.status === 'ACTIVE'"
            class="timer"
            :class="{ ended: isTimeEnded(fund.deadline) }"
          >
            {{ calculateTimeRemaining(fund.deadline) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
