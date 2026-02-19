<script setup lang="ts">
import { ref } from "vue";

// Images
import RankBronzeImage from "@/assets/images/ranks/bronze.png";

// Icons
import TriangleIcon from "@/assets/icons/triangle.svg";

const status = ref('unlocked');
</script>

<template>
  <div class="level-up">
    <div class="context">
      <div class="image">
        <img :src="RankBronzeImage" alt="rank-bronze">
      </div>
      <div class="text">
        <h4 v-if="status === 'unlocked'">League Bronze unlocked</h4>
        <h4 v-if="status === 'updated'">Rank Updated</h4>
      </div>
      <div class="descr">
        <p v-if="status === 'unlocked'">You’ve earned enough points by burning gifts.</p>
        <p v-if="status === 'updated'">You’ve moved up in the league rankings.</p>
      </div>
      <div class="levels">
        <div class="first">
          <h4 v-if="status === 'unlocked'">—</h4>
          <h4 v-if="status === 'updated'">95</h4>
        </div>
        <div class="center">
          <img v-for="_ in 7" :src="TriangleIcon" alt="triangle">
        </div>
        <div class="last">
          <h4>95</h4>
        </div>
      </div>
    </div>
    <div class="button">
      <button>
        <h4>Great</h4>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./LevelUp.scss" scoped></style>