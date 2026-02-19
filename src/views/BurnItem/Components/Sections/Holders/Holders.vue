<script setup lang="ts">
import { ref, computed } from "vue";
import type { AuctionDetail } from "../../../../../../types/auctions";

const props = defineProps<{
  auction: AuctionDetail;
}>();

const skeleton = ref<boolean>(false);

// Sort participants by sum (descending)
const sortedParticipants = computed(() => {
  return [...props.auction.participants].sort((a, b) => b.sum - a.sum);
});

function getDisplayName(user: any): string {
  if (user.username) return '@' + user.username;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return 'Anonymous';
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
</script>

<template>
  <div class="holders" :class="{ skeleton }">
    <div v-if="sortedParticipants.length === 0" class="empty-state">
      <p>No participants yet</p>
    </div>
    <table v-else class="holders-table">
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th></th>
          <th class="ownership">core points</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(participant, i) in sortedParticipants" :key="participant.id">
          <td>{{ i + 1 }}</td>
          <td class="image">
            <img
              class="avatar"
              :src="participant.user.photoUrl || 'https://via.placeholder.com/40'"
              :alt="getDisplayName(participant.user)"
            >
          </td>
          <td class="name">{{ getDisplayName(participant.user) }}</td>
          <td class="percents">{{ formatNumber(participant.sum) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss" src="./Holders.scss"></style>
<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 200px;
}

.empty-state p {
  color: rgba(0, 0, 0, 0.40);
  font-size: 15px;
  font-weight: 500;
  text-align: center;
}
</style>