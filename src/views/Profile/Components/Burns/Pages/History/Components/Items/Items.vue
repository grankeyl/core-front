<script setup lang="ts">
import { ref } from "vue";

// Icons
import PointRawIcon from "@/assets/icons/point.svg?raw";
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

// Images
import DaoNo from "@/assets/images/profile-pg/dao-no.png";

const emit = defineEmits<{
  (e: "open-type"): void;
  (e: "open-status"): void;
  (e: "open-sort-by"): void;
}>();

const props = defineProps<{
}>();

const skeleton = ref<boolean>(false);
const items = ref<any[]>([]);

function openType() {
  emit('open-type');
}

function openSortBy() {
  emit('open-sort-by');
}
</script>

<template>
  <div class="items" :class="{ skeleton }">
    <div class="filters">
      <div class="item" @click="openType">
        <div class="context">
          <p>TYPE</p>
          <h4>All</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
      <div class="item" @click="openSortBy">
        <div class="context">
          <p>sort by</p>
          <h4>Price: Low</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
    </div>

    <div v-if="items && items.length > 0" class="items">
      <div class="item">
        <div class="image">
          <img src="https://nft.fragment.com/gift/lovepotion-25434.large.jpg" alt="">
        </div>
        <div class="context">
          <div class="flexed">
            <h4>PlushPepe</h4>
            <span>1x</span>
          </div>
          <p>01.01.26 12:00</p>
        </div>
        <div class="value up">
          <h4>+5000</h4>
          <div class="kit-icon" v-html="PointRawIcon"></div>
        </div>
      </div>
      <div class="item">
        <div class="image">
          <img src="https://nft.fragment.com/gift/lovepotion-25434.large.jpg" alt="">
        </div>
        <div class="context">
          <h4>PlushPepe</h4>
          <p>01.01.26 12:00</p>
        </div>
        <div class="value down">
          <h4>-5000</h4>
          <div class="kit-icon" v-html="PointRawIcon"></div>
        </div>
      </div>
    </div>

    <div class="no-dao">
      <img :src="DaoNo" alt="no-dao" />
      <h4>No active DAO votes</h4>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
<style scoped>
</style>