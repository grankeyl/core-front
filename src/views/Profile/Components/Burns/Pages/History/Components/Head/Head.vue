<script setup lang="ts">
import { ref } from "vue";

const skeleton = ref<boolean>(true);
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div class="top">
      <div class="title">
        <h4>History burns</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>