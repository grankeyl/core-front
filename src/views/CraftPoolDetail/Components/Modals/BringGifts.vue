<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Gift } from "../../../../types/gifts";
import { mockGifts } from "../../../../mocks/craft";

import TonIcon from "@/assets/icons/ton.svg";

const props = defineProps<{
  poolId: string;
  giftSlug: string;
  onSuccess?: () => void;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "dismiss"): void;
}>();

type ModalStep = "initial" | "select" | "confirm";

const step = ref<ModalStep>("initial");
const gifts = ref<Gift[]>([]);
const selected = ref<Set<string>>(new Set());
const loading = ref(true);
const submitting = ref(false);

const maxSlots = 4;

const selectedGifts = computed(() =>
  gifts.value.filter((g) => selected.value.has(g.id))
);

const selectedCount = computed(() => selected.value.size);

const yourShare = computed(() => {
  if (selectedCount.value === 0) return "0";
  const total = 4 + selectedCount.value;
  return ((selectedCount.value / total) * 100).toFixed(1);
});

const craftReward = computed(() => {
  if (selectedCount.value === 0) return 0;
  return selectedGifts.value.reduce((sum, g) => sum + (g.cost || 0), 0);
});

async function fetchGifts() {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 300));
  gifts.value = props.giftSlug
    ? mockGifts.filter((g) => g.slug === props.giftSlug)
    : mockGifts;
  loading.value = false;
}

function openSelection() {
  step.value = "select";
}

function toggleGift(id: string) {
  const s = new Set(selected.value);
  if (s.has(id)) s.delete(id);
  else if (s.size < maxSlots) s.add(id);
  selected.value = s;
}

function confirmSelection() {
  if (selected.value.size === 0) return;
  step.value = "confirm";
}

function goBackToSelect() {
  step.value = "select";
}

async function submit() {
  if (selected.value.size === 0 || submitting.value) return;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 600));
  submitting.value = false;
  props.onSuccess?.();
  emit("close");
}

onMounted(fetchGifts);
</script>

<template>
  <div class="bring-gifts-modal">
    <!-- Header -->
    <div class="modal-header">
      <h3>Bring Gifts</h3>
      <button class="close-btn" @click="emit('dismiss')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- State 1: Initial (empty) -->
    <template v-if="step === 'initial'">
      <div class="add-area" @click="openSelection">
        <div class="add-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="rgba(0,0,0,0.25)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <p>Add gifts</p>
      </div>

      <div class="stats-row">
        <div class="stat-box">
          <p class="stat-label">YOUR SHARE</p>
          <h4 class="stat-value">{{ yourShare }}%</h4>
        </div>
        <div class="stat-box">
          <p class="stat-label">CRAFT REWARD</p>
          <div class="stat-value-row">
            <h4 class="stat-value">{{ craftReward }}</h4>
            <img :src="TonIcon" alt="ton" class="ton-icon" />
          </div>
        </div>
      </div>
    </template>

    <!-- State 2: Gift selection grid -->
    <template v-else-if="step === 'select'">
      <div v-if="loading" class="loader-wrap">
        <div class="loader"></div>
      </div>
      <div v-else-if="gifts.length === 0" class="empty-msg">
        <p>No matching gifts</p>
      </div>
      <div v-else class="gift-grid">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="gift-cell"
          :class="{ selected: selected.has(gift.id) }"
          @click="toggleGift(gift.id)"
        >
          <img :src="gift.image" :alt="gift.title" />
          <div class="check-mark" :class="{ active: selected.has(gift.id) }">
            <svg v-if="selected.has(gift.id)" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="9" fill="#355DFF"/>
              <path d="M6 9.5l2 2L12 7" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="0.5" y="0.5" width="17" height="17" rx="5" stroke="rgba(0,0,0,0.15)"/>
            </svg>
          </div>
        </div>
      </div>
    </template>

    <!-- State 3: Confirm with slots -->
    <template v-else>
      <div class="gift-slots">
        <div
          v-for="i in maxSlots"
          :key="i"
          class="slot"
          :class="{ filled: i <= selectedGifts.length, empty: i > selectedGifts.length }"
          @click="i > selectedGifts.length ? goBackToSelect() : undefined"
        >
          <img v-if="i <= selectedGifts.length" :src="selectedGifts[i - 1].image" :alt="selectedGifts[i - 1].title" />
          <div v-else class="plus-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-box">
          <p class="stat-label">YOUR SHARE</p>
          <h4 class="stat-value">{{ yourShare }}%</h4>
        </div>
        <div class="stat-box">
          <p class="stat-label">CRAFT REWARD</p>
          <div class="stat-value-row">
            <h4 class="stat-value">{{ craftReward }}</h4>
            <img :src="TonIcon" alt="ton" class="ton-icon" />
          </div>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <div class="modal-footer">
      <div class="gift-count">
        <span>{{ selectedCount }} gift</span>
      </div>

      <button
        v-if="step === 'select'"
        class="action-btn"
        :class="{ disabled: selectedCount === 0 }"
        :disabled="selectedCount === 0"
        @click="confirmSelection"
      >
        <span>Select {{ selectedCount }} gift</span>
      </button>

      <button
        v-else
        class="action-btn"
        :class="{ disabled: selectedCount === 0 && step === 'initial' }"
        :disabled="submitting"
        @click="step === 'initial' ? openSelection() : submit()"
      >
        <span v-if="submitting">Sending...</span>
        <span v-else>Bring</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bring-gifts-modal {
  padding: 16px;
  padding-bottom: calc(var(--tg-safe-area-inset-bottom, 0px) + 16px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border-radius: 16px 16px 0 0;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      font-family: 'Onest', var(--font-family);
    }

    .close-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
  }

  /* ── State 1: Add gifts area ── */
  .add-area {
    width: 100%;
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 18px;
    border: 1.5px dashed rgba(0, 0, 0, 0.12);
    background: #F8F8FB;
    cursor: pointer;
    transition: all 0.15s ease;

    &:active { transform: scale(0.98); }

    .add-icon {
      width: 24px;
      height: 24px;
    }

    p {
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.35);
      font-family: 'Onest', var(--font-family);
    }
  }

  /* ── Stats row ── */
  .stats-row {
    display: flex;
    gap: 10px;

    .stat-box {
      flex: 1;
      padding: 12px 14px;
      border-radius: 14px;
      background: #F8F8FB;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .stat-label {
        font-size: 10px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.40);
        text-transform: uppercase;
        font-family: 'Onest', var(--font-family);
      }

      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #000;
        font-family: 'Onest', var(--font-family);
      }

      .stat-value-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .ton-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }
    }
  }

  /* ── State 2: Gift grid ── */
  .gift-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    max-height: 240px;
    overflow-y: auto;

    .gift-cell {
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.15s ease;

      &.selected {
        border-color: #355DFF;
      }

      &:active { transform: scale(0.95); }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .check-mark {
        position: absolute;
        bottom: 6px;
        right: 6px;
        width: 18px;
        height: 18px;
      }
    }
  }

  .loader-wrap {
    display: flex;
    justify-content: center;
    padding: 40px 0;

    .loader {
      width: 28px;
      height: 28px;
      border: 3px solid transparent;
      border-top-color: #355DFF;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
  }

  .empty-msg {
    padding: 40px;
    text-align: center;
    p { color: rgba(0, 0, 0, 0.35); font-size: 14px; }
  }

  /* ── State 3: Gift slots ── */
  .gift-slots {
    display: flex;
    gap: 8px;

    .slot {
      flex: 1;
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      &.filled {
        background: #F0EAFA;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &.empty {
        background: #F8F8FB;
        border: 1.5px dashed rgba(0, 0, 0, 0.10);
        cursor: pointer;
        transition: all 0.15s ease;

        &:active { transform: scale(0.95); }
      }

      .plus-placeholder {
        width: 24px;
        height: 24px;
      }
    }
  }

  /* ── Footer ── */
  .modal-footer {
    display: flex;
    align-items: center;
    gap: 10px;

    .gift-count {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(53, 93, 255, 0.08);
      flex-shrink: 0;

      span {
        font-size: 14px;
        font-weight: 500;
        color: #355DFF;
        white-space: nowrap;
        font-family: 'Onest', var(--font-family);
      }
    }

    .action-btn {
      flex: 1;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: #355DFF;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;

      &:active:not(.disabled) { transform: scale(0.98); }

      &.disabled {
        background: #EDEDF0;
        span { color: rgba(0, 0, 0, 0.30); }
      }

      span {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        font-family: 'Onest', var(--font-family);
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
