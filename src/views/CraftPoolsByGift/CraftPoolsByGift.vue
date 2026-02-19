<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import type { CraftPool } from "../../types/craft";
import { mockPools } from "../../mocks/craft";

import TonIcon from "@/assets/icons/ton.svg";
import ChevroneRight from "@/assets/icons/chevrone-right.svg";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

const PLACEHOLDER = "https://nft.fragment.com/gift/InstantRamen-133166.webp";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const pools = ref<CraftPool[]>([]);

const slug = computed(() => route.params.slug as string);

const giftTitle = computed(() => {
  if (pools.value.length > 0) return pools.value[0].giftInfo?.title || "Unknown";
  return slug.value;
});

async function fetchPools() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 300));
  pools.value = mockPools.filter((p) => (p.giftInfo?.slug || p.id) === slug.value);
  loading.value = false;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE": return "opened";
    case "COMPLETED": return "my pool";
    case "CLOSED": return "close";
    default: return status;
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case "ACTIVE": return "opened";
    case "COMPLETED": return "my-pool";
    case "CLOSED": return "closed";
    default: return "";
  }
}

function formatDeadline(deadline: string): string {
  if (!deadline) return "";
  const d = new Date(deadline);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function giftImage(pool: CraftPool): string {
  return pool.giftInfo?.image || PLACEHOLDER;
}

function openPool(id: string) {
  router.push(`/craft-pools/pool/${id}`);
}

function handleCreatePool() {
  router.push("/craft-pools/create");
}

function handleOpenMyPools() {
  router.push("/craft-pools/my");
}

onMounted(() => {
  showMenu();
  fetchPools();
});
</script>

<template>
  <div class="craft-by-gift">
    <!-- Header -->
    <div class="top-bar">
      <div class="title">
        <h4>Craft Pools</h4>
      </div>
      <button class="create-btn" @click="handleCreatePool">
        <div class="plus-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="white"/>
            <path d="M7 4v6M4 7h6" stroke="#6900EA" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <span>Create Pool</span>
      </button>
    </div>

    <!-- My Pools -->
    <div class="my-pools" @click="handleOpenMyPools">
      <div class="bg-overlay"></div>
      <div class="content">
        <div class="left">
          <span class="label">My Pools</span>
        </div>
        <img :src="ChevroneRight" alt="arrow" class="arrow-icon" />
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-item">
        <p>TYPE</p>
        <div class="val">
          <h4>All</h4>
          <img :src="ChevroneBottomIcon" alt="v" />
        </div>
      </div>
      <div class="filter-item">
        <p>STATUS</p>
        <div class="val">
          <h4>Fundraisi...</h4>
          <img :src="ChevroneBottomIcon" alt="v" />
        </div>
      </div>
      <div class="filter-item">
        <p>SORT BY</p>
        <div class="val">
          <h4>Price: Lo...</h4>
          <img :src="ChevroneBottomIcon" alt="v" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loader-wrap">
      <div class="loader"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="pools.length === 0" class="empty">
      <p>No pools for this category</p>
    </div>

    <!-- Pool cards -->
    <div v-else class="pool-list">
      <div
        v-for="pool in pools"
        :key="pool.id"
        class="pool-card"
        :class="'status-' + getStatusClass(pool.status)"
        @click="openPool(pool.id)"
      >
        <div class="card-head">
          <div class="gift-img">
            <img :src="giftImage(pool)" :alt="pool.giftInfo?.title" />
          </div>
          <div class="gift-ctx">
            <h4>{{ pool.giftInfo?.title }}</h4>
            <p>#{{ pool.giftInfo?.num }}</p>
          </div>
          <div class="status" :class="getStatusClass(pool.status)">
            <span>{{ getStatusLabel(pool.status) }}</span>
          </div>
        </div>

        <div class="card-stats">
          <div class="stat">
            <p class="label">gift contribution</p>
            <div class="val">
              <h4>0.20</h4>
              <img :src="TonIcon" alt="ton" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="stat">
            <p class="label">min contribution</p>
            <div class="val">
              <h4>1</h4>
            </div>
          </div>
        </div>

        <div class="card-progress">
          <div class="progress-line">
            <div
              class="line"
              :class="{ done: pool.status === 'CLOSED' }"
              :style="{ '--w-progress': `${((pool.members?.length || 0) / 4) * 100}%` }"
            ></div>
          </div>
          <div class="progress-ctx">
            <span class="lbl">Share pool</span>
            <span class="val">{{ pool.members?.length || 0 }}/4</span>
          </div>
        </div>

        <div class="card-footer">
          <template v-if="pool.status === 'ACTIVE'">
            <p>Contribution open until <strong>{{ formatDeadline(pool.deadline) }}</strong></p>
          </template>
          <template v-else-if="pool.status === 'CLOSED' || pool.status === 'COMPLETED'">
            <p>Pool closed</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./CraftPoolsByGift.scss" scoped></style>
