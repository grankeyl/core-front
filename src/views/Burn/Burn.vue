<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useModal } from "../../components/common/Modal";
import { auctionsApi } from "../../api/auctions";
import type { Auction } from "../../types/auctions";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";
import Type from "./Components/Modals/Type.vue";
import Status from "./Components/Modals/Status.vue";
import SortBy from "./Components/Modals/SortBy.vue";
import Funcs from "./Components/Funcs/Funcs.vue";

import TelegramModule from "../../hooks/useTelegram";
import { showMenu } from "../../utils/useApp";

const { open } = useModal();

const auctions = ref<Auction[]>([]);
const loading = ref<boolean>(true);

const typeItems = ref<any[]>([
  { id: "tg_gifts",        title: "Gifts",             active: true },
  { id: "tg_anon_numbers", title: "Anonymous numbers", active: false },
  { id: "tg_usernames",    title: "Username",          active: false },
  { id: "cocoon",          title: "Cocoon",                     active: false },
]);

const statusItems = ref<any[]>([
  { id: "fundraising", title: "Fundraising", active: true },
  { id: "close", title: "Close", active: false },
]);

const sortByItems = ref<any>({
  active: "latest",
  items: [
    { id: "latest", title: "Latest" },
    { id: "price_low_to_high", title: "Price: Low to High" },
    { id: "price_high_to_low", title: "Price: High to Low" },
  ]
});

async function openType() {
  const choose = open(Type, {
    Items: typeItems.value,
    onReset: () => {
      typeItems.value = typeItems.value.map((i) => ({
        ...i,
        active: i.id === "tg_gifts",
      }));
    },
    onApply: (data: any[]) => {
      typeItems.value = data;
    },
  });

  await choose.done.catch(() => null);
}

async function openStatus() {
  const choose = open(Status, {
    Items: statusItems.value,
    onReset: () => {
      statusItems.value = statusItems.value.map((i) => ({
        ...i,
        active: i.id === "fundraising",
      }));
    },
    onApply: (data: any[]) => {
      statusItems.value = data;
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
    },
    onApply: (id: string) => {
      sortByItems.value.active = id;
    },
  });

  await choose.done.catch(() => null);
}

async function fetchAuctions() {
  try {
    loading.value = true;
    auctions.value = await auctionsApi.getAuctions({
      withMe: false,
      onlyActive: true,
    });
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  TelegramModule.hideBackButton();
  showMenu();
  fetchAuctions();
});
</script>

<template>
    <div class="section">
        <Head />
        <Items
          :auctions="auctions"
          :loading="loading"
          @open-type="openType"
          @open-status="openStatus"
          @open-sort-by="openSortBy"
        />
        <Funcs v-if="!loading && auctions.length > 0" :auctions="auctions" />
    </div>
</template>

<style lang="scss" src="./Burn.scss" scoped></style>