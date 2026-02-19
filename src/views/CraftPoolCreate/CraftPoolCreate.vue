<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { hideMenu } from "../../utils/useApp";
import type { Gift } from "../../types/gifts";
import { mockGifts } from "../../mocks/craft";

const router = useRouter();
const gifts = ref<Gift[]>([]);
const selected = ref<Set<string>>(new Set());
const loading = ref(true);
const creating = ref(false);

const canCreate = computed(() => selected.value.size > 0);

async function fetchGifts() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 300));
  gifts.value = mockGifts;
  loading.value = false;
}

function toggleGift(id: string) {
  const s = new Set(selected.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selected.value = s;
}

async function handleCreate() {
  if (!canCreate.value || creating.value) return;
  creating.value = true;
  await new Promise((r) => setTimeout(r, 800));
  creating.value = false;
  router.replace("/craft-pools/pool/pool-1");
}

onMounted(() => {
  hideMenu();
  fetchGifts();
});
</script>

<template>
  <div class="section create-pool">
    <div class="header">
      <h2>Create Pool</h2>
      <p class="desc">Select gifts from your wallet to start a crafting pool</p>
    </div>

    <div v-if="loading" class="loader-wrap">
      <div class="loader"></div>
    </div>

    <div v-else-if="gifts.length === 0" class="empty">
      <p>No gifts available in your wallet</p>
    </div>

    <div v-else class="gift-grid">
      <div
        v-for="gift in gifts"
        :key="gift.id"
        class="gift-card"
        :class="{ selected: selected.has(gift.id) }"
        @click="toggleGift(gift.id)"
      >
        <div class="image">
          <img :src="gift.image" :alt="gift.title" />
          <div v-if="selected.has(gift.id)" class="check-overlay">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#355DFF"/>
              <path d="M9 14.5l3 3L19 10.5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="info">
          <h4>{{ gift.title }}</h4>
          <p>#{{ gift.num }}</p>
        </div>
      </div>
    </div>

    <div class="bottom-action">
      <div v-if="selected.size > 0" class="summary">
        <p>Selected: <strong>{{ selected.size }} gift{{ selected.size > 1 ? 's' : '' }}</strong></p>
      </div>
      <button
        class="create-btn"
        :class="{ disabled: !canCreate }"
        :disabled="!canCreate || creating"
        @click="handleCreate"
      >
        <span v-if="creating">Creating...</span>
        <span v-else>Create Pool</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./CraftPoolCreate.scss" scoped></style>
