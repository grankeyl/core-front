<script setup lang="ts">
import { ref } from "vue";

const skeleton = ref<boolean>(false);
</script>

<template>
  <div class="recent" :class="{ skeleton }">
    <div class="items">
      <div v-for="_ in 7" class="item">
        <div class="info">
          <div class="image">
            <img :src="'https://nft.fragment.com/gift/plushpepe-289.medium.jpg'" alt="">
          </div>
          <div class="context">
            <h4>PlushPepe</h4>
            <p>#1515</p>
          </div>
          <div class="collected">
            <div class="top">
              <p>$76,712</p>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0pSD0RicD5gdCYUw3x7LBDOqRs-9AwezuQ&s" alt="">
            </div>
            <div class="count">
              <h4>02:31, 21.12.2025</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Recent.scss"></style>