<script setup lang="ts">
import { computed, ref } from "vue";

// @ts-ignore
import type { Gift } from "@/types/gifts";
import { auctionsApi } from "@/api/auctions";

// Icons
import CloseIcon from "@/assets/icons/close.svg?raw";
import FireRawIcon from "@/assets/icons/fire.svg?raw";
import InfoRawIcon from "@/assets/icons/info.svg?raw";
import TonRawIcon from "@/assets/icons/ton.svg?raw";
import PointRawIcon from "@/assets/icons/point.svg?raw";

const props = defineProps<{
  items: Gift[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "resolve", payload: { burned: boolean }): void;
}>();

const loading = ref(false);
const error = ref("");

const totalGifts = computed(() => props.items.length);

const totalValue = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.cost || 0), 0);
});

const burnReward = computed(() => {
  return Math.floor(totalValue.value * 0.45);
});

const burnPoints = computed(() => {
  return Math.floor(totalValue.value * 0.1);
});

function close() {
  emit("close");
}

async function burn() {
  if (!props.items.length || loading.value) return;
  loading.value = true;
  error.value = "";
  try {
    await auctionsApi.createAuction(props.items.map((g) => g.id));
    emit("resolve", { burned: true });
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? "Failed to burn gifts";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="sheet">
    <div class="head">
      <div class="info">
        <div class="kit-icon" v-html="InfoRawIcon"></div>
      </div>
      <div class="title">
        <h4>Confirm the Burn</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>

    <div class="items">
      <div v-for="item in items" :key="item.id" class="item">
        <div class="image">
          <img :src="item.image || 'https://nft.fragment.com/gift/lovepotion-25434.large.jpg'" alt="">
        </div>
      </div>
    </div>

    <div class="info">
      <div class="item">
        <div class="left">
          <h4>Total gifts</h4>
        </div>
        <div class="right">
          <h4>{{ totalGifts }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <h4>Total Gift Value</h4>
        </div>
        <div class="right">
          <h4>{{ totalValue.toLocaleString() }}</h4>
          <div class="kit-icon" v-html="TonRawIcon"></div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <h4>You Will Receive</h4>
        </div>
        <div class="right">
          <h4>{{ burnReward.toLocaleString() }}</h4>
          <div class="kit-icon" v-html="TonRawIcon"></div>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <h4>Burn Reward Points</h4>
        </div>
        <div class="right">
          <h4>{{ (burnPoints / 1000).toFixed(1) }}k</h4>
          <div class="kit-icon" v-html="PointRawIcon"></div>
        </div>
      </div>
    </div>

    <div class="banner">
      <div class="mark">
        <div class="kit-icon" v-html="InfoRawIcon"></div>
      </div>
      <div class="text">
        <h4>Gifts that remain unburned for 5 hours will be returned to you.</h4>
      </div>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div class="footer">
      <div class="burn" :class="{ disabled: loading }" @click="burn">
        <div class="context">
          <div class="kit-icon" v-html="FireRawIcon"></div>
          <h4>{{ loading ? "..." : "Burn" }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./BurnGifts.scss" scoped></style>