<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { showMenu } from "../../../../utils/useApp";
import { useModal } from "../../../../components/common/Modal";
import { giftsApi } from "../../../../api/gifts";
import type { Gift } from "../../../../types/gifts";

import SelectGifts from "./Pages/SelectGifts/SelectGifts.vue";
import Item from "./Components/Modals/Item.vue";
import { useCacheStore } from "../../../../stores/pinia-store";

// Icons
import TonIcon from "@/assets/icons/ton.svg?raw";

const { open } = useModal();
const useCache = useCacheStore();

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
    onOpenSelectGifts: (selectedGift: Gift) => openSelectGifts(selectedGift),
  });
  await choose.done.catch(() => null);
}

function openSelectGifts(preselectedGift?: Gift) {
  if (preselectedGift) {
    useCache.PortfolioSelectedGiftsBurn = [preselectedGift];
  }
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
    <div v-if="loading" class="items">
      <div v-for="i in 6" :key="i" class="item skeleton-card">
        <div class="cover sk-load"></div>
        <div class="context">
          <div class="sk-load sk-title"></div>
          <div class="sk-load sk-value"></div>
        </div>
      </div>
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
            <p>{{ (gift.cost ?? 0).toLocaleString() }}</p>
            <div class="kit-icon" v-html="TonIcon"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SelectGifts v-else-if="pageType === 'portfolio/select-gifts'" />
</template>

<style lang="scss" src="./Portfolio.scss" scoped></style>