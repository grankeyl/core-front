<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import { useModal } from "../../components/common/Modal";
import type { CraftPool } from "../../types/craft";
import { mockPools } from "../../mocks/craft";
import TypeModal from "../Home/Components/Modals/Type.vue";

import TonIcon from "@/assets/icons/ton.svg";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

const PLACEHOLDER = "https://nft.fragment.com/gift/InstantRamen-133166.webp";

const { open } = useModal();
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const pools = ref<CraftPool[]>([]);

const typeItems = ref<any[]>([
  { id: "GIFT",     title: "Telegram gifts",             active: false },
  { id: "PHONE",    title: "Telegram anonymous numbers", active: false },
  { id: "NICKNAME", title: "Telegram username",          active: false },
]);

const categoryTitle = computed(() => {
  if (pools.value.length > 0) return pools.value[0].giftInfo?.title || slug.value;
  return (history.state?.title as string) || slug.value;
});

function getTypeLabel(): string {
  const active = typeItems.value.filter((i) => i.active);
  if (active.length === 0 || active.length === typeItems.value.length) return "All";
  if (active.length === 1) return active[0].title;
  return `${active.length} selected`;
}

async function handleOpenType() {
  const choose = open(TypeModal, {
    Items: typeItems.value,
    onReset: () => {
      typeItems.value = typeItems.value.map((i) => ({ ...i, active: false }));
    },
    onApply: (data: any[]) => {
      typeItems.value = data;
    },
  });
  await choose.done.catch(() => null);
}

const slug = computed(() => route.params.slug as string);

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
        <h4>{{ categoryTitle }}</h4>
      </div>
      <button class="create-btn" @click="handleCreatePool">
        <div class="plus-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2.91663V11.0833" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.91669 7H11.0834" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>Create Pool</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-item" @click="handleOpenType">
        <p>TYPE</p>
        <div class="val">
          <h4>{{ getTypeLabel() }}</h4>
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

    <!-- Skeleton -->
    <div v-if="loading" class="pool-list">
      <div v-for="i in 3" :key="i" class="pool-card sk-card">
        <div class="card-head">
          <div class="gift-img sk-load"></div>
          <div class="gift-ctx">
            <div class="sk-load" style="height:14px; width:65%; border-radius:6px"></div>
            <div class="sk-load" style="height:12px; width:35%; border-radius:6px; margin-top:6px"></div>
          </div>
          <div class="sk-load" style="height:24px; width:60px; border-radius:12px; flex-shrink:0"></div>
        </div>
        <div class="card-stats">
          <div class="stat">
            <div class="sk-load" style="height:10px; width:80%; border-radius:5px"></div>
            <div class="sk-load" style="height:16px; width:60%; border-radius:5px; margin-top:5px"></div>
          </div>
          <div class="divider"></div>
          <div class="stat">
            <div class="sk-load" style="height:10px; width:80%; border-radius:5px"></div>
            <div class="sk-load" style="height:16px; width:40%; border-radius:5px; margin-top:5px"></div>
          </div>
        </div>
        <div class="card-progress">
          <div class="sk-load" style="height:8px; width:100%; border-radius:8px"></div>
          <div style="display:flex; justify-content:space-between; margin-top:6px">
            <div class="sk-load" style="height:10px; width:40%; border-radius:5px"></div>
            <div class="sk-load" style="height:10px; width:25%; border-radius:5px"></div>
          </div>
        </div>
        <div class="card-footer sk-load" style="height:35px; border-radius:0 0 16px 16px"></div>
      </div>
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
