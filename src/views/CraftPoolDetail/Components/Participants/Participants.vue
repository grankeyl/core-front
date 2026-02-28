<script setup lang="ts">
import type { CraftPool } from "../../../../types/craft";

const PLACEHOLDER = "https://nft.fragment.com/gift/InstantRamen-133166.webp";

const props = defineProps<{
  pool: CraftPool;
}>();

function getDisplayName(member: { username: string; firstName: string; lastName: string }): string {
  if (member.username) return member.username;
  if (member.firstName && member.lastName) return `${member.firstName} ${member.lastName}`;
  if (member.firstName) return member.firstName;
  return "Anonymous";
}

function calculateShare(_index: number): string {
  const total = props.pool.members?.length || 1;
  return (100 / total).toFixed(1);
}

function getGiftImage(member: { gift?: { image?: string } }): string {
  return member.gift?.image || PLACEHOLDER;
}

function getAvatarColor(index: number): string {
  const colors = ["#4A90D9", "#F5A623", "#7B68EE", "#50C878", "#E8554E", "#9B59B6"];
  return colors[index % colors.length];
}
</script>

<template>
  <div class="participants">
    <div v-if="!pool.members || pool.members.length === 0" class="empty-state">
      <p>No participants yet</p>
    </div>

    <table v-else class="holders-table">
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th></th>
          <th class="share-col">share</th>
          <th class="gift-col">gift</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member, i) in pool.members" :key="member.id">
          <td class="num">{{ i + 1 }}</td>
          <td class="avatar-cell">
            <div class="avatar" :style="{ background: getAvatarColor(i) }">
              <img
                v-if="member.photoUrl"
                :src="member.photoUrl"
                :alt="getDisplayName(member)"
              />
              <span v-else>{{ (member.firstName || member.username || '?')[0] }}</span>
            </div>
          </td>
          <td class="name">{{ getDisplayName(member) }}</td>
          <td class="share">{{ calculateShare(i) }}%</td>
          <td class="gift">
            <img :src="getGiftImage(member)" :alt="'gift'" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.participants {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 82px;

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    min-height: 200px;

    p {
      color: rgba(0, 0, 0, 0.40);
      font-size: 15px;
      font-weight: 500;
      text-align: center;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    thead {
      th {
        padding: 8px 12px;
        color: rgba(0, 0, 0, 0.50);
        text-align: left;
        font-size: 10px;
        font-weight: 500;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        &.share-col {
          text-align: center;
        }

        &.gift-col {
          text-align: right;
        }
      }
    }

    tbody {
      transform: translateY(7px);

      tr {
        td {
          padding: 8px 12px;
          color: rgba(0, 0, 0, 0.50);
          font-size: 14px;
          font-weight: 500;
          vertical-align: middle;

          &.num {
            width: 30px;
          }

          &.avatar-cell {
            width: 36px;
            padding: 8px 4px;

            .avatar {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              span {
                color: #fff;
                font-size: 12px;
                font-weight: 600;
              }
            }
          }

          &.name {
            color: #000;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 120px;
          }

          &.share {
            text-align: center;
            color: rgba(0, 0, 0, 0.50);
            font-size: 13px;
          }

          &.gift {
            text-align: right;
            width: 44px;
            padding-right: 8px;

            img {
              width: 32px;
              height: 32px;
              object-fit: cover;
              border-radius: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
