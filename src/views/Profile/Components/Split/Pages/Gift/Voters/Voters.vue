<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  VoteStatus: string;
  VoteNo: number;
  VoteYes: number;
  VoteTotals: number;
  VoteRedCount: number;
}>();

const skeleton = ref<boolean>(false);
</script>

<template>
  <div class="voters" :class="{ skeleton }">
    <div class="head">
      <div class="title">
        <h4>Voters</h4>
      </div>
    </div>

        <div class="progress">
          <div class="head">
            <p>32 votes</p>
            <p>816 votes</p>
          </div>
          <div class="bar unified">
            <span
              v-for="i in VoteTotals"
              :key="i"
              class="stick"
              :class="{ red: i <= VoteRedCount, green: i > VoteRedCount }"
            />
          </div>
          <div class="scale">
            <span>{{ VoteNo }}%</span>
            <span>{{ VoteYes }}%</span>
          </div>
        </div> 

    <div class="items">
      <div v-for="_ in 10" class="item">
        <div class="left">
          <div class="image"> 
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0pSD0RicD5gdCYUw3x7LBDOqRs-9AwezuQ&s" alt="">
          </div>
          <div class="name">
            <h4>NebulaShift</h4>
          </div>
        </div>
        <div class="info yes">
          <p>Yes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Voters.scss"></style>