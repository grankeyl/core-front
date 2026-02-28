<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { giftsApi } from "../../../../../../../../api/gifts";
import type { Gift } from "../../../../../../../../types/gifts";
import { useCacheStore } from "../../../../../../../../stores/pinia-store";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";
import GroupsRawIcon from "@/assets/icons/groups.svg?raw";
import DoneRawIcon from "@/assets/icons/done.svg?raw";

// Images
import DaoNo from "@/assets/images/profile-pg/dao-no.png";

const emit = defineEmits<{
  (e: "open-rare"): void;
  (e: "open-status"): void;
  (e: "open-sort-by"): void;
}>();

const props = defineProps<{
}>();

const useCache = useCacheStore();
const loading = ref<boolean>(true);
const gifts = ref<Gift[]>([]);
const selectedGiftIds = ref<Set<string>>(new Set());
const selectAllMode = ref<boolean>(false);

const selectedCount = computed(() => selectedGiftIds.value.size);
const selectedGifts = computed(() => {
  return gifts.value.filter(gift => selectedGiftIds.value.has(gift.id));
});

async function fetchGifts() {
  try {
    loading.value = true;
    const all = await giftsApi.getGifts();
    gifts.value = all.filter(g => g.craftAllowed !== false);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  } finally {
    loading.value = false;
  }
}

function toggleGiftSelection(giftId: string) {
  if (selectedGiftIds.value.has(giftId)) {
    selectedGiftIds.value.delete(giftId);
  } else {
    selectedGiftIds.value.add(giftId);
  }
  // Trigger reactivity
  selectedGiftIds.value = new Set(selectedGiftIds.value);
  updateStoreSelection();
}

function toggleSelectAll() {
  selectAllMode.value = !selectAllMode.value;

  if (selectAllMode.value) {
    // Select all gifts
    selectedGiftIds.value = new Set(gifts.value.map(g => g.id));
  } else {
    // Deselect all
    selectedGiftIds.value.clear();
  }
  selectedGiftIds.value = new Set(selectedGiftIds.value);
  updateStoreSelection();
}

function updateStoreSelection() {
  useCache.PortfolioSelectedGiftsBurn = selectedGifts.value;
}

function isSelected(giftId: string): boolean {
  return selectedGiftIds.value.has(giftId);
}

function openRare() {
  emit('open-rare');
}

onMounted(() => {
  fetchGifts();
  // Initialize from store if exists
  if (useCache.PortfolioSelectedGiftsBurn && useCache.PortfolioSelectedGiftsBurn.length > 0) {
    selectedGiftIds.value = new Set(useCache.PortfolioSelectedGiftsBurn.map((g: any) => g.id));
  }
});
</script>

<template>
  <div class="items" :class="{ skeleton: loading }">
    <div class="filters">
      <div class="item" @click="openRare">
        <div class="context">
          <p>Rare</p>
          <h4>All</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="controls">
        <div class="checkbox" :class="{ active: selectAllMode }" @click="toggleSelectAll">
          <div v-if="selectAllMode" class="kit-icon" v-html="DoneRawIcon"></div>
        </div>
        <div class="border"></div>
        <div class="group">
          <div class="kit-icon" v-html="GroupsRawIcon"></div>
          <span v-if="selectedCount > 0">{{ selectedCount }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="lists">
      <div v-for="i in 9" :key="i" class="item">
        <div class="image sk-load"></div>
      </div>
    </div>

    <div v-else-if="gifts.length === 0" class="no-dao">
      <img :src="DaoNo" alt="no-gifts" />
      <h4>No gifts available</h4>
    </div>

    <div v-else class="lists">
      <div
        v-for="gift in gifts"
        :key="gift.id"
        class="item"
        @click="toggleGiftSelection(gift.id)"
      >
        <div class="image">
          <img :src="gift.image" :alt="gift.title">
        </div>
        <div class="checkbox" :class="{ active: isSelected(gift.id) }">
          <div v-if="isSelected(gift.id)" class="kit-icon" v-html="DoneRawIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
<style scoped>
</style>