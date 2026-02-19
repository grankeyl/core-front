<script setup lang="ts">
import { ref, computed } from "vue";
import type { FundDetail } from "../../../../types/funds";

// Components
import Details from "./Details/Details.vue";
import Price from "./Price/Price.vue";
import Holders from "./Holders/Holders.vue";

const props = defineProps<{
  typeShared: string;
  fund: FundDetail;
}>();

const tabList = [
  { id: "details", title: "Details" },
  { id: "price", title: "Price History" },
  { id: "holders", title: "Holders" },
];

const tabActive = ref<string>("details");
const skeleton = ref<boolean>(false);

const setTab = (id: string) => {
  tabActive.value = id;
};

const tabRefs = ref<HTMLDivElement[]>([]);

const indicatorStyle = computed(() => {
  const index = tabList.findIndex((t) => t.id === tabActive.value);
  const el = tabRefs.value[index];
  if (!el) return {};

  const left = el.offsetLeft;
  const width = el.offsetWidth;

  return {
    width: `${width}px`,
    transform: `translateX(${left}px)`,
  };
});

const activeIndex = computed(() =>
  tabList.findIndex((t) => t.id === tabActive.value)
);

const trackStyle = computed(() => ({
  transform: `translateX(-${activeIndex.value * 100}%)`,
}));
</script>

<template>
  <div class="sections" :class="{ skeleton }">
    <div class="tabs">
      <div
        v-for="(tab, i) in tabList"
        :key="tab.id"
        class="tab"
        :class="{ active: tabActive === tab.id }"
        :ref="el => (tabRefs[i] = el as HTMLDivElement)"
        @click="setTab(tab.id)"
      >
        <h4>{{ tab.title }}</h4>
      </div>

      <div class="tabs__track"></div>
      <div class="tabs__indicator" :style="indicatorStyle"></div>
    </div>

    <div class="flexer">
      <div class="flexer__track" :style="trackStyle">
        <div
          v-for="tab in tabList"
          :key="tab.id"
          class="flexer__pane"
        >
          <Details
            v-if="tab.id === 'details'"
            :typeShared="props.typeShared"
            :fund="props.fund"
          />
          <Price
            v-else-if="tab.id === 'price'"
            :fund="props.fund"
          />
          <Holders
            v-else-if="tab.id === 'holders'"
            :fund="props.fund"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Sections.scss"></style>