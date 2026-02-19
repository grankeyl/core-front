<script setup lang="ts">
import { onMounted, ref } from "vue";
import { showMenu } from "../../../../utils/useApp";

// Icons
import TonIcon from "@/assets/icons/ton.svg?raw";

const pageType = ref('');

const emit = defineEmits<{
  (e: "setSection", id: string): void;
  (e: "setPage", name: string): void;
}>();

const props = defineProps<{
  sectionActive: string;
  sections: any[];
  page: string;
}>();

onMounted(() => {
  showMenu();
});
</script>

<template>
  <div v-if="!pageType" class="pg">
    <div class="items">
      <div class="item">
        <div class="context">
          <h4>Deposit</h4>
          <p>01.01.26 12:00</p>
        </div>
        <div class="value up">
          <h4>+5000</h4>
          <div class="kit-icon" v-html="TonIcon"></div>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <h4>Burn Contribution</h4>
          <p>01.01.26 12:00</p>
        </div>
        <div class="value down">
          <h4>-5000</h4>
          <div class="kit-icon" v-html="TonIcon"></div>
        </div>
      </div>
      <div class="item league">
        <div class="context">
          <h4>League Reward</h4>
          <p>01.01.26 12:00</p>
        </div>
        <div class="value up">
          <h4>+255.62</h4>
          <div class="kit-icon" v-html="TonIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Transactions.scss" scoped></style>