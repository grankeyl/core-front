<script setup lang="ts">
import { ref, computed } from "vue";
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

const isDisabled = computed(() => {
  return !props.fund.status === 'ACTIVE' || props.fund.purchasedFractionNum >= props.fund.fractionNum;
});

function handleClick() {
  if (skeleton.value) return;

  if (!props.fund.status === 'ACTIVE') {
    // Если фонд закрыт, возвращаемся назад
    router.push('/');
  } else if (props.fund.purchasedFractionNum >= props.fund.fractionNum) {
    // Если sold out, тоже возвращаемся назад
    router.push('/');
  } else {
    // Если активен и есть доступные доли, открываем модалку покупки
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