<script setup lang="ts">
import type { CraftPool } from "../../../../types/craft";

import TonIcon from "@/assets/icons/ton.svg";

const PLACEHOLDER = "https://nft.fragment.com/gift/InstantRamen-133166.webp";

const props = defineProps<{
  pool: CraftPool;
}>();

function giftImage(): string {
  return props.pool.giftInfo?.image || PLACEHOLDER;
}
</script>

<template>
  <div class="head">
    <div class="cover" :style="{
      '--around-color': '#9662D4',
      '--center-color': '#CA70C6',
    }">
      <div class="image">
        <img :src="giftImage()" :alt="pool.giftInfo?.title || 'Gift'" />
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="mark">
          <p>gift contribution</p>
        </div>
        <div class="amount">
          <h4>0.20</h4>
          <img :src="TonIcon" alt="ton" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>min contribution</p>
        </div>
        <div class="amount">
          <h4>1</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
