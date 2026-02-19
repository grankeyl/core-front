<script setup lang="ts">
import { ref } from "vue";
import type { AuctionDetail } from "../../../../../types/auctions";

// Images
import TgImage from "@/assets/images/shared-pg/tg.png";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import PointIcon from "@/assets/icons/point.svg";

const props = defineProps<{
  typeShared: string;
  auction: AuctionDetail;
}>();

const skeleton = ref<boolean>(false);

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div v-if="props.typeShared === 'gift'" class="cover" :style="{
      '--around-color': '#9662D4',
      '--center-color': '#CA70C6',
      '--cover-image': props.auction.gift.image,
    }">
      <div class="image">
        <img :src="props.auction.gift.image" :alt="props.auction.gift.title">
      </div>
    </div>

    <div v-if="props.typeShared === 'anonymous'" class="cover" :style="{
      '--around-color': '#000000',
      '--center-color': '#615660',
      '--cover-image': 'https://nft.fragment.com/gift/plushpepe-455.large.jpg',
    }">
      <div class="image">
        <img :src="TgImage" alt="tg-image">
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="mark">
          <p>min price burn</p>
        </div>
        <div class="amount">
          <h4>{{ formatNumber(props.auction.giftPriceOnStart) }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>quantity gifts</p>
        </div>
        <div class="amount">
          <h4>1</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>core points</p>
        </div>
        <div class="amount">
          <h4>2,300</h4>
          <img :src="PointIcon" alt="ton-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>