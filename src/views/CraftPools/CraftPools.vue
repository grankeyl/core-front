<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import { useModal } from "../../components/common/Modal";
import type { CraftCollection } from "../../types/craft";
import { craftApi } from "../../api/craft";
import TypeModal from "../Home/Components/Modals/Type.vue";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";

const { open } = useModal();
const router = useRouter();
const collections = ref<CraftCollection[]>([]);
const loading = ref<boolean>(true);

const typeItems = ref<any[]>([
  { id: "GIFT", title: "Gifts", active: true },
]);

async function fetchCollections() {
  try {
    loading.value = true;
    collections.value = await craftApi.getCollections();
  } catch (e) {
    console.error("Failed to fetch collections:", e);
    collections.value = [];
  } finally {
    loading.value = false;
  }
}

function handleCreatePool() {
  router.push("/craft-pools/create");
}

function handleOpenMyPools() {
  router.push("/craft-pools/my");
}

async function handleOpenType() {
  const choose = open(TypeModal, {
    Items: typeItems.value,
    onReset: () => {
      typeItems.value = typeItems.value.map((i) => ({ ...i, active: false }));
    },
    onApply: (data: any[]) => {
      typeItems.value = data;
    },
  });
  await choose.done.catch(() => null);
}

function handleOpenGift(slug: string, title: string) {
  router.push({ path: `/craft-pools/gift/${slug}`, state: { title } });
}

onMounted(() => {
  showMenu();
  fetchCollections();
});
</script>

<template>
  <div class="section">
    <Head
      :my-pools-count="0"
      @create-pool="handleCreatePool"
      @open-my-pools="handleOpenMyPools"
    />
    <Items
      :collections="collections"
      :loading="loading"
      :type-items="typeItems"
      @open-type="handleOpenType"
      @open-gift="(slug, title) => handleOpenGift(slug, title)"
    />
  </div>
</template>

<style lang="scss" src="./CraftPools.scss" scoped></style>
