<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import { useModal } from "../../components/common/Modal";
import type { CraftPool, CraftPoolGrouped } from "../../types/craft";
import { mockPools } from "../../mocks/craft";
import TypeModal from "../Home/Components/Modals/Type.vue";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";

const { open } = useModal();
const router = useRouter();
const pools = ref<CraftPool[]>([]);
const loading = ref<boolean>(true);

const typeItems = ref<any[]>([
  { id: "GIFT",     title: "Telegram gifts",             active: false },
  { id: "PHONE",    title: "Telegram anonymous numbers", active: false },
  { id: "NICKNAME", title: "Telegram username",          active: false },
]);

const grouped = computed<CraftPoolGrouped[]>(() => {
  const map = new Map<string, CraftPoolGrouped>();
  for (const pool of pools.value) {
    const key = pool.giftInfo?.slug || pool.id;
    if (!map.has(key)) {
      map.set(key, {
        slug: key,
        title: pool.giftInfo?.title || "Unknown",
        image: pool.giftInfo?.image || "",
        poolCount: 0,
        pools: [],
      });
    }
    const group = map.get(key)!;
    group.poolCount++;
    group.pools.push(pool);
  }
  return Array.from(map.values());
});

const myPoolsCount = computed(() => {
  return pools.value.filter((p) => p.members && p.members.length > 0).length;
});

async function fetchPools() {
  loading.value = true;
  // Mock: simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  pools.value = mockPools;
  loading.value = false;
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
  fetchPools();
});
</script>

<template>
  <div class="section">
    <Head
      :my-pools-count="myPoolsCount"
      @create-pool="handleCreatePool"
      @open-my-pools="handleOpenMyPools"
    />
    <Items
      :groups="grouped"
      :loading="loading"
      :type-items="typeItems"
      @open-type="handleOpenType"
      @open-gift="(slug, title) => handleOpenGift(slug, title)"
    />
  </div>
</template>

<style lang="scss" src="./CraftPools.scss" scoped></style>
