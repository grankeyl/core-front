<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useModal } from "../../components/common/Modal";
import { fundsApi } from "../../api/funds";
import type { Fund } from "../../types/funds";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";
import Type from "./Components/Modals/Type.vue";
import Status from "./Components/Modals/Status.vue";
import SortBy from "./Components/Modals/SortBy.vue";

import TelegramModule from "../../hooks/useTelegram";
import { showMenu } from "../../utils/useApp";

const { open } = useModal();

const funds = ref<Fund[]>([]);
const loading = ref<boolean>(true);

const typeItems = ref<any[]>([
  { id: "tg_gifts",        title: "Telegram gifts",             active: true },
  { id: "tg_anon_numbers", title: "Telegram anonymous numbers", active: false },
  { id: "tg_usernames",    title: "Telegram username",          active: false },
  { id: "cocoon",          title: "Cocoon",                     active: false },
]);

const statusItems = ref<any[]>([
  { id: "active",    title: "Active",    active: true },
  { id: "completed", title: "Completed", active: true },
  { id: "cancelled", title: "Cancelled", active: true },
]);

const sortByItems = ref<any>({
  active: "latest",
  items: [
    { id: "latest", title: "Latest" },
    { id: "price_low_to_high", title: "Price: Low to High" },
    { id: "price_high_to_low", title: "Price: High to Low" },
  ]
});

function getOnlyActiveParam(): boolean {
  const activeStatuses = statusItems.value.filter(item => item.active);
  if (activeStatuses.length === 0 || activeStatuses.length === statusItems.value.length) return false;
  if (activeStatuses.length === 1 && activeStatuses[0].id === "active") return true;
  return false;
}

async function fetchFunds() {
  try {
    loading.value = true;
    const sortMap: Record<string, 'LATEST' | 'LOW_COST' | 'HIGH_COST'> = {
      latest: 'LATEST',
      price_low_to_high: 'LOW_COST',
      price_high_to_low: 'HIGH_COST',
    };
    let list = await fundsApi.getFunds({
      onlyActive: getOnlyActiveParam(),
      withMe: false,
      sort: sortMap[sortByItems.value.active] ?? 'LATEST',
    });
    const activeStatusIds = statusItems.value.filter((i) => i.active).map((i) => i.id);
    const allSelected = activeStatusIds.length === statusItems.value.length;
    if (!allSelected && activeStatusIds.length > 0) {
      const statusSet = new Set(activeStatusIds.map((s) => s.toUpperCase()));
      list = list.filter((f) => statusSet.has(f.status));
    }
    funds.value = list;
  } catch (error) {
    console.error("Failed to fetch funds:", error);
  } finally {
    loading.value = false;
  }
}

async function openType() {
  const choose = open(Type, {
    Items: typeItems.value,
    onReset: () => {
      typeItems.value = typeItems.value.map((i) => ({
        ...i,
        active: i.id === "tg_gifts",
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

async function openStatus() {
  const choose = open(Status, {
    Items: statusItems.value,
    onReset: () => {
      statusItems.value = statusItems.value.map((i) => ({ ...i, active: true }));
      fetchFunds();
    },
    onApply: (data: any[]) => {
      statusItems.value = data;
      fetchFunds();
    },
  });

  await choose.done.catch(() => null);
}

async function openSortBy() {
  const choose = open(SortBy, {
    Active: sortByItems.value.active,
    Items: sortByItems.value.items,
    onReset: () => {
      sortByItems.value.active = "latest";
      fetchFunds();
    },
    onApply: (id: string) => {
      sortByItems.value.active = id;
      fetchFunds();
    },
  });

  await choose.done.catch(() => null);
}

onMounted(() => {
  TelegramModule.hideBackButton();
  showMenu();
  fetchFunds();
});
</script>

<template>
    <div class="section">
        <Head />
        <Items
          :funds="funds"
          :loading="loading"
          :type-items="typeItems"
          :status-items="statusItems"
          :sort-by-active="sortByItems.active"
          :sort-by-items="sortByItems.items"
          @open-type="openType"
          @open-status="openStatus"
          @open-sort-by="openSortBy"
        />
    </div>
</template>

<style lang="scss" src="./Home.scss" scoped></style>