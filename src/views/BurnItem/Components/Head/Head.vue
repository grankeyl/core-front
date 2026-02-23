<script setup lang="ts">
import { ref, computed } from "vue";
import type { AuctionDetail } from "@/types/auctions";

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
const firstGift = computed(() => props.auction.gifts?.[0]);
const giftsCount = computed(() => {
  const a = props.auction as any;
  if (a?.giftsCount != null) return a.giftsCount;
  const g = a?.gifts;
  if (Array.isArray(g)) return g.length;
  if (g?.count != null) return g.count;
  return firstGift.value ? 1 : 0;
});

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function intToHex(n: number): string {
  return "#" + n.toString(16).padStart(6, "0");
}

const coverColors = computed(() => {
  const attrs = (firstGift.value as any)?.attributes;
  const bd = attrs?.backdrop as { centerColor?: number; edgeColor?: number; textColor?: number; patternColor?: number } | undefined;
  if (bd) {
    return {
      center: intToHex(bd.centerColor ?? 0xca70c6),
      around: intToHex(bd.edgeColor ?? 0x9662d4),
      text: intToHex(bd.textColor ?? 0),
      pattern: intToHex(bd.patternColor ?? 0x333333),
    };
  }
  return { center: "#CA70C6", around: "#9662D4", text: "#000", pattern: "#333" };
});

const giftImage = computed(() => {
  const attrs = (firstGift.value as any)?.attributes;
  const model = attrs?.model as { image?: string } | undefined;
  if (model?.image) return model.image;
  return firstGift.value?.image || "";
});
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div v-if="props.typeShared === 'gift' && firstGift" class="cover" :style="{
      '--around-color': coverColors.around,
      '--center-color': coverColors.center,
      '--text-color': coverColors.text,
      '--pattern-color': coverColors.pattern,
    }">
      <div class="image">
        <img :src="giftImage || firstGift.image || 'https://nft.fragment.com/gift/InstantRamen-133167.webp'" :alt="firstGift.title || 'Gift'">
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
          <h4>{{ formatNumber(props.auction.giftPriceOnStart ?? 0) }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>quantity gifts</p>
        </div>
        <div class="amount">
          <h4>{{ giftsCount }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
      <div class="stat">
        <div class="mark">
          <p>core points</p>
        </div>
        <div class="amount">
          <h4>{{ formatNumber(props.auction.purchasedSum ?? 0) }}</h4>
          <img :src="PointIcon" alt="ton-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>