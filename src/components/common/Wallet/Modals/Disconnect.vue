<script setup lang="ts">
// Images
import InfoImage from "@/assets/images/profile-pg/info.png";

// Icons
import CloseIcon from "@/assets/icons/close.svg?raw";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "disconnect"): void;
}>();

function close() {
  emit('close');
}

function disconnect() {
  emit('disconnect');
  emit('close');
}
</script>

<template>
  <div class="sheet error">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="InfoImage" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Disconnect wallet?</h4>
      </div>
      <div class="descr">
        <p>Are you sure you want to disconnect your wallet?</p>
      </div>
    </div>
    <div class="buttons">
      <button @click="close">
        <h4>Cancel</h4>
      </button>
      <button @click="disconnect" class="primary">
        <h4>Yes</h4>
      </button>
    </div>
  </div>
</template>

<style lang="scss" src="./Disconnect.scss" scoped></style>