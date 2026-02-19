<script setup lang="ts">
// Icons
import CloseIcon from "@/assets/icons/close.svg?raw";
import DoneIconRaw from "@/assets/icons/done.svg?raw";

const emit = defineEmits<{
  (e: "close"): void,
}>();

function close() {
  emit("close");
}
</script>

<template>
  <div class="sheet">
    <div class="head">
      <div class="title">
        <h4>The DAO Voting Rule</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>

    <div class="content">
      <div class="rule-item">
        <div class="number">01</div>
        <div class="text-container">
          <p class="rule-text">Any shareholder can initiate a DAO vote.</p>
        </div>
      </div>
      
      <div class="rule-item">
        <div class="number">02</div>
        <div class="text-container">
          <p class="rule-text">Once the vote is launched, all holders can vote either to approve or to cancel the sale.</p>
        </div>
      </div>
      
      <div class="rule-item">
        <div class="number">03</div>
        <div class="text-container">
          <p class="rule-text">If at least 70% of the total votes are in favor, the gift will be listed on the marketplace at the best available price.</p>
        </div>
      </div>
      
      <div class="rule-item success">
        <div class="check">
          <div class="kit-icon" v-html="DoneIconRaw"></div>
        </div>
        <div class="text-container">
          <p class="rule-text">After the sale, the platform will automatically distribute the proceeds among participants according to their shares and credit the amounts to their balances.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="reset" @click="close">
        <h4>Good</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./DaoRule.scss" scoped></style>