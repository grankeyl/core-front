<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { DAO } from "../../../../../types/dao";
import { daoApi } from "../../../../../api/dao";

// Icons
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw"
import DaoNo from "@/assets/images/profile-pg/dao-no.png";

const items = ref<DAO[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  await fetchDAOList();
});

async function fetchDAOList() {
  try {
    loading.value = true;
    items.value = await daoApi.getDAOList();
  } catch (error) {
    console.error("Failed to fetch DAO list:", error);
  } finally {
    loading.value = false;
  }
}

function getStatusText(status: string): string {
  if (status === 'ACTIVE') return 'Voting is Open';
  if (status === 'COMPLETED') return 'Voting Closed';
  return status;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
</script>

<template>
  <div class="content" :class="{ skeleton: loading }">
    <div v-if="!loading && items && items.length > 0" class="lists">
      <div class="flexed">
        <div v-for="item in items" :key="item.id" class="item">
          <div class="inner">
            <div class="head">
              <div class="image">
                <img :src="item.gift.image" :alt="item.gift.title">
              </div>
              <div class="context">
                <h4>{{ item.gift.title }}</h4>
                <p>#{{ formatNumber(item.gift.num) }}</p>
              </div>
            </div>
            <div class="info">
              <h4>{{ getStatusText(item.status) }}</h4>
              <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && (!items || items.length === 0)" class="no-dao">
      <img :src="DaoNo" alt="no-dao" />
      <h4>No active DAO votes</h4>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>