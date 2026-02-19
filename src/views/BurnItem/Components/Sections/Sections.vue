<script setup lang="ts">
import { ref } from "vue";
import type { AuctionDetail } from "@/types/auctions";

// Components
import Holders from "./Holders/Holders.vue";

const props = defineProps<{
  typeShared: string;
  auction: AuctionDetail;
}>();

const skeleton = ref<boolean>(false);
</script>

<template>
  <div class="sections" :class="{ skeleton }">
    <div class="flexer">
      <Holders :auction="props.auction" />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Sections.scss"></style>