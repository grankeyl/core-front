<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { showMenu } from "../../../../utils/useApp";

import History from "./Pages/History/History.vue";

// Icons
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw"

// Images
import Burn1 from "@/assets/images/profile-pg/burn-1.png";
import Burn2 from "@/assets/images/profile-pg/burn-2.png";
import Burn3 from "@/assets/images/profile-pg/burn-3.png";


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

function openHistoryBurns(data: any) {
  console.log(data);
  pageType.value = 'burns/history';
  emit("setPage", 'burns/history');
}

watch(
  () => props.page,
  (page) => {
    if (page === "burns") {
      pageType.value = '';
      showMenu();
    }
  },
  { immediate: true },
);

onMounted(() => {
  showMenu();
});
</script>

<template>
  <div v-if="!pageType" class="pg">
    <div class="blocks">
      <div class="block">
        <div class="context">
          <p>gifts burn</p>
          <h4>210</h4>
        </div>
        <div class="image">
          <img :src="Burn1" alt="burn-1">
        </div>
      </div>
      <div class="block" @click="openHistoryBurns({})">
        <div class="context">
          <p>Points Earned</p>
          <div class="flexed">
            <h4>3M</h4>
            <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
          </div>
        </div>
        <div class="image">
          <img :src="Burn2" alt="burn-2">
        </div>
      </div>
      <div class="block league">
        <div class="context">
          <p>League silver</p>
          <div class="flexed">
            <h4>#95</h4>
            <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
          </div>
        </div>
        <div class="image">
          <img :src="Burn3" alt="burn-3">
        </div>
      </div>
    </div>
  </div>

  <History v-else-if="pageType === 'burns/history'" />
</template>

<style lang="scss" src="./Burns.scss" scoped></style>