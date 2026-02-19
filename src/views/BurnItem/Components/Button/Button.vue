<script setup lang="ts">
import { ref } from "vue";

const skeleton = ref<boolean>(false);

const emit = defineEmits<{
  (e: "buy-shares"): void;
}>();

function buyShares() {
  if (skeleton.value) return;
  emit('buy-shares');
}
</script>

<template>
  <div class="button" :class="{ skeleton }" @click="buyShares">
    <button>
      <h4>Buy Shares</h4>
    </button>
  </div>
</template>

<style lang="scss" src="./Button.scss" scoped></style>