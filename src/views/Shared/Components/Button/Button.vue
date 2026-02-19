<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { FundDetail } from "../../../../types/funds";

const props = defineProps<{
  fund: FundDetail;
}>();

const router = useRouter();
const skeleton = ref<boolean>(false);

const emit = defineEmits<{
  (e: "buy-shares"): void;
}>();

function handleClick() {
  if (skeleton.value) return;

  if (props.fund.status !== 'ACTIVE') {
    router.push('/');
  } else if (props.fund.purchasedFractionNum >= props.fund.fractionNum) {
    router.push('/');
  } else {
    emit('buy-shares');
  }
}
</script>

<template>
  <div class="button" :class="{ skeleton }" @click="handleClick">
    <button>
      <h4 v-if="fund.status === 'ACTIVE' && fund.purchasedFractionNum < fund.fractionNum">Buy Shares</h4>
      <h4 v-else>Back</h4>
    </button>
  </div>
</template>

<style lang="scss" src="./Button.scss" scoped></style>