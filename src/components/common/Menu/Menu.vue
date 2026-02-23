<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCacheStore } from "@/stores/pinia-store";

// Icons
import BlocksIcon from "@/assets/icons/blocks.svg?raw";
// import FireIcon from "@/assets/icons/fire.svg?raw"; // burn temporarily hidden
import EditIcon from "@/assets/icons/edit.svg?raw";

const route = useRoute();
const router = useRouter();
const ActiveMenu = ref('cases');

const useCache = useCacheStore() as any;

const menuItems = [
  { id: 'home', icon: BlocksIcon, path: '/' },
  // { id: 'burn', icon: FireIcon, path: '/burn' }, // temporarily hidden
  { id: 'craft-pools', icon: EditIcon, path: '/craft-pools' },
  { id: 'profile', icon: null, path: '/profile' },
];

const CheckDisabledMenu = () => {
  if (route.path.startsWith('/shared')) return true;
  return false;
}

const SwitchMenu = (menu: any) => {
  ActiveMenu.value = menu.id;
  router.push(menu.path);
}

const CheckActiveMenu = (menu: any) => {
  if (menu.path === '/') return route.path === '/';
  return route.path.startsWith(menu.path);
}
</script>

<template>
  <div v-if="!CheckDisabledMenu()" class="menu">
    <div class="items">
      <div 
        v-for="item in menuItems"
        :key="item.id"
        @click="SwitchMenu(item)"
        class="item"
        :class="{ active: CheckActiveMenu(item) }"
      >
        <template v-if="item.id === 'profile'">
          <img :src="useCache.UserData.photoUrl" alt="avatar">
        </template>
        <template v-else>
          <div class="kit-icon" v-html="item.icon"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Menu.scss" scoped></style>
