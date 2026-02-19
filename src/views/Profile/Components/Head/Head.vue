<script setup lang="ts">
import { ref } from "vue";
import { useCacheStore } from "../../../../stores/pinia-store";

// Components
import Wallet from "@/components/common/Wallet/Wallet.vue";

// Icons
import ChevroneBottomRawIcon from "@/assets/icons/chevrone-bottom.svg?raw"
import ArrowUp from "@/assets/icons/arrow-up.svg"
import SettingsIcon from "@/assets/icons/settings.svg";

const skeleton = ref<boolean>(false);

const useCache = useCacheStore() as any;
</script>

<template>
  <div class="head" :class="{ skeleton: skeleton }">
    <div class="top">
      <div class="user">
        <div class="image">
          <img :src="useCache.UserData.photoUrl" alt="">
        </div>
        <div class="name">
          <h4>{{ useCache.UserData.firstName }} {{ useCache.UserData.lastName }}</h4>
        </div>
      </div>
      <div class="flexed">
        <Wallet page="profile" />
        <div class="settings">
          <img :src="SettingsIcon" alt="icon">
        </div>
      </div>
    </div>
    <div class="values">
      <div class="balance">
        <div class="descr">
          <p>Total balance</p>
        </div>
        <div class="amount">
          <h4>${{ useCache.UserData.balance }}</h4>
          <div class="kit-icon" v-html="ChevroneBottomRawIcon"></div>
        </div>
        <div class="info">
          <img :src="ArrowUp" alt="arrow-up">
          <h4>+$1,250 (2.5%)</h4>
          <p>This month</p>
        </div>
      </div>
      <div class="select">
        <h4>Month</h4>
        <div class="kit-icon" v-html="ChevroneBottomRawIcon"></div>
      </div>
    </div>
    <div class="features">
      <div class="item">
        <p>Invested</p>
        <h4>$129,522,40</h4>
      </div>
      <div class="item">
        <p>Unrealized PnL</p>
        <h4>$129,40</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Head.scss" scoped></style>
<style scoped>
</style>