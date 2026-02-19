<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { showMenu } from "../../utils/useApp";
import type { CraftPool, CraftPoolGrouped } from "../../types/craft";
import { mockPools } from "../../mocks/craft";

// Components
import Head from "./Components/Head/Head.vue";
import Items from "./Components/Items/Items.vue";

const router = useRouter();
const pools = ref<CraftPool[]>([]);
const loading = ref<boolean>(true);

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

function handleOpenType() {
  // TODO: open type filter modal
}

function handleOpenGift(slug: string) {
  router.push(`/craft-pools/gift/${slug}`);
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
      @open-type="handleOpenType"
      @open-gift="handleOpenGift"
    />
  </div>
</template>

<style lang="scss" src="./CraftPools.scss" scoped></style>
