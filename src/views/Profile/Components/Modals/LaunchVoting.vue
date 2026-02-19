<script setup lang="ts">
// Images
import InfoImage from "@/assets/images/profile-pg/info.png";

// Icons
import CloseIcon from "@/assets/icons/close.svg?raw";
import InfoRawIcon from "@/assets/icons/info.svg?raw";

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit('close');
}
</script>

<template>
  <div class="sheet error">
    <div class="head">
      <div class="info">
        <div class="kit-icon" v-html="InfoRawIcon"></div>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="InfoImage" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Launching voting</h4>
      </div>
      <div class="descr">
        <p>Are you sure you want to start voting on the sale?</p>
      </div>
    </div>
    <div class="buttons">
      <button @click="close">
        <h4>Cancel</h4>
      </button>
      <button @click="close" class="primary">
        <h4>Yes</h4>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./LaunchVoting.scss" scoped></style>