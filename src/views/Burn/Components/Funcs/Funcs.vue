<script setup lang="ts">
import { ref } from "vue";

// Components
import Progress from "./Progress.vue";

// Icons
import GiftIcon from "@/assets/icons/gift.svg?raw";
import TonIcon from "@/assets/icons/ton.svg?raw";
import PointIcon from "@/assets/icons/point.svg?raw";
import FireIcon from "@/assets/icons/fire.svg?raw";

const skeleton = ref<boolean>(true);
const shares = ref(100);
</script>

<template>
  <div class="funcs" :class="{ skeleton: skeleton }">
    <div class="progress">
      <Progress v-model="shares" :min="1" :max="100" />
    </div>
    <div class="info">
      <div class="left">
        <div class="item">
          <h4>65</h4>
          <div class="kit-icon" v-html="GiftIcon"></div>
        </div>
        <div class="item">
          <h4>795</h4>
          <div class="kit-icon" v-html="TonIcon"></div>
        </div>
        <div class="item point">
          <h4>+79500</h4>
          <div class="kit-icon" v-html="PointIcon"></div>
        </div>
      </div>
      <div class="right">
        <div class="kit-icon" v-html="FireIcon"></div>
        <h4>Burn</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Funcs.scss" scoped></style>
<style scoped>
</style>