<script setup lang="ts">
import { ref } from "vue";

// Images
import HeadInfoBg from "@/assets/images/burn-pg/head-info-bg.png";
import Liga1Image from "@/assets/images/burn-pg/liga-1.png";

// Icons
import ChevroneRight from "@/assets/icons/chevrone-right.svg";
import Wallet from "../../../../components/common/Wallet/Wallet.vue";

const skeleton = ref<boolean>(true);
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div class="top">
      <div class="title">
        <h4>Burn</h4>
      </div>
      <div class="flexed">
        <Wallet page="burn" />
        <div class="liga">
          <img :src="Liga1Image" alt="liga-1">
        </div>
      </div>
    </div>
    <div class="info">
      <div class="bg">
        <img :src="HeadInfoBg" alt="head-info-bg">
      </div>
      <div class="content">
        <h4>How do burn work?</h4>
        <img :src="ChevroneRight" alt="chevrone-right">
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>