<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Auction } from "../../../../types/auctions";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";
import FireRawIcon from "@/assets/icons/fire.svg?raw";

const router = useRouter();
const currentTime = ref(Date.now());

const emit = defineEmits<{
  (e: "open-type"): void;
  (e: "open-status"): void;
  (e: "open-sort-by"): void;
}>();

const props = defineProps<{
  auctions: Auction[];
  loading: boolean;
}>();

function openItem(id: string) {
  router.push(`/burn/item/${id}`);
}

function getStatusClass(status: string): string {
  return status === 'ACTIVE' ? 'burn' : 'close';
}

function calculateProgress(auction: Auction): number {
  const purchased = auction.purchasedSum ?? 0;
  const target = auction.targetSum ?? 0;
  if (target === 0) return purchased > 0 ? 100 : 0;
  return Math.min((purchased / target) * 100, 100);
}

function calculateTimeRemaining(deadline: string): string {
  const deadlineTime = new Date(deadline).getTime();
  const diff = deadlineTime - currentTime.value;
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function isTimeEnded(deadline: string): boolean {
  return new Date(deadline).getTime() - currentTime.value <= 0;
}

const firstGift = (auction: Auction) => auction.gifts?.[0];

let timerInterval: number | null = null;

onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000) as unknown as number;
});

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
</script>

<template>
  <div class="items" :class="{ skeleton: loading }">
    <div class="filters">
      <div class="item" @click="emit('open-type')">
        <div class="context">
          <p>TYPE</p>
          <h4>All</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
      <div class="item" @click="emit('open-status')">
        <div class="context">
          <p>status</p>
          <h4>Fundraising</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
      <div class="item" @click="emit('open-sort-by')">
        <div class="context">
          <p>sort by</p>
          <h4>Price: Low</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="" />
        </div>
      </div>
    </div>

    <div class="lists">
      <div v-if="loading && auctions.length === 0" class="loading-message">
        <p>Loading auctions...</p>
      </div>
      <div v-else-if="!loading && auctions.length === 0" class="empty-message">
        <p>No auctions available</p>
      </div>
      <template v-else>
        <div
          v-for="auction in auctions"
          :key="auction.id"
          class="item"
          @click="openItem(auction.id)"
        >
          <div class="inner">
            <div class="head">
              <div class="image" v-if="firstGift(auction)">
                <img :src="firstGift(auction)!.image" :alt="firstGift(auction)!.title">
              </div>
              <div class="context">
                <h4 v-if="firstGift(auction)">{{ firstGift(auction)!.title }}</h4>
                <h4 v-else>Auction #{{ auction.id }}</h4>
                <span>×{{ auction.gifts?.length ?? 1 }}</span>
              </div>
              <div class="status" :class="getStatusClass(auction.status)">
                <div class="kit-icon" v-html="FireRawIcon"></div>
                <p>{{ auction.status === 'ACTIVE' ? 'Burn' : 'Closed' }}</p>
              </div>
            </div>
            <div class="progress">
              <div class="progress-line">
                <div class="line" :style="{ '--w-progress': `${calculateProgress(auction)}%` }"></div>
              </div>
              <div class="context">
                <h4>Remaining until burn</h4>
                <p>{{ Math.round(calculateProgress(auction)) }}%</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <p v-if="auction.status === 'ACTIVE'">Time until burn cancellation</p>
            <p v-else>Burn {{ auction.status === 'COMPLETED' ? 'Completed' : 'Cancelled' }}</p>
            <p v-if="auction.status === 'ACTIVE'" class="timer" :class="{ ended: isTimeEnded(auction.deadline) }">
              {{ calculateTimeRemaining(auction.deadline) }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
