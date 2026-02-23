<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
// import { useModal } from "../../components/common/Modal";

import Head from "./Components/Head/Head.vue";
import Split from "./Components/Split/Split.vue";
// import Burns from "./Components/Burns/Burns.vue"; // temporarily hidden
import DAO from "./Components/DAO/DAO.vue";
import Portfolio from "./Components/Portfolio/Portfolio.vue";
import Transactions from "./Components/Transactions/Transactions.vue";
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
  // { id: "burns", title: "Burns", unread: false }, // temporarily hidden
  { id: "dao", title: "DAO", unread: true },
  { id: "portfolio", title: "Portfolio", unread: false },
  { id: "transactions", title: "Transactions", unread: false },
];

/* ================= REFS ================= */
const scrollRef  = ref<HTMLElement | null>(null);
const headRef    = ref<HTMLElement | null>(null);
const headHeight = ref(380);
const scrollY    = ref(0);
let rafId: number | null = null;
let snapTimer: number | null = null;

const showInfo = computed(() => {
  if (page.value === 'split/gift') return false;
  if (page.value === 'burns/history') return false;
  if (page.value === 'portfolio/select-gifts') return false;
  return true;
});

/* ================= DERIVED ================= */
// Голова плавно уходит: translateY вниз + scale down + fade
const headStyle = computed(() => {
  const p = Math.min(scrollY.value / headHeight.value, 1);
  return {
    transform: `translateY(${p * 24}px) scale(${1 - p * 0.05})`,
    opacity: String(Math.max(1 - p * 1.15, 0)),
  };
});

// Border-radius: когда blocker почти доехал до верха
const blockerAtTop = computed(() => scrollY.value >= headHeight.value - 30);

const blockerMargin = computed(() => ({ marginTop: `${headHeight.value}px` }));

/* ================= SCROLL ================= */
function handleScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    if (!scrollRef.value) return;
    scrollY.value = scrollRef.value.scrollTop;

    // Snap: предугадываем — если остановились в переходной зоне (0..headHeight)
    if (snapTimer !== null) clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      if (!scrollRef.value) return;
      const s = scrollRef.value.scrollTop;
      // Уже в зоне контента — не трогаем
      if (s >= headHeight.value) return;
      const ratio = s / headHeight.value;
      if (ratio >= 0.4) {
        // Больше 40% пути — доматываем до конца
        scrollRef.value.scrollTo({ top: headHeight.value, behavior: 'smooth' });
      } else if (ratio > 0.01) {
        // Меньше 40% — возвращаем в начало
        scrollRef.value.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  });
}

let ro: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    if (headRef.value) {
      headHeight.value = headRef.value.offsetHeight;
      ro = new ResizeObserver(() => {
        if (headRef.value) headHeight.value = headRef.value.offsetHeight;
      });
      ro.observe(headRef.value);
    }
  });
});

onBeforeUnmount(() => {
  ro?.disconnect();
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
    :class="{ 'profile--select-gifts': page === 'portfolio/select-gifts' }"
    @scroll="handleScroll"
  >
    <div class="profile-bg"></div>
    <div ref="headRef" class="head-wrapper" :style="headStyle">
      <Head @setSection="handleSectionClick" />
    </div>

    <div class="blocker" :style="blockerMargin" :class="{ 'blocker--at-top': blockerAtTop }">
      <div class="blocker-inner">
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

        <!-- Burns temporarily hidden
        <Burns
          v-if="sectionActive === 'burns'"
          :sections="sections"
          :sectionActive="sectionActive"
          @setSection="handleSectionClick"
          :page="page"
          @setPage="handlePageClick"
        />
        -->

        <DAO
          v-if="sectionActive === 'dao'"
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
  </div>
</template>

<style lang="scss" src="./Profile.scss" scoped></style>