<script setup lang="ts">
import { ref, computed } from "vue";
// import { useModal } from "../../components/common/Modal";

import Head from "./Components/Head/Head.vue";
import Split from "./Components/Split/Split.vue";
import Burns from "./Components/Burns/Burns.vue";
import DAO from "./Components/DAO/DAO.vue";
import Portfolio from "./Components/Portfolio/Portfolio.vue";
import Transactions from "./Components/Transactions/Transactions.vue";
import Craft from "./Components/Craft/Craft.vue";
import Controls from "./Components/Controls/Controls.vue";

// Icons
import InfoRawIcon from "@/assets/icons/info.svg?raw";

// Images
import VotingBgImage from "@/assets/images/profile-pg/voting-bg.png";

// import LaunchVotingModal from "./Components/Modals/LaunchVoting.vue";
// import DaoRuleModal from "./Components/Modals/DaoRule.vue";

// const { open } = useModal();

// async function openLaunchVotingModal() {
//   const choose = open(LaunchVotingModal, {});
//   const dest = await choose.done.catch(() => null);
//   if (!dest) return;
// }

// async function openDaoRuleModal() {
//   const choose = open(DaoRuleModal, {});
//   const dest = await choose.done.catch(() => null);
//   if (!dest) return;
// }

// openDaoRuleModal();

/* ================= DATA ================= */
const page = ref("split");
const sectionActive = ref("split");
const sections = [
  { id: "split", title: "Split", unread: false },
  { id: "burns", title: "Burns", unread: false },
  { id: "dao", title: "DAO", unread: true },
  { id: "craft", title: "Craft", unread: false },
  { id: "portfolio", title: "Portfolio", unread: false },
  { id: "transactions", title: "Transactions", unread: false },
];

/* ================= CONFIG ================= */
const MAX_OFFSET = 180; // высота анимации блока
const scrollRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const lastScrollTop = ref(0);
const scrollDirection = ref<'up' | 'down'>('down');

const showInfo = computed(() => {
  if (page.value === 'split/gift') return false;
  if (page.value === 'burns/history') return false;
  if (page.value === 'portfolio/select-gifts') return false;
  return true;
});

/* ================= SCROLL ================= */
function handleScroll() {
  if (!scrollRef.value) return;
  const currentScroll = scrollRef.value.scrollTop;

  // Определяем направление скролла
  scrollDirection.value = currentScroll > lastScrollTop.value ? 'down' : 'up';
  lastScrollTop.value = currentScroll;

  // Всегда обновляем scrollTop до реального значения
  scrollTop.value = currentScroll;
}

/* ================= EASING ================= */
function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/* ================= PROGRESS ================= */
const progress = computed(() => Math.min(scrollTop.value / MAX_OFFSET, 1));

/* ================= STYLES ================= */
const headStyle = computed(() => {
  const p = progress.value;
  const easedP = easeOutCubic(p);
  return {
    transform: `translateY(${easedP * 16}px) scale(${1 - easedP * 0.04})`,
    opacity: `${Math.max(1 - easedP * 1.6, 0)}`,
  };
});

const blockerStyle = computed(() => {
  const p = progress.value;
  const easedP = easeInOutCubic(p);
  const radius = 20 * (1 - easedP);
  return {
    borderRadius: `${radius}px ${radius}px 0 0`,
    transform: `translateY(${-easedP * 6}px)`,
  };
});

const blockerInnerStyle = computed(() => {
  const p = progress.value;
  const start = 0.3;
  let innerP = Math.max((p - start) / (1 - start), 0);
  innerP = easeOutCubic(innerP);
  return {
    opacity: `${1 - innerP * 0.15}`,
  };
});

function handleSectionClick(id: string) {
  sectionActive.value = id;
}

function handlePageClick(name: string) {
  page.value = name;
}
</script>

<template>
  <div
    ref="scrollRef"
    class="profile"
    @scroll="handleScroll"
  >
    <div class="bg"></div>

    <div class="head" :style="headStyle">
      <Head />
    </div>

    <div class="blocker" :style="blockerStyle">
      <div class="blocker-inner" :style="blockerInnerStyle">
        <div v-if="showInfo" class="info">
          <div class="bg">
            <img :src="VotingBgImage" alt="head-info-bg" />
          </div>

          <div class="content">
            <div class="left">
              <div class="kit-icon" v-html="InfoRawIcon"></div>
              <h4>DAO voting is now open</h4>
            </div>

            <div class="right">
              <div class="button">
                <button>
                  <h4>Vote</h4>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showInfo" class="sections">
          <div
            v-for="(item, index) in sections"
            :key="index"
            class="item"
            :class="{ active: sectionActive === item.id }"
            @click="handleSectionClick(item.id)"
          >
            <div v-if="item.unread" class="mark"></div>
            <h4>{{ item.title }}</h4>
          </div>
        </div>

        <Split
          v-if="sectionActive === 'split'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />

        <Burns
          v-if="sectionActive === 'burns'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />

        <DAO
          v-if="sectionActive === 'dao'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />

        <Craft
          v-if="sectionActive === 'craft'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />

        <Portfolio
          v-if="sectionActive === 'portfolio'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />

        <Transactions
          v-if="sectionActive === 'transactions'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"

          :page="page"
          @setPage="handlePageClick"
        />
      </div>
    </div>

    <div class="controls">
      <Controls 
        :page="page"
        @setPage="handlePageClick"
      />
    </div>

    <div class="content"></div>
  </div>
</template>

<style lang="scss" src="./Profile.scss" scoped></style>