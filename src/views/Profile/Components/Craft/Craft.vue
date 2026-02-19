<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showMenu } from "../../../../utils/useApp";
import type { CraftPool } from "../../../../types/craft";
import { mockPools } from "../../../../mocks/craft";

import TonIcon from "@/assets/icons/ton.svg";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

const router = useRouter();
const pools = ref<CraftPool[]>([]);
const loading = ref(true);

const emit = defineEmits<{
  (e: "setSection", id: string): void;
  (e: "setPage", name: string): void;
}>();

const props = defineProps<{
  sectionActive: string;
  sections: any[];
  page: string;
}>();

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
  return (pool.status as string) === "IN_CRAFTING" || (pool.status === "CLOSED" && (pool.members?.length || 0) >= 4);
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
  <div class="pg">
    <div class="filter-type" @click="() => {}">
      <div class="context">
        <p>TYPE</p>
        <h4>All</h4>
      </div>
      <div class="icon">
        <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
      </div>
    </div>

    <div v-if="loading" class="loader-wrap">
      <div class="loader"></div>
    </div>

    <div v-else-if="pools.length === 0" class="empty">
      <p>No pools yet</p>
    </div>

    <div v-else class="pool-list">
      <div
        v-for="pool in pools"
        :key="pool.id"
        class="pool-card"
        @click="openPool(pool.id)"
      >
        <div class="inner">
          <div class="card-head">
            <div class="image">
              <img :src="pool.giftInfo?.image" :alt="pool.giftInfo?.title" />
            </div>
            <div class="context">
              <h4>{{ pool.giftInfo?.title }}</h4>
              <p>#{{ pool.giftInfo?.num }}</p>
            </div>
            <div class="status" :class="getStatusClass(pool.status)">
              <span>{{ getStatusLabel(pool.status) }}</span>
            </div>
          </div>

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

<style lang="scss" src="./Craft.scss" scoped></style>
