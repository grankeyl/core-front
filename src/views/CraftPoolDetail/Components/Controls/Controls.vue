<script setup lang="ts">
import type { CraftPool } from "../../../../types/craft";
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw";

defineProps<{
  pool: CraftPool;
  isActive: boolean;
  isFull: boolean;
  isCompleted: boolean;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "bringGifts"): void;
  (e: "createVote"): void;
  (e: "leaveAsset"): void;
}>();
</script>

<template>
  <div class="inner" :class="{ 'completed-mode': isCompleted }">
    <!-- Completed pool: 3 buttons stacked -->
    <template v-if="isCompleted">
      <button class="full-btn primary" @click="emit('createVote')">
        <h4>Create a vote</h4>
      </button>
      <button class="full-btn outline" @click="emit('leaveAsset')">
        <h4>Leave the asset (sell a share)</h4>
      </button>
      <button class="full-btn back-btn" @click="emit('back')">
        <span class="chevron" v-html="'&lsaquo;'"></span>
        <h4>Back</h4>
      </button>
    </template>

    <!-- Active pool: back + action -->
    <template v-else>
      <div class="back" @click="emit('back')">
        <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
      </div>
      <div class="action">
        <button v-if="isActive && !isFull" @click="emit('bringGifts')">
          <div class="context">
            <h4>Bring a gift</h4>
          </div>
        </button>
        <button v-else-if="isFull && isActive" class="disabled" disabled>
          <div class="context">
            <h4>Pool is full</h4>
          </div>
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" src="./Controls.scss" scoped></style>
