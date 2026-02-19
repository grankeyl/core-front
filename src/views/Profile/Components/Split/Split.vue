<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import Items from "./Items/Items.vue";
import Gift from "./Pages/Gift/Gift.vue";
import { showMenu } from "../../../../utils/useApp";

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

function openGift(data: any) {
  console.log(data);
  pageType.value = 'gift';
  emit("setPage", 'split/gift');
}

watch(
  () => props.page,
  (page) => {
    if (page === "split") {
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
      <Items 
        @openGift="openGift"
      />
  </div>

  <Gift v-else-if="pageType === 'gift'" />
</template>

<style lang="scss" src="./Split.scss" scoped></style>