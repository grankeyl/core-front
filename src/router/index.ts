import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/Home/Home.vue";
import SharedView from "../views/Shared/Shared.vue";
import ProfileView from "../views/Profile/Profile.vue";
import BurnView from "../views/Burn/Burn.vue";
import BurnItemView from "../views/BurnItem/BurnItem.vue";
import CraftPoolsView from "../views/CraftPools/CraftPools.vue";
import CraftPoolDetailView from "../views/CraftPoolDetail/CraftPoolDetail.vue";
import CraftPoolCreateView from "../views/CraftPoolCreate/CraftPoolCreate.vue";
import MyPoolsView from "../views/MyPools/MyPools.vue";
import CraftPoolsByGiftView from "../views/CraftPoolsByGift/CraftPoolsByGift.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/shared/:id", component: SharedView },
  { path: "/profile", component: ProfileView },
  { path: "/burn", component: BurnView },
  { path: "/burn/item/:id", component: BurnItemView },
  { path: "/craft-pools", component: CraftPoolsView },
  { path: "/craft-pools/gift/:slug", component: CraftPoolsByGiftView },
  { path: "/craft-pools/pool/:id", component: CraftPoolDetailView },
  { path: "/craft-pools/create", component: CraftPoolCreateView },
  { path: "/craft-pools/my", component: MyPoolsView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
