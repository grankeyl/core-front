<script setup lang="ts">
import { ref } from "vue";

// Components
import Wallet from "@/components/common/Wallet/Wallet.vue";

// Images
import HeadInfoBg from "@/assets/images/home-pg/head-info-bg.png";

// Icons
import ChevroneRight from "@/assets/icons/chevrone-right.svg";

const skeleton = ref<boolean>(true);
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div class="top">
      <div class="title">
        <h4>Split</h4>
      </div>
      <Wallet />
    </div>
    <div class="info">
      <div class="bg">
        <img :src="HeadInfoBg" alt="head-info-bg">
      </div>
      <div class="content">
        <h4>How do splits work?</h4>
        <img :src="ChevroneRight" alt="chevrone-right">
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>