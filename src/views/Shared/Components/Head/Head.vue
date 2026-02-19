<script setup lang="ts">
import { ref, computed } from "vue";
import type { FundDetail } from "../../../../types/funds";

// Images
import TgImage from "@/assets/images/shared-pg/tg.png";

// Icons
import TonIcon from "@/assets/icons/ton.svg";

const props = defineProps<{
  typeShared: string;
  fund: FundDetail;
}>();

const skeleton = ref<boolean>(false);

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

const collectedAmount = computed(() => {
  return props.fund.purchasedFractionNum * props.fund.fractionPrice;
});
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div v-if="props.typeShared === 'gift'" class="cover" :style="{
      '--around-color': '#9662D4',
      '--center-color': '#CA70C6',
      '--cover-image': fund.gift.image,
    }">
      <div class="image">
        <img :src="fund.gift.image" :alt="fund.gift.title">
      </div>
    </div>

    <div v-if="props.typeShared === 'anonymous'" class="cover" :style="{
      '--around-color': '#000000',
      '--center-color': '#615660',
      '--cover-image': fund.gift.image,
    }">
      <div class="image">
        <img :src="TgImage" alt="tg-image">
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="mark">
          <p>Price</p>
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
          <h4>{{ formatNumber(collectedAmount) }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>Share price</p>
        </div>
        <div class="amount">
          <h4>{{ formatNumber(fund.fractionPrice) }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>