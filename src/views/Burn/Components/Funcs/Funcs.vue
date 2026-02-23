<script setup lang="ts">
import { computed } from "vue";
import type { Auction } from "@/types/auctions";

// Icons
import GiftIcon from "@/assets/icons/gift.svg?raw";
import TonIcon from "@/assets/icons/ton.svg?raw";
import PointIcon from "@/assets/icons/point.svg?raw";
import FireIcon from "@/assets/icons/fire.svg?raw";

const props = defineProps<{
  auctions: Auction[];
}>();

const totalPurchasedSum = computed(() =>
  props.auctions.reduce((s, a) => s + (a.purchasedSum ?? 0), 0)
);
const totalTargetSum = computed(() =>
  props.auctions.reduce((s, a) => s + (a.targetSum ?? 0), 0)
);
const progressPercent = computed(() => {
  const purchased = totalPurchasedSum.value;
  const target = totalTargetSum.value;
  if (target === 0) return purchased > 0 ? 100 : 0;
  return Math.min((purchased / target) * 100, 100);
});

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}
</script>

<template>
  <div class="funcs">
    <div class="progress">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
      </div>
    </div>
    <div class="info">
      <div class="left">
        <div class="item">
          <h4>{{ formatNumber(auctions.length) }}</h4>
          <div class="kit-icon" v-html="GiftIcon"></div>
        </div>
        <div class="item">
          <h4>{{ formatNumber(totalPurchasedSum) }}</h4>
          <div class="kit-icon" v-html="TonIcon"></div>
        </div>
        <div class="item point">
          <h4>+{{ formatNumber(Math.floor(totalPurchasedSum * 16.25)) }}</h4>
          <div class="kit-icon" v-html="PointIcon"></div>
        </div>
      </div>
      <div class="right">
        <div class="kit-icon" v-html="FireIcon"></div>
        <h4>Burn</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Funcs.scss" scoped></style>
<style scoped>
</style>