<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { showMenu } from "../../../../utils/useApp";
import { useModal } from "../../../../components/common/Modal";
import { giftsApi } from "../../../../api/gifts";
import type { Gift } from "../../../../types/gifts";

import SelectGifts from "./Pages/SelectGifts/SelectGifts.vue";
import Item from "./Components/Modals/Item.vue";

// Icons
import TonIcon from "@/assets/icons/ton.svg?raw";

const { open } = useModal();

const pageType = ref('');
const gifts = ref<Gift[]>([]);
const loading = ref<boolean>(true);

const emit = defineEmits<{
  (e: "setSection", id: string): void;
  (e: "setPage", name: string): void;
}>();

const props = defineProps<{
  sectionActive: string;
  sections: any[];
  page: string;
}>();

async function openItem(gift: Gift) {
  const choose = open(Item, {
    gift: gift,
    onOpenSelectGifts: openSelectGifts,
  });
  await choose.done.catch(() => null);
}

function openSelectGifts() {
  pageType.value = 'portfolio/select-gifts';
  emit("setPage", 'portfolio/select-gifts');
}

async function fetchGifts() {
  try {
    loading.value = true;
    gifts.value = await giftsApi.getGifts();
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.page,
  (page) => {
    if (page === "portfolio") {
      pageType.value = '';
      showMenu();
    }
  },
  { immediate: true },
);

onMounted(() => {
  showMenu();
  fetchGifts();
});
</script>

<template>
  <div v-if="!pageType" class="pg">
    <div v-if="loading" class="loading-message">
      <p>Loading gifts...</p>
    </div>
    <div v-else-if="!loading && gifts.length === 0" class="empty-message">
      <p>No gifts available</p>
    </div>
    <div v-else class="items">
      <div v-for="gift in gifts" :key="gift.id" class="item" @click="openItem(gift)">
        <div class="cover">
          <img :src="gift.image" :alt="gift.title">
          <span>#{{ gift.num }}</span>
        </div>
        <div class="context">
          <div class="title">
            <h4>{{ gift.title }}</h4>
          </div>
          <div class="value">
            <p>{{ gift.cost.toLocaleString() }}</p>
            <div class="kit-icon" v-html="TonIcon"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SelectGifts v-else-if="pageType === 'portfolio/select-gifts'" />
</template>

<style lang="scss" src="./Portfolio.scss" scoped></style>