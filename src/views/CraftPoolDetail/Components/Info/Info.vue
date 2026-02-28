<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { CraftPool } from "../../../../types/craft";

import InfoIcon from "@/assets/icons/info.svg?raw";

const props = defineProps<{
  pool: CraftPool;
  isCompleted: boolean;
  isActive: boolean;
  isFull: boolean;
  membersCount: number;
  maxMembers: number;
}>();

const currentTime = ref(Date.now());
let intervalId: number | null = null;

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId !== null) clearInterval(intervalId);
});

function getStatusLabel(status: string): string {
  if (status === "ACTIVE" && props.isFull) return "crafting";
  switch (status) {
    case "ACTIVE": return "opened";
    case "COMPLETED": return "completed";
    case "CLOSED": return "closed";
    default: return status;
  }
}

function getStatusClass(status: string): string {
  if (status === "ACTIVE" && props.isFull) return "crafting";
  switch (status) {
    case "ACTIVE": return "fundraising";
    case "COMPLETED": return "completed";
    case "CLOSED": return "close";
    default: return "";
  }
}

function calculateProgress(): number {
  if (props.maxMembers === 0) return 0;
  return Math.min((props.membersCount / props.maxMembers) * 100, 100);
}

function calculateTimeRemaining(): string {
  if (!props.pool.deadline) return "--:--:--";
  const diff = new Date(props.pool.deadline).getTime() - currentTime.value;
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function isTimeEnded(): boolean {
  if (!props.pool.deadline) return false;
  return currentTime.value >= new Date(props.pool.deadline).getTime();
}
</script>

<template>
  <div class="info">
    <div class="head">
      <div class="context">
        <h4>{{ pool.members[0]?.gift?.title || pool.giftInfo?.collectionName || 'Unknown Gift' }}</h4>
        <p>x1</p>
      </div>
      <div class="status" :class="getStatusClass(pool.status)">
        <p>{{ getStatusLabel(pool.status) }}</p>
      </div>
    </div>

    <div class="progress">
      <div class="progress-line">
        <div
          class="line"
          :class="{ done: isFull || isCompleted }"
          :style="{ '--w-progress': calculateProgress() + '%' }"
        ></div>
      </div>
      <div class="context">
        <h4>Remaining until burn</h4>
        <p>{{ membersCount }}/{{ maxMembers }}</p>
      </div>
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>craft ends in</p>
          <h4 :class="{ 'time-ended': isTimeEnded() }">{{ calculateTimeRemaining() }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>available</p>
          <h4>{{ maxMembers - membersCount }}</h4>
        </div>
        <div class="mark">
          <div class="kit-icon" v-html="InfoIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Info.scss" scoped></style>
<style scoped>
.time-ended {
  color: #FF1B54 !important;
}
</style>
