<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useModal } from "../../../../../../components/common/Modal";
import { hideMenu } from "../../../../../../utils/useApp";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";
import Rare from "./Components/Modals/Rare.vue";

import TelegramModule from "../../../../../../hooks/useTelegram";

const { open } = useModal();

const rareItems = ref<any[]>([
  { id: "tg_gifts",        title: "Gifts",             active: true },
  { id: "tg_anon_numbers", title: "Anonymous numbers", active: false },
  { id: "tg_usernames",    title: "Username",          active: false },
  { id: "cocoon",          title: "Cocoon",                     active: false },
]);

async function openRare() {
  const choose = open(Rare, {
    Items: rareItems.value,
    onReset: () => {
      rareItems.value = rareItems.value.map((i) => ({
        ...i,
        active: i.id === "tg_gifts",
      }));
    },
    onApply: (data: any[]) => {
      rareItems.value = data;
    },
  });

  await choose.done.catch(() => null);
}

onMounted(() => {
  TelegramModule.hideBackButton();
  hideMenu();
});
</script>

<template>
    <div class="section">
        <Head />
        <Items
          @open-rare="openRare"
        />
    </div>
</template>

<style lang="scss" src="./SelectGifts.scss" scoped></style>