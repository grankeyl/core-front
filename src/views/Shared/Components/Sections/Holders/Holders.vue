<script setup lang="ts">
import { ref, computed } from "vue";
import type { FundDetail } from "../../../../../types/funds";

const props = defineProps<{
  fund: FundDetail;
}>();

const skeleton = ref<boolean>(false);

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function calculateOwnership(quantity: number): string {
  if (props.fund.fractionNum === 0) return '0%';
  const percentage = (quantity / props.fund.fractionNum) * 100;
  return percentage.toFixed(2) + '%';
}

function getDisplayName(user: any): string {
  if (user.username) return '@' + user.username;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return 'Anonymous';
}

const sortedFractions = computed(() => {
  return [...props.fund.fractions].sort((a, b) => b.quantity - a.quantity);
});
</script>

<template>
  <div class="holders" :class="{ skeleton }">
    <table class="holders-table" v-if="fund.fractions.length > 0">
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th></th>
          <th class="shares">Shares</th>
          <th class="ownership">Ownership</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(fraction, i) in sortedFractions" :key="fraction.id">
          <td>{{ i + 1 }}</td>
          <td class="image">
            <img
              v-if="fraction.user.photoUrl"
              class="avatar"
              :src="fraction.user.photoUrl"
              :alt="getDisplayName(fraction.user)"
            />
            <div v-else class="avatar-placeholder"></div>
          </td>
          <td class="name">{{ getDisplayName(fraction.user) }}</td>
          <td class="shares">{{ formatNumber(fraction.quantity) }}</td>
          <td class="percents">{{ calculateOwnership(fraction.quantity) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-holders">
      <p>No shareholders yet</p>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Holders.scss"></style>