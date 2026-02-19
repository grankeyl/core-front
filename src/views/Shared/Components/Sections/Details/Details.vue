<script setup lang="ts">
import { ref } from "vue";
import type { FundDetail } from "../../../../../types/funds";

const props = defineProps<{
  typeShared: string;
  fund: FundDetail;
}>();

const skeleton = ref<boolean>(false);

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
</script>

<template>
  <div class="details" :class="{ skeleton }">
    <div v-if="props.typeShared === 'gift'" class="items">
      <div class="item">
        <div class="left">
          <p>Model</p>
        </div>
        <div class="right">
          <h4>Cozy Galaxy</h4>
          <span>1.3%</span>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <p>Backdrop</p>
        </div>
        <div class="right">
          <h4>Cozy Galaxy</h4>
          <span>1.3%</span>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <p>Symbol</p>
        </div>
        <div class="right">
          <h4>Cozy Galaxy</h4>
          <span>1.3%</span>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <p>Issued</p>
        </div>
        <div class="right">
          <h4>{{ formatNumber(fund.gift.availabilityIssued) }} of {{ formatNumber(fund.gift.availabilityTotal) }}</h4>
        </div>
      </div>
    </div>
    <div v-if="props.typeShared === 'anonymous'" class="description">
      <p>Trade IDs not tied to a SIM card which allow logging into Telegram with your blockchain account. These numbers only work on Telegram.</p>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Details.scss"></style>