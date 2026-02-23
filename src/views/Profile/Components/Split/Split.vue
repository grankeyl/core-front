<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fundsApi } from "../../../../api/funds";
import type { Fund, FundType } from "../../../../types/funds";
import { useModal } from "../../../../components/common/Modal";

import Items from "./Items/Items.vue";
import Gift from "./Pages/Gift/Gift.vue";
import TypeModal from "../../../../views/Home/Components/Modals/Type.vue";
import { showMenu } from "../../../../utils/useApp";

const { open } = useModal();

const pageType = ref("");
const funds = ref<Fund[]>([]);
const loading = ref(true);

const typeItems = ref<any[]>([
  { id: "GIFT",     title: "Telegram gifts",             active: false },
  { id: "PHONE",    title: "Telegram anonymous numbers", active: false },
  { id: "NICKNAME", title: "Telegram username",          active: false },
]);

const emit = defineEmits<{
  (e: "setSection", id: string): void;
  (e: "setPage", name: string): void;
}>();

const props = defineProps<{
  sectionActive: string;
  sections: any[];
  page: string;
}>();

function getActiveTypes(): FundType | undefined {
  const active = typeItems.value.filter((i) => i.active);
  if (active.length === 0 || active.length === typeItems.value.length) return undefined;
  if (active.length === 1) return active[0].id as FundType;
  return undefined;
}

async function fetchFunds() {
  try {
    loading.value = true;
    funds.value = await fundsApi.getFunds({
      withMe: true,
      onlyActive: true,
      sort: "LATEST",
      type: getActiveTypes(),
    });
  } catch (error) {
    console.error("Failed to fetch my splits:", error);
  } finally {
    loading.value = false;
  }
}

async function openType() {
  const choose = open(TypeModal, {
    Items: typeItems.value,
    onReset: () => {
      typeItems.value = typeItems.value.map((i) => ({
        ...i,
        active: false,
      }));
      fetchFunds();
    },
    onApply: (data: any[]) => {
      typeItems.value = data;
      fetchFunds();
    },
  });
  await choose.done.catch(() => null);
}

function openGift(_data?: any) {
  pageType.value = "gift";
  emit("setPage", "split/gift");
}

watch(
  () => props.page,
  (page) => {
    if (page === "split") {
      pageType.value = "";
      showMenu();
      fetchFunds();
    }
  },
  { immediate: true }
);

onMounted(() => {
  showMenu();
  fetchFunds();
});
</script>

<template>
  <div v-if="!pageType" class="pg">
    <Items
      :funds="funds"
      :loading="loading"
      :type-items="typeItems"
      @open-type="openType"
      @openGift="openGift"
    />
  </div>

  <Gift v-else-if="pageType === 'gift'" />
</template>

<style lang="scss" src="./Split.scss" scoped></style>