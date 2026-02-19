<script setup lang="ts">
// Icons
import ChevroneRight from "@/assets/icons/chevrone-right.svg";

defineProps<{
  myPoolsCount: number;
}>();

const emit = defineEmits<{
  (e: "create-pool"): void;
  (e: "open-my-pools"): void;
}>();
</script>

<template>
  <div class="head">
    <div class="top">
      <div class="title">
        <h4>Craft Pools</h4>
      </div>
      <button class="create-btn" @click="emit('create-pool')">
        <div class="plus-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="7" fill="white"/>
            <path d="M7 4v6M4 7h6" stroke="#6900EA" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <span>Create Pool</span>
      </button>
    </div>

    <div class="my-pools" @click="emit('open-my-pools')">
      <div class="bg-overlay"></div>
      <div class="content">
        <div class="left">
          <span class="label">My Pools</span>
          <div class="count-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="white"/>
            </svg>
            <span class="count-num">{{ myPoolsCount }}</span>
          </div>
        </div>
        <img :src="ChevroneRight" alt="arrow" class="arrow-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
