<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import { useModal } from "../../components/common/Modal";
import type { CraftPool } from "../../types/craft";
import { mockPools } from "../../mocks/craft";
import TypeModal from "../Home/Components/Modals/Type.vue";

import TonIcon from "@/assets/icons/ton.svg";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

const { open } = useModal();
const router = useRouter();
const pools = ref<CraftPool[]>([]);
const loading = ref(true);

const typeItems = ref<any[]>([
  { id: "GIFT",     title: "Gifts",             active: false },
  { id: "PHONE",    title: "Anonymous numbers", active: false },
  { id: "NICKNAME", title: "Username",          active: false },
]);

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

const filteredPools = computed(() => pools.value);

function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE": return "waiting users";
    case "IN_CRAFTING": return "in crafting";
    case "COMPLETED": return "completed";
    case "CLOSED": return "closed";
    default: return status;
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case "ACTIVE": return "waiting";
    case "IN_CRAFTING": return "crafting";
    case "COMPLETED": return "completed";
    case "CLOSED": return "closed";
    default: return "";
  }
}

function isCrafting(pool: CraftPool): boolean {
  return pool.status === "IN_CRAFTING" as any || (pool.status === "CLOSED" && (pool.members?.length || 0) >= 4);
}

function isCompleted(pool: CraftPool): boolean {
  return pool.status === "COMPLETED";
}

function getProgress(pool: CraftPool): number {
  if (isCompleted(pool) || isCrafting(pool)) return 100;
  return ((pool.members?.length || 0) / 4) * 100;
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

function getTimeLeft(deadline: string): string {
  if (!deadline) return "";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h} hours left`;
  const m = Math.floor(diff / 60000);
  return `${m} minutes left`;
}

function openPool(id: string) {
  router.push(`/craft-pools/pool/${id}`);
}

async function fetchPools() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 400));
  pools.value = mockPools;
  loading.value = false;
}

onMounted(() => {
  showMenu();
  fetchPools();
});
</script>

<template>
  <div class="section my-pools">
    <div class="head">
      <h2>My Pools</h2>
    </div>

    <div class="filter-type" @click="handleOpenType">
      <div class="context">
        <p>TYPE</p>
        <h4>{{ getTypeLabel() }}</h4>
      </div>
      <div class="icon">
        <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
      </div>
    </div>

    <div v-if="loading" class="pool-list">
      <div v-for="i in 3" :key="i" class="pool-card sk-card">
        <div class="inner">
          <div class="card-head">
            <div class="image sk-load"></div>
            <div class="context">
              <div class="sk-load" style="height:14px; width:60%; border-radius:6px"></div>
              <div class="sk-load" style="height:12px; width:35%; border-radius:6px; margin-top:6px"></div>
            </div>
            <div class="sk-load" style="height:24px; width:70px; border-radius:12px; flex-shrink:0"></div>
          </div>
          <div class="stats">
            <div v-for="j in 3" :key="j" class="stat">
              <div class="sk-load" style="height:10px; width:70%; border-radius:5px"></div>
              <div class="sk-load" style="height:16px; width:50%; border-radius:5px; margin-top:5px"></div>
            </div>
          </div>
          <div class="progress">
            <div class="sk-load" style="height:8px; width:100%; border-radius:8px"></div>
            <div style="display:flex; justify-content:space-between; margin-top:6px">
              <div class="sk-load" style="height:10px; width:40%; border-radius:5px"></div>
              <div class="sk-load" style="height:10px; width:20%; border-radius:5px"></div>
            </div>
          </div>
        </div>
        <div class="footer sk-load" style="height:35px; border-radius:0 0 20px 20px"></div>
      </div>
    </div>

    <div v-else-if="filteredPools.length === 0" class="empty">
      <p>No pools yet</p>
    </div>

    <div v-else class="pool-list">
      <div
        v-for="pool in filteredPools"
        :key="pool.id"
        class="pool-card"
        @click="openPool(pool.id)"
      >
        <div class="inner">
          <!-- Card head: image, name, status -->
          <div class="card-head">
            <div class="image">
              <img :src="pool.giftInfo?.image" :alt="pool.members[0]?.gift?.title || pool.giftInfo?.collectionName" />
            </div>
            <div class="context">
              <h4>{{ pool.members[0]?.gift?.title || pool.giftInfo?.collectionName }}</h4>
              <p v-if="pool.members[0]?.gift?.num">#{{ pool.members[0].gift.num }}</p>
            </div>
            <div class="status" :class="getStatusClass(pool.status)">
              <span>{{ getStatusLabel(pool.status) }}</span>
            </div>
          </div>

          <!-- Stats row: varies by status -->
          <div class="stats">
            <div class="stat">
              <p class="label">attached</p>
              <div class="val-row">
                <h4 class="value">0.50</h4>
                <img :src="TonIcon" alt="ton" class="ton" />
              </div>
            </div>
            <div class="stat">
              <p class="label">YOUR SHARE</p>
              <h4 class="value" :class="{ accent: isCompleted(pool) || isCrafting(pool) }">22%</h4>
            </div>
            <div v-if="isCrafting(pool)" class="stat">
              <p class="label">PROGRESS</p>
              <h4 class="value">70%</h4>
            </div>
            <div v-if="isCompleted(pool)" class="stat">
              <p class="label">PROFIT</p>
              <h4 class="value profit">+12%</h4>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="progress">
            <div class="progress-line">
              <div
                class="line"
                :class="{
                  done: isCompleted(pool),
                  crafting: isCrafting(pool),
                }"
                :style="{ '--w-progress': getProgress(pool) + '%' }"
              ></div>
            </div>
            <div class="progress-context">
              <span class="label">Share pool</span>
              <span class="value">{{ pool.members?.length || 0 }}/4</span>
            </div>
          </div>
        </div>

        <!-- Footer: varies by status -->
        <div class="footer">
          <template v-if="pool.status === 'ACTIVE'">
            <p>Contribution open until <strong>{{ formatDeadline(pool.deadline) }}</strong></p>
          </template>
          <template v-else-if="isCrafting(pool)">
            <p>{{ getTimeLeft(pool.deadline) }}</p>
          </template>
          <template v-else-if="isCompleted(pool)">
            <p class="control-text">Control</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./MyPools.scss" scoped></style>
