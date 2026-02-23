<script setup lang="ts">
import { useRouter } from "vue-router";
import type { FundDetail } from "../../../../types/funds";

const props = defineProps<{
  fund: FundDetail;
}>();

const router = useRouter();

const emit = defineEmits<{
  (e: "buy-shares"): void;
}>();

function goBack() {
  router.back();
}

function handleBuy() {
  if (props.fund.status === 'ACTIVE' && props.fund.purchasedFractionNum < props.fund.fractionNum) {
    emit('buy-shares');
  }
}

const canBuy = () => props.fund.status === 'ACTIVE' && props.fund.purchasedFractionNum < props.fund.fractionNum;
</script>

<template>
  <div class="button-bar">
    <button class="back-btn" :class="{ 'back-btn--full': fund.status === 'COMPLETED' }" @click="goBack">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-if="fund.status === 'COMPLETED'" class="back-btn__label">Back</span>
    </button>
    <template v-if="fund.status !== 'COMPLETED'">
      <button class="buy-btn" :class="{ disabled: !canBuy() }" @click="handleBuy">
        <h4 v-if="canBuy()">Buy Shares</h4>
        <h4 v-else-if="fund.status === 'CANCELLED'">Cancelled</h4>
        <h4 v-else-if="fund.status === 'BUYING'">Buying...</h4>
        <h4 v-else>Sold Out</h4>
      </button>
    </template>
  </div>
</template>

<style lang="scss" src="./Button.scss" scoped></style>
