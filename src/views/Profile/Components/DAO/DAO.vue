<script setup lang="ts">
import { onMounted, ref } from "vue";
import { showMenu } from "../../../../utils/useApp";

import Items from "./Items/Items.vue";

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
      <Items />
  </div>
</template>

<style lang="scss" src="./DAO.scss" scoped></style>