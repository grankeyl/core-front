<script setup lang="ts">
import { ref } from "vue";

// Components
import SharesSlider from "./SharesSlider.vue";

// Images
import TickSuccess from "@/assets/images/shared-pg/tick-success.png";
import TickError from "@/assets/images/shared-pg/tick-error.png";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import CloseIcon from "@/assets/icons/close.svg?raw";
import FireRawIcon from "@/assets/icons/fire.svg?raw";
import PointRawIcon from "@/assets/icons/point.svg?raw";

const shares = ref(1);
const status = ref('error');

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit('close');
}
</script>

<template>
  <div v-if="status === 'progress'" class="sheet progress">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="loader"></div>
    <div class="context">
      <div class="title">
        <h4>Payment in progress</h4>
      </div>
      <div class="descr">
        <p>Please wait while we process your payment</p>
      </div>
    </div>
  </div>

  <div v-if="status === 'success'" class="sheet success">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="TickSuccess" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Burn successful</h4>
      </div>
      <div class="info">
        <h4>+15600</h4>
        <div class="kit-icon" v-html="PointRawIcon"></div>
      </div>
    </div>
    <div class="button">
      <button>
        <h4>Good</h4>
      </button>
    </div>
  </div>

  <div v-if="status === 'error'" class="sheet error">
    <div class="head">
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    <div class="image">
      <img :src="TickError" alt="tick-success">
    </div>
    <div class="context">
      <div class="title">
        <h4>Payment failed</h4>
      </div>
      <div class="descr">
        <p>Your purchase could not be completed. Please make sure you have enough balance or try again</p>
      </div>
    </div>
    <div class="button">
      <button>
        <h4>Retry payment</h4>
      </button>
    </div>
  </div>

  <div v-if="status === 'none'" class="sheet">
    <div class="head">
      <div class="title">
        <h4>Buy shares</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>
    
    <div class="info">
      <div class="image">
        <img :src="'https://nft.fragment.com/gift/plushpepe-289.medium.jpg'" alt="">
      </div>
      <div class="context">
        <h4>PlushPepe</h4>
        <p>x1</p>
      </div>
    </div>

    <div class="shares-range">
      <SharesSlider v-model="shares" :min="1" :max="6" />
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>min price burn</p>
          <div class="flexed">
            <h4>1</h4>
            <img :src="TonIcon" alt="ton-icon" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Burning reward</p>
          <div class="flexed">
            <h4>15600</h4>
            <div class="kit-icon point" v-html="PointRawIcon"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="amount">
        <img :src="TonIcon" alt="ton-icon" />
        <h4>960</h4>
      </div>
      <div class="button">
        <!-- <button class="sold">
          <h4>Purchase limit reached</h4>
        </button>
        <button class="limit">
          <h4>Sold out</h4>
        </button> -->
        <button>
          <div class="kit-icon" v-html="FireRawIcon"></div>
          <h4>Burn</h4>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./BuyShares.scss" scoped></style>