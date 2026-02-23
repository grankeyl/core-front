<script setup lang="ts">
import { computed, ref } from "vue";
import type { Gift } from "../../../../../../types/gifts";
import { giftsApi } from "../../../../../../api/gifts";
import { showSuccessToast, showErrorToast } from "../../../../../../utils/toastManager";
import TelegramRawIcon from "@/assets/icons/telegram.svg?raw";
import ArrowDownRawIcon from "@/assets/icons/arrow-down.svg?raw";
import FireRawIcon from "@/assets/icons/fire.svg?raw";
import TonRawIcon from "@/assets/icons/ton.svg?raw";

const emit = defineEmits<{
  (e: "close"): void,
  (e: "reset"): void,
  (e: "apply", data: any[]): void,
  (e: "open-select-gifts"): void,
}>();

const props = defineProps<{
  gift: Gift;
}>();

const isWithdrawing = ref(false);

const info = computed(() => [
  { label: "Total issued", value: props.gift.availabilityIssued.toLocaleString() },
  { label: "Total supply", value: props.gift.availabilityTotal.toLocaleString() },
  { label: "In auction", value: props.gift.inAuction ? "Yes" : "No" },
  { label: "In fund", value: props.gift.inFund ? "Yes" : "No" },
]);

async function handleWithdraw() {
  if (isWithdrawing.value) return;

  try {
    isWithdrawing.value = true;
    const response = await giftsApi.withdraw(props.gift.id);

    if (response) {
      showSuccessToast('Gift transferred successfully');
      close();
    } else {
      showErrorToast('Failed to transfer gift');
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    showErrorToast('Failed to transfer gift');
  } finally {
    isWithdrawing.value = false;
  }
}

function openSelectGifts() {
  emit("open-select-gifts");
  close();
}

function close() {
  emit("close");
}
</script>

<template>
  <div class="sheet">
      <div class="item">
        <div class="image">
          <img :src="gift.image" :alt="gift.title">
        </div>
        <div class="context">
          <div class="flexed">
            <h4>{{ gift.title }}</h4>
          </div>
          <span>#{{ gift.num }}</span>
        </div>
        <div class="value">
          <h4>{{ (gift.cost ?? 0).toLocaleString() }}</h4>
          <div class="kit-icon" v-html="TonRawIcon"></div>
        </div>
      </div>

    <div class="controls">
      <div class="control">
        <div class="image">
          <div class="kit-icon" v-html="TelegramRawIcon"></div>
        </div>
        <div class="text">
          <h4>View</h4>
        </div>
      </div>
      <div class="control" @click="handleWithdraw" :class="{ disabled: isWithdrawing }">
        <div class="image">
          <div class="kit-icon" v-html="ArrowDownRawIcon"></div>
        </div>
        <div class="text">
          <h4>{{ isWithdrawing ? 'Transferring...' : 'Transfer' }}</h4>
        </div>
      </div>
      <div class="control burn" @click="openSelectGifts">
        <div class="image">
          <div class="kit-icon" v-html="FireRawIcon"></div>
        </div>
        <div class="text">
          <h4>Burn</h4>
        </div>
      </div>
    </div>

    <div class="info">
      <div
        v-for="(item, i) in info"
        :key="i"
        class="row"
      >
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>

    <div class="footer">
      <div class="close" @click="close">
        <h4>Close</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Item.scss" scoped></style>