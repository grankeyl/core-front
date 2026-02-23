<script setup lang="ts">
import { ref, computed } from "vue";
import { fundsApi } from "../../../../api/funds";
import type { FundDetail } from "../../../../types/funds";

// Components
import SharesSlider from "./SharesSlider.vue";

// Images
import TickSuccess from "@/assets/images/shared-pg/tick-success.png";
import TickError from "@/assets/images/shared-pg/tick-error.png";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import InfoIcon from "@/assets/icons/info.svg?raw";
import CloseIcon from "@/assets/icons/close.svg?raw";
import ChevroneRightDef from "@/assets/icons/chevrone-right-def.svg?raw";

const props = defineProps<{
  fund: FundDetail;
}>();

const shares = ref(1);
const status = ref('none');
const errorMessage = ref('');
const purchaseSuccess = ref(false);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "resolve", value: boolean): void;
}>();

function close() {
  emit('resolve', purchaseSuccess.value);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

const availableShares = computed(() => {
  return props.fund.fractionNum - props.fund.purchasedFractionNum;
});

const maxShares = computed(() => {
  return Math.min(availableShares.value, 10); // Максимум 10 долей за раз
});

const totalPrice = computed(() => {
  return shares.value * props.fund.fractionPrice;
});

const collectedAmount = computed(() => {
  return props.fund.purchasedFractionNum * props.fund.fractionPrice;
});

async function buyShares() {
  try {
    status.value = 'progress';
    await fundsApi.buyFractions(props.fund.id, shares.value);

    // Небольшая задержка для плавности (минимум 800мс показываем прогресс)
    await new Promise(resolve => setTimeout(resolve, 800));

    status.value = 'success';
    purchaseSuccess.value = true;
  } catch (error: any) {
    console.error('Failed to buy shares:', error);
    errorMessage.value = error.response?.data?.message || 'Your purchase could not be completed. Please try again.';
    status.value = 'error';
    purchaseSuccess.value = false;
  }
}

function retryPayment() {
  status.value = 'none';
  errorMessage.value = '';
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="status === 'progress'" key="progress" class="sheet progress">
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

    <div v-else-if="status === 'success'" key="success" class="sheet success">
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
        <h4>Transaction Successful</h4>
      </div>
      <div class="descr">
        <p>{{ shares }} share{{ shares !== 1 ? 's' : '' }} {{ shares !== 1 ? 'have' : 'has' }} been successfully purchased. You can find the details in your account</p>
      </div>
    </div>
    <div class="location" @click="close">
      <p>View my shares</p>
      <div class="kit-icon" v-html="ChevroneRightDef"></div>
    </div>
  </div>

    <div v-else-if="status === 'error'" key="error" class="sheet error">
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
        <p>{{ errorMessage || 'Your purchase could not be completed. Please make sure you have enough balance or try again' }}</p>
      </div>
    </div>
    <div class="button">
      <button @click="retryPayment">
        <h4>Retry payment</h4>
      </button>
    </div>
  </div>

    <div v-else-if="status === 'none'" key="none" class="sheet">
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
        <img :src="fund.gift.image" :alt="fund.gift.title">
      </div>
      <div class="context">
        <h4>{{ fund.gift.title }}</h4>
        <p>#{{ formatNumber(fund.gift.num) }}</p>
      </div>
      <div class="collected">
        <div class="top">
          <p>Collected</p>
        </div>
        <div class="count">
          <h4>{{ formatNumber(collectedAmount) }}</h4>
          <img :src="TonIcon" alt="ton-icon" />
        </div>
      </div>
    </div>

    <div class="shares-range">
      <SharesSlider v-model="shares" :min="1" :max="maxShares" />
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>share price</p>
          <div class="flexed">
            <h4>{{ formatNumber(fund.fractionPrice) }}</h4>
            <img :src="TonIcon" alt="ton-icon" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Share pool</p>
          <h4>{{ formatNumber(fund.purchasedFractionNum) }}/{{ formatNumber(fund.fractionNum) }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Shares Available</p>
          <h4>{{ formatNumber(availableShares) }}</h4>
        </div>
        <div class="mark">
          <div class="kit-icon" v-html="InfoIcon"></div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="amount">
        <img :src="TonIcon" alt="ton-icon" />
        <h4>{{ formatNumber(totalPrice) }}</h4>
      </div>
      <div class="button">
        <button @click="buyShares" :disabled="availableShares <= 0">
          <h4>{{ availableShares > 0 ? 'Buy' : 'Sold out' }}</h4>
        </button>
      </div>
    </div>
  </div>
  </transition>
</template>

<style lang="scss" src="./BuyShares.scss" scoped>
</style>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>