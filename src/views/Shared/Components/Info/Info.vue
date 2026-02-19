<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { FundDetail } from "../../../../types/funds";

// Icons
import InfoIcon from "@/assets/icons/info.svg?raw";

const props = defineProps<{
  typeShared: string;
  fund: FundDetail;
}>();

const skeleton = ref<boolean>(false);
const currentTime = ref(Date.now());

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function calculateProgress(): number {
  if (props.fund.fractionNum === 0) return 0;
  // Если фонд закрыт (не активен) или все доли проданы, показываем полный прогресс
  if (props.fund.status !== 'ACTIVE' || props.fund.purchasedFractionNum >= props.fund.fractionNum) return 100;
  return Math.min((props.fund.purchasedFractionNum / props.fund.fractionNum) * 100, 100);
}

function isFundClosed(): boolean {
  return props.fund.status !== 'ACTIVE' || props.fund.purchasedFractionNum >= props.fund.fractionNum;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}

const availableShares = computed(() => {
  return props.fund.fractionNum - props.fund.purchasedFractionNum;
});

const shareholdersCount = computed(() => {
  return props.fund.fractions.length;
});

let timerInterval: number | null = null;

onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 60000) as unknown as number; // Update every minute
});

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
</script>

<template>
  <div class="info" :class="{ skeleton }">
    
    <div class="head">
      <div v-if="props.typeShared === 'gift'" class="context">
        <h4>{{ fund.gift.title }}</h4>
        <p>#{{ fund.gift.num }}</p>
      </div>
      <div v-if="props.typeShared === 'anonymous'" class="context">
        <h4>{{ fund.gift.title }}</h4>
        <p>#{{ fund.gift.num }}</p>
      </div>
      <div class="status" :class="{ fundraising: !isFundClosed(), close: isFundClosed() }">
        <p>{{ isFundClosed() ? 'Closed' : 'Fundraising' }}</p>
      </div>
    </div>

    <div class="progress">
      <div class="progress-line">
        <div class="line" :class="{ done: isFundClosed() }" :style="{ '--w-progress': `${calculateProgress()}%` }"></div>
      </div>

      <div class="context">
        <h4>Share pool</h4>
        <p v-if="!isFundClosed()">{{ formatNumber(fund.purchasedFractionNum) }}/{{ formatNumber(fund.fractionNum) }}</p>
        <p v-else>{{ formatNumber(fund.fractionNum) }}/{{ formatNumber(fund.fractionNum) }}</p>
      </div>
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>Funding End Date</p>
          <h4>{{ formatDate(fund.deadline) }}</h4>
        </div>
      </div>
      <!-- <div class="item">
        <div class="context">
          <p>Time Remaining</p>
          <h4>{{ calculateTimeRemaining(fund.deadline) }}</h4>
        </div>
      </div> -->
      <div class="item">
        <div class="context">
          <p>Shares Available</p>
          <span>{{ formatNumber(availableShares) }}</span>
        </div>
        <div class="mark">
          <div class="kit-icon" v-html="InfoIcon"></div>
        </div>
      </div>
    </div>

    <div class="holders" v-if="shareholdersCount > 0">
      <div class="items">
        <div
          class="item"
          v-for="(fraction, _) in fund.fractions.slice(0, 5)"
          :key="fraction.id"
        >
          <img
            v-if="fraction.user.photoUrl"
            :src="fraction.user.photoUrl"
            :alt="fraction.user.firstName"
          />
        </div>
      </div>
      <div class="title">
        <h4>{{ shareholdersCount }} SHAREHOLDER{{ shareholdersCount !== 1 ? 'S' : '' }}</h4>
      </div>
    </div>
    <div class="holders" v-else>
      <div class="title">
        <h4>NO SHAREHOLDERS YET</h4>
      </div>
    </div>

  </div>
</template>

<style lang="scss" src="./Info.scss" scoped></style>