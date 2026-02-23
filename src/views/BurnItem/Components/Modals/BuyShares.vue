<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { AuctionDetail } from "@/types/auctions";
import { auctionsApi } from "@/api/auctions";

// Components
import SharesSlider from "./SharesSlider.vue";

// Images
import TickSuccess from "@/assets/images/shared-pg/tick-success.png";
import TickError from "@/assets/images/shared-pg/tick-error.png";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import CloseIcon from "@/assets/icons/close.svg?raw";
import FireRawIcon from "@/assets/icons/fire.svg?raw";
import PointRawIcon from "@/assets/icons/point.svg?raw";

const props = defineProps<{
  auction?: AuctionDetail;
}>();

const shares = ref(1);
const status = ref<"progress" | "success" | "error" | "none">("none");
const errorMessage = ref("");

const emit = defineEmits<{
  (e: "close"): void;
}>();

const firstGift = computed(() => props.auction?.gifts?.[0]);
const giftsCount = computed(() => {
  const a = props.auction as any;
  if (a?.giftsCount != null) return a.giftsCount;
  const g = a?.gifts;
  if (Array.isArray(g)) return g.length;
  if (g?.count != null) return g.count;
  return firstGift.value ? 1 : 1;
});
const minPriceBurn = computed(() => Math.max(1, props.auction?.giftPriceOnStart ?? 0));
const totalSum = computed(() => minPriceBurn.value * shares.value);
const burningReward = computed(() => Math.floor(totalSum.value * 16.25));
const maxShares = computed(() => Math.max(1, Math.min(6, giftsCount.value)));

watch(
  () => props.auction,
  () => { shares.value = 1; },
  { immediate: true }
);
watch(maxShares, (max) => {
  if (shares.value > max) shares.value = max;
}, { immediate: true });

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function close() {
  emit("close");
}

async function handleBurn() {
  if (!props.auction) return;
  status.value = "progress";
  errorMessage.value = "";
  try {
    await auctionsApi.participate(props.auction.id, totalSum.value);
    status.value = "success";
  } catch (e: any) {
    status.value = "error";
    errorMessage.value = e?.response?.data?.message ?? e?.message ?? "Your purchase could not be completed. Please make sure you have enough balance or try again.";
  }
}

function retryPayment() {
  status.value = "none";
}
</script>

<template>
  <div v-if="status === 'progress'" class="sheet progress">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="loader"></div>
    <div class="context">
      <div class="title">
        <h4>Payment in progress</h4>
      </div>
      <div class="descr">
        <p>Please wait while we process your payment</p>
      </div>
    </div>
  </div>

  <div v-if="status === 'success'" class="sheet success">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="TickSuccess" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Burn successful</h4>
      </div>
      <div class="info">
        <h4>+{{ formatNumber(burningReward) }}</h4>
        <div class="kit-icon" v-html="PointRawIcon"></div>
      </div>
    </div>
    <div class="button">
      <button @click="close">
        <h4>Good</h4>
      </button>
    </div>
  </div>

  <div v-if="status === 'error'" class="sheet error">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="TickError" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Payment failed</h4>
      </div>
      <div class="descr">
        <p>{{ errorMessage || "Your purchase could not be completed. Please make sure you have enough balance or try again" }}</p>
      </div>
    </div>
    <div class="button">
      <button @click="retryPayment">
        <h4>Retry payment</h4>
      </button>
    </div>
  </div>

  <div v-if="status === 'none'" class="sheet">
    <div class="head">
      <div class="title">
        <h4>Buy shares</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    
    <div class="info">
      <div class="image">
        <img :src="firstGift?.image || 'https://nft.fragment.com/gift/InstantRamen-133167.webp'" :alt="firstGift?.title || 'Gift'">
      </div>
      <div class="context">
        <h4>{{ firstGift?.title || "Gift" }}</h4>
        <p>x{{ giftsCount }}</p>
      </div>
    </div>

    <div class="shares-range">
      <SharesSlider v-model="shares" :min="1" :max="maxShares" />
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>min price burn</p>
          <div class="flexed">
            <h4>{{ formatNumber(minPriceBurn) }}</h4>
            <img :src="TonIcon" alt="ton-icon" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Burning reward</p>
          <div class="flexed">
            <h4>{{ formatNumber(burningReward) }}</h4>
            <div class="kit-icon point" v-html="PointRawIcon"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="amount">
        <img :src="TonIcon" alt="ton-icon" />
        <h4>{{ formatNumber(totalSum) }}</h4>
      </div>
      <div class="button">
        <button @click="handleBurn">
          <div class="kit-icon" v-html="FireRawIcon"></div>
          <h4>Burn</h4>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./BuyShares.scss" scoped></style>