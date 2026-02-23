<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useCacheStore } from "../../../../stores/pinia-store";
import { useModal } from "../../../../components/common/Modal";

import BurnRawIcon from "@/assets/icons/fire.svg?raw";
import BurnGifts from "../Modals/BurnGifts.vue";
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw";

const { open } = useModal();

const emit = defineEmits<{
  (e: "setPage", name: string): void;
}>();
const props = defineProps<{
  page: string;
}>();

const useCache = useCacheStore();

const isVisibleBack = ref(false);
const isVisibleVoting = ref(false);
const isVisibleBurn = ref(false);

function handleClickBack() {
  if (props.page === "split/gift") {
    emit("setPage", "split");
  }
  if (props.page === "burns/history") {
    emit("setPage", "burns");
  }
  if (props.page === "portfolio/select-gifts") {
    emit("setPage", "portfolio");
  }
}

watch(
  () => props.page,
  (page) => {
    if (page === "split/gift") {
      isVisibleBack.value = true;
    } else if (page === "burns/history") {
      isVisibleBack.value = true;
    } else if (page === "portfolio/select-gifts") {
      initPortfolioSelectedGiftsBurn();
    } else {
      isVisibleBack.value = false;
      isVisibleVoting.value = false;
      isVisibleBurn.value = false;
    }
  },
  { immediate: true },
);

const initPortfolioSelectedGiftsBurnData = computed(() => {
  const selectedGiftsBurn = useCache.PortfolioSelectedGiftsBurn;
  return {
    count: selectedGiftsBurn.length,
    total: selectedGiftsBurn.length,
    items: selectedGiftsBurn,
  };
});
const initPortfolioSelectedGiftsBurn = () => {
  isVisibleBack.value = true;
  isVisibleBurn.value = true;
};

async function openBurnGifts() {
  const choose = open(BurnGifts, {
    items: initPortfolioSelectedGiftsBurnData.value.items,
  });
  const result = await choose.done.catch(() => null) as any;
  if (result?.burned) {
    useCache.PortfolioSelectedGiftsBurn = [];
    emit("setPage", "portfolio");
  }
}

onMounted(() => {
  if (props.page === "burns/history") {
    isVisibleBack.value = true;
  }
  if (props.page === "portfolio/select-gifts") {
    initPortfolioSelectedGiftsBurn();
  }
});
</script>

<template>
  <div class="inner">
    <div v-if="isVisibleBack" class="back" @click="handleClickBack">
      <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
    </div>
    <div v-if="isVisibleVoting" class="voting">
      <button>
        <h4>Start voting</h4>
      </button>
    </div>
    <div v-if="isVisibleBurn" class="burn">
      <button @click="openBurnGifts">
        <div class="context">
          <div class="kit-icon" v-html="BurnRawIcon"></div>
          <h4>Burn</h4>
        </div>
        <div class="info">
          <p>{{ initPortfolioSelectedGiftsBurnData.count }} Gift</p>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./Controls.scss" scoped></style>