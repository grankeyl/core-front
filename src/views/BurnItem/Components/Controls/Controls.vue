<script setup lang="ts">
import { onMounted } from "vue";
import { useModal } from "../../../../components/common/Modal";
import { useRouter } from "vue-router";
import type { AuctionDetail } from "../../../../types/auctions";

import BurnRawIcon from "@/assets/icons/fire.svg?raw";
import BuyShares from "./../Modals/BuyShares.vue";
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw";

const { open } = useModal();

const emit = defineEmits<{
  (e: "participated"): void;
}>();
const props = defineProps<{
  auction: AuctionDetail;
}>();

const router = useRouter();

function handleClickBack() {
  router.back();
}

async function openBurnGifts() {
  const choose = open(BuyShares, { auction: props.auction });
  await choose.done.catch(() => null);
  emit("participated");
}

onMounted(() => {
});
</script>

<template>
  <div class="inner">
    <div class="back" @click="handleClickBack">
      <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
    </div>
    <div class="burn">
      <button @click="openBurnGifts">
        <div class="context">
          <div class="kit-icon" v-html="BurnRawIcon"></div>
          <h4>Burn</h4>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./Controls.scss" scoped></style>