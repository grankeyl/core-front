<script setup lang="ts">
import { ref } from "vue";
import type { CraftPoolGrouped } from "../../../../types/craft";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";

const props = defineProps<{
  groups: CraftPoolGrouped[];
  loading: boolean;
  typeItems: any[];
}>();

const emit = defineEmits<{
  (e: "open-type"): void;
  (e: "open-gift", slug: string, title: string): void;
}>();

const viewMode = ref<"grid" | "list">("grid");

function getTypeLabel(): string {
  const active = props.typeItems.filter((i) => i.active);
  if (active.length === 0 || active.length === props.typeItems.length) return "All";
  if (active.length === 1) return active[0].title;
  return `${active.length} selected`;
}
</script>

<template>
  <div class="items" :class="{ skeleton: loading }">
    <div class="controls">
      <div class="filter-type" @click="emit('open-type')">
        <div class="context">
          <p>TYPE</p>
          <h4>{{ getTypeLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>

      <div class="view-toggle">
        <button class="toggle-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.958 3.289c-.672 0-1.617.16-2.244.285a.148.148 0 00-.14.14c-.125.627-.285 1.572-.285 2.244 0 .671.16 1.616.285 2.244a.148.148 0 00.14.14c.627.125 1.572.285 2.244.285.671 0 1.616-.16 2.244-.285a.148.148 0 00.14-.14c.125-.627.285-1.572.285-2.244 0-.672-.16-1.617-.285-2.244a.148.148 0 00-.14-.14c-.628-.125-1.573-.285-2.244-.285zM3.43 2.147C4.058 2.021 5.129 1.833 5.958 1.833c.83 0 1.9.188 2.529.314.649.13 1.154.634 1.283 1.283.126.629.313 1.699.313 2.529 0 .83-.188 1.9-.313 2.529-.13.648-.634 1.153-1.283 1.283-.628.125-1.699.313-2.529.313-.83 0-1.9-.188-2.529-.313-.649-.13-1.153-.634-1.283-1.283-.125-.629-.313-1.7-.313-2.53 0-.829.188-1.9.313-2.528.13-.649.634-1.154 1.283-1.283z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.958 13.373c-.672 0-1.617.16-2.244.285a.148.148 0 00-.14.14c-.125.627-.285 1.572-.285 2.244 0 .671.16 1.616.285 2.244a.148.148 0 00.14.14c.627.125 1.572.285 2.244.285.671 0 1.616-.16 2.244-.285a.148.148 0 00.14-.14c.125-.627.285-1.572.285-2.244 0-.672-.16-1.617-.285-2.244a.148.148 0 00-.14-.14c-.628-.125-1.573-.285-2.244-.285zM3.43 12.23c.628-.126 1.699-.313 2.528-.313.83 0 1.9.187 2.529.313.649.13 1.154.634 1.283 1.283.126.629.313 1.699.313 2.529 0 .83-.188 1.9-.313 2.529-.13.649-.634 1.153-1.283 1.283-.628.125-1.699.313-2.529.313-.83 0-1.9-.188-2.529-.313-.649-.13-1.153-.635-1.283-1.283-.125-.629-.313-1.7-.313-2.53 0-.829.188-1.9.313-2.528.13-.649.634-1.154 1.283-1.283z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.042 3.289c-.672 0-1.617.16-2.244.285a.148.148 0 00-.14.14c-.126.627-.286 1.572-.286 2.244 0 .671.16 1.616.286 2.244a.148.148 0 00.14.14c.627.125 1.572.285 2.244.285.671 0 1.616-.16 2.244-.285a.148.148 0 00.14-.14c.125-.627.285-1.572.285-2.244 0-.672-.16-1.617-.285-2.244a.148.148 0 00-.14-.14c-.628-.125-1.573-.285-2.244-.285zM13.513 2.147c.629-.126 1.699-.314 2.529-.314.83 0 1.9.188 2.529.314.649.13 1.153.634 1.283 1.283.125.629.313 1.699.313 2.529 0 .83-.188 1.9-.313 2.529-.13.648-.634 1.153-1.283 1.283-.629.125-1.7.313-2.53.313-.829 0-1.9-.188-2.528-.313-.649-.13-1.154-.634-1.283-1.283a15.34 15.34 0 01-.314-2.53c0-.829.188-1.9.314-2.528.13-.649.634-1.154 1.283-1.283z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.042 13.373c-.672 0-1.617.16-2.244.285a.148.148 0 00-.14.14c-.126.627-.286 1.572-.286 2.244 0 .671.16 1.616.286 2.244a.148.148 0 00.14.14c.627.125 1.572.285 2.244.285.671 0 1.616-.16 2.244-.285a.148.148 0 00.14-.14c.125-.627.285-1.572.285-2.244 0-.672-.16-1.617-.285-2.244a.148.148 0 00-.14-.14c-.628-.125-1.573-.285-2.244-.285zM13.513 12.23c.629-.126 1.699-.313 2.529-.313.83 0 1.9.187 2.529.313.649.13 1.153.634 1.283 1.283.125.629.313 1.699.313 2.529 0 .83-.188 1.9-.313 2.529-.13.649-.634 1.153-1.283 1.283-.629.125-1.7.313-2.53.313-.829 0-1.9-.188-2.528-.313-.649-.13-1.154-.635-1.283-1.283a15.34 15.34 0 01-.314-2.53c0-.829.188-1.9.314-2.528.13-.649.634-1.154 1.283-1.283z" fill="currentColor"/>
          </svg>
        </button>
        <button class="toggle-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.756 5.958c0-.634-.151-1.52-.28-2.15a.17.17 0 00-.18-.152C16.854 3.542 13.4 3.29 11 3.29c-2.4 0-5.853.253-7.297.367a.17.17 0 00-.179.153c-.129.629-.28 1.515-.28 2.15 0 .633.151 1.52.28 2.149a.17.17 0 00.179.152c1.443.115 4.897.368 7.297.368 2.4 0 5.853-.253 7.297-.368a.17.17 0 00.18-.152c.128-.629.28-1.516.28-2.15zM19.855 3.508c.13.633.312 1.65.312 2.45s-.182 1.818-.312 2.451c-.15.732-.75 1.246-1.45 1.302-1.44.115-4.944.372-7.405.372-2.461 0-5.965-.257-7.405-.372-.7-.056-1.3-.57-1.45-1.302-.13-.633-.312-1.65-.312-2.45s.182-1.818.312-2.451c.15-.732.75-1.246 1.45-1.302C5.035 2.09 8.539 1.833 11 1.833c2.461 0 5.965.258 7.405.373.7.056 1.3.57 1.45 1.302z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.756 16.042c0-.634-.151-1.52-.28-2.15a.17.17 0 00-.18-.152c-1.443-.115-4.897-.367-7.296-.367-2.4 0-5.854.252-7.297.367a.17.17 0 00-.18.152c-.128.63-.28 1.516-.28 2.15 0 .634.152 1.52.28 2.15a.17.17 0 00.18.152c1.443.115 4.897.367 7.297.367 2.4 0 5.853-.252 7.297-.367a.17.17 0 00.179-.152c.129-.63.28-1.516.28-2.15zM19.855 13.591c.13.633.312 1.65.312 2.45 0 .801-.182 1.818-.312 2.451-.15.732-.75 1.247-1.45 1.303-1.44.115-4.944.372-7.405.372-2.461 0-5.965-.257-7.405-.372-.7-.056-1.3-.57-1.45-1.303-.13-.633-.312-1.65-.312-2.45 0-.801.182-1.818.312-2.451.15-.732.75-1.246 1.45-1.302C5.035 12.174 8.539 11.917 11 11.917c2.461 0 5.965.257 7.405.372.7.056 1.3.57 1.45 1.302z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Skeleton grid -->
    <div v-if="loading && groups.length === 0" class="grid">
      <div v-for="i in 6" :key="i" class="card sk-card">
        <div class="card-image sk-load"></div>
        <div class="card-info">
          <div class="sk-load" style="height:14px; width:70%; border-radius:6px"></div>
          <div class="sk-load" style="height:20px; width:50%; border-radius:10px; margin-top:6px"></div>
        </div>
      </div>
    </div>
    <div v-else-if="!loading && groups.length === 0" class="empty-message">
      <p>No pools available</p>
    </div>

    <!-- Grid mode: gift categories -->
    <div v-else-if="viewMode === 'grid'" class="grid">
      <div
        v-for="group in groups"
        :key="group.slug"
        class="card"
        @click="emit('open-gift', group.slug, group.title)"
      >
        <div class="card-image">
          <img :src="group.image" :alt="group.title" />
        </div>
        <div class="card-info">
          <h4>{{ group.title }}</h4>
          <div class="badge">
            <span>{{ group.poolCount }} POOLS</span>
          </div>
        </div>
      </div>
    </div>

    <!-- List mode: gift categories as rows -->
    <div v-else class="list">
      <div
        v-for="group in groups"
        :key="group.slug"
        class="list-item"
        @click="emit('open-gift', group.slug, group.title)"
      >
        <div class="list-image">
          <img :src="group.image" :alt="group.title" />
        </div>
        <div class="list-context">
          <h4>{{ group.title }}</h4>
          <div class="badge">
            <span>{{ group.poolCount }} POOLS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>
