<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { hideMenu } from "../../../../../../utils/useApp";

// Components
import Sections from "./Sections/Sections.vue";
import Button from "./Button/Button.vue";

// Icons
import InfoRawIcon from "@/assets/icons/info.svg?raw";
import ClockRawIcon from "@/assets/icons/clock.svg?raw";
import Voters from "./Voters/Voters.vue";

const Page = ref('');

const VoteStatus = ref('over');
const VoteNo = ref(22);
const VoteYes = ref(78);
const VoteTotals = 40;
const VoteRedCount = computed(() => {
  return Math.round(VoteTotals * VoteNo.value / 100);
});

function setPage(page: string) {
  Page.value = page;
}

onMounted(() => {
  hideMenu();
});
</script>

<template>
  <div v-if="Page === 'voters'" class="card">
    <Voters 
      :VoteStatus="VoteStatus"
      :VoteNo="VoteNo"
      :VoteYes="VoteYes"
      :VoteTotals="VoteTotals"
      :VoteRedCount="VoteRedCount"
    />
  </div>

  <div v-if="!Page" class="card">
    <div class="head">
      <div class="image">
        <img src="https://nft.fragment.com/gift/plushpepe-289.medium.jpg" alt="">
      </div>

      <div class="context">
        <h4>PlushPepe</h4>
        <p>#1515</p>
      </div>

      <div v-if="VoteStatus === 'voting'" class="status voting">
        <p>Voting</p>
      </div>

      <div v-if="VoteStatus === 'over'" class="status sell">
        <p>Sell</p>
      </div>
    </div>

    <div class="voting" :class="{ over: VoteStatus === 'over' }">
      <div class="info">
        <div class="mark">
          <div class="kit-icon" v-html="InfoRawIcon"></div>
        </div>
        <div v-if="VoteStatus === 'voting'" class="context">
          <h4>DAO Vote for Sale</h4>
          <p>A new vote has started to sell the gift. Join the decision and vote now!</p>
        </div>
        <div v-if="VoteStatus === 'over'" class="context">
          <h4>Gift is for sale</h4>
          <p>In the DAO vote, the majority of participants (70%) voted for the sale of the gift.</p>
        </div>
        <div class="progress">
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
        <div v-if="VoteStatus === 'voting'" class="buttons">
          <button class="no"><h4>No</h4></button>
          <button class="yes"><h4>Yes</h4></button>
        </div>
      </div>


      <div class="footer">
        <div class="time">
          <div class="kit-icon" v-html="ClockRawIcon"></div>
          <h4 v-if="VoteStatus === 'voting'">Jan 1, 2025, 10:00 UTC</h4>
          <h4 v-if="VoteStatus === 'over'">Voting is over</h4>
        </div>

        <div class="users" @click="setPage('voters')">
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"><h4>+24</h4></div>
        </div>
      </div>
    </div>
      
    <Sections
      :typeShared="'gift'"
    />

    <Button />
  </div>
</template>

<style lang="scss" src="./Gift.scss" scoped></style>