<script setup lang="ts">
import { ref } from "vue";
import type { CraftPool } from "../../../../types/craft";

defineProps<{
  pool: CraftPool;
}>();

const userVote = ref<"yes" | "no" | null>(null);

function vote(choice: "yes" | "no") {
  userVote.value = choice;
}
</script>

<template>
  <div class="voting">
    <div class="vote-card">
      <div class="vote-header">
        <h4>DAO Vote for Sale <span class="price">(2.5 TON)</span></h4>
        <p class="desc">A new vote has started to sell the gift. Join the decision and vote now!</p>
      </div>

      <div class="vote-bar">
        <div class="bar">
          <div class="no-fill" :style="{ width: '48%' }"></div>
          <div class="yes-fill" :style="{ width: '52%' }"></div>
        </div>
        <div class="percents">
          <span class="no-pct">48%</span>
          <span class="yes-pct">52%</span>
        </div>
      </div>

      <div class="vote-actions">
        <button
          class="vote-btn no"
          :class="{ active: userVote === 'no' }"
          @click="vote('no')"
        >
          No
        </button>
        <button
          class="vote-btn yes"
          :class="{ active: userVote === 'yes' }"
          @click="vote('yes')"
        >
          Yes
        </button>
      </div>

      <div class="vote-deadline">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
          <path d="M8 4v4l2.5 1.5" stroke="rgba(0,0,0,0.3)" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span>Until Jan 1, 2025, 10:00 UTC</span>
        <div class="toggle-dot">
          <div class="dot active"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.voting {
  width: 100%;

  .vote-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-radius: 18px;
    background: #F8F8FB;
    border: 1px solid rgba(0, 0, 0, 0.04);

    .vote-header {
      display: flex;
      flex-direction: column;
      gap: 6px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #000;
        font-family: 'Onest', var(--font-family);

        .price {
          color: #355DFF;
          font-weight: 600;
        }
      }

      .desc {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.50);
        line-height: 1.4;
        font-family: 'Onest', var(--font-family);
      }
    }

    .vote-bar {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .bar {
        width: 100%;
        height: 12px;
        display: flex;
        border-radius: 6px;
        overflow: hidden;
        gap: 2px;

        .no-fill {
          height: 100%;
          background: #FF2C44;
          border-radius: 6px 0 0 6px;

          background-image: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.25) 3px,
            rgba(255, 255, 255, 0.25) 5px
          );
        }

        .yes-fill {
          height: 100%;
          background: #30C15E;
          border-radius: 0 6px 6px 0;

          background-image: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.25) 3px,
            rgba(255, 255, 255, 0.25) 5px
          );
        }
      }

      .percents {
        display: flex;
        justify-content: space-between;

        span {
          font-size: 12px;
          font-weight: 600;
          font-family: 'Onest', var(--font-family);
        }

        .no-pct { color: #FF2C44; }
        .yes-pct { color: #30C15E; }
      }
    }

    .vote-actions {
      display: flex;
      gap: 10px;

      .vote-btn {
        flex: 1;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        font-family: 'Onest', var(--font-family);
        transition: all 0.15s ease;

        &:active { transform: scale(0.97); }

        &.no {
          background: rgba(255, 44, 68, 0.08);
          color: #FF2C44;

          &.active {
            background: #FF2C44;
            color: #fff;
          }
        }

        &.yes {
          background: rgba(48, 193, 94, 0.08);
          color: #30C15E;

          &.active {
            background: #30C15E;
            color: #fff;
          }
        }
      }
    }

    .vote-deadline {
      display: flex;
      align-items: center;
      gap: 6px;

      svg {
        flex-shrink: 0;
      }

      span {
        flex: 1;
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.50);
        font-family: 'Onest', var(--font-family);
      }

      .toggle-dot {
        display: flex;
        gap: 4px;
        flex-shrink: 0;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.10);

          &.active {
            background: #355DFF;
          }
        }
      }
    }
  }
}
</style>
