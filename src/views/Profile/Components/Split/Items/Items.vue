<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Fund } from "../../../../../types/funds";

import FundChart from "./FundChart.vue";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg";
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw";

const router = useRouter();

const props = defineProps<{
  funds: Fund[];
  loading: boolean;
  typeItems: any[];
}>();

const emit = defineEmits<{
  (e: "open-type"): void;
  (e: "openGift", data: any): void;
}>();

function getTypeLabel(): string {
  const active = props.typeItems.filter((i) => i.active);
  if (active.length === 0 || active.length === props.typeItems.length) return "All";
  if (active.length === 1) return active[0].title;
  return `${active.length} selected`;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function openFund(fund: Fund) {
  if (fund.status === "CANCELLED") return;
  router.push(`/shared/${fund.id}`);
}
</script>

<template>
  <div class="content" :class="{ skeleton: props.loading }">
    <div class="filters">
      <div class="item" @click="emit('open-type')">
        <div class="context">
          <p>TYPE</p>
          <h4>{{ getTypeLabel() }}</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
    </div>

    <div class="lists">
      <div v-if="props.loading && props.funds.length === 0" class="sk-list">
        <div v-for="i in 4" :key="i" class="flexed">
          <div class="item">
            <div class="inner">
              <div class="head">
                <div class="image sk-load"></div>
                <div class="context">
                  <div class="sk-load sk-line sk-title"></div>
                  <div class="sk-load sk-line sk-subtitle"></div>
                </div>
                <div class="sk-load sk-graph"></div>
              </div>
            </div>
          </div>
          <div class="markdown"></div>
        </div>
      </div>
      <div v-else-if="!props.loading && props.funds.length === 0" class="empty-message">
        <p>No splits yet</p>
      </div>
      <div v-for="fund in props.funds" :key="fund.id" class="flexed">
        <div class="item" @click="openFund(fund)">
          <div class="inner">
            <div class="head">
              <div class="image">
                <img :src="fund.gift?.image || 'https://nft.fragment.com/gift/plushpepe-289.medium.jpg'" :alt="fund.gift?.title">
              </div>
              <div class="context">
                <h4>{{ fund.gift?.title || "Gift" }}</h4>
                <p>#{{ formatNumber(fund.gift?.num ?? 0) }}</p>
              </div>
              <FundChart :fund="fund" />
            </div>
          </div>
        </div>
        <div class="markdown">
          <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>