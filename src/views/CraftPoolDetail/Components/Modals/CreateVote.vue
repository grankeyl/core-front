<script setup lang="ts">
import { ref } from "vue";
import type { CraftPool } from "../../../../types/craft";
import TonIcon from "@/assets/icons/ton.svg";

defineProps<{
  poolId: string;
  pool: CraftPool | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "dismiss"): void;
}>();

type VoteType = "sell" | "rent" | "other";
type Step = "type" | "price" | "description" | "loading" | "success";

const step = ref<Step>("type");
const voteType = ref<VoteType>("sell");
const price = ref("10.5");
const description = ref("");

function selectType(t: VoteType) {
  voteType.value = t;
}

function goNext() {
  if (step.value === "type") {
    if (voteType.value === "sell") {
      step.value = "price";
    } else if (voteType.value === "other") {
      step.value = "description";
    } else {
      step.value = "description";
    }
  }
}

function setPreset(val: number) {
  price.value = String(val);
}

async function create() {
  step.value = "loading";
  await new Promise((r) => setTimeout(r, 2000));
  step.value = "success";
}

function viewResult() {
  emit("close");
}
</script>

<template>
  <div class="create-vote-modal">
    <!-- Loading state -->
    <template v-if="step === 'loading'">
      <div class="loading-state">
        <div class="spinner">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(53,93,255,0.15)" stroke-width="4"/>
            <path d="M44 24c0-11.046-8.954-20-20-20" stroke="#355DFF" stroke-width="4" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.8s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
        <h3>Creating in progress</h3>
        <p>Please wait while we process..</p>
        <button class="close-x" @click="emit('dismiss')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="rgba(0,0,0,0.3)" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </template>

    <!-- Success state -->
    <template v-else-if="step === 'success'">
      <div class="success-state">
        <button class="close-x" @click="emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="rgba(0,0,0,0.3)" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="check-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="rgba(56,209,104,0.12)"/>
            <path d="M18 28.5l7 7L38 21" stroke="#30C15E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>Successful</h3>
        <p>The poll has been successfully created!</p>
        <button class="view-btn" @click="viewResult">
          <span>View</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="#355DFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </template>

    <!-- Form states -->
    <template v-else>
      <div class="modal-header">
        <h3>Create a Vote</h3>
        <button class="close-btn" @click="emit('dismiss')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Step 1: Vote type selection -->
      <template v-if="step === 'type'">
        <div class="options">
          <div
            class="option"
            :class="{ active: voteType === 'sell' }"
            @click="selectType('sell')"
          >
            <span>Sell an asset</span>
            <div class="radio" :class="{ checked: voteType === 'sell' }">
              <svg v-if="voteType === 'sell'" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#355DFF"/>
                <path d="M7 10.5l2 2L13 8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9.5" stroke="rgba(0,0,0,0.15)"/>
              </svg>
            </div>
          </div>
          <div
            class="option"
            :class="{ active: voteType === 'rent' }"
            @click="selectType('rent')"
          >
            <span>Rent out</span>
            <div class="radio" :class="{ checked: voteType === 'rent' }">
              <svg v-if="voteType === 'rent'" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#355DFF"/>
                <path d="M7 10.5l2 2L13 8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9.5" stroke="rgba(0,0,0,0.15)"/>
              </svg>
            </div>
          </div>
          <div
            class="option"
            :class="{ active: voteType === 'other' }"
            @click="selectType('other')"
          >
            <span>Other</span>
            <div class="radio" :class="{ checked: voteType === 'other' }">
              <svg v-if="voteType === 'other'" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#355DFF"/>
                <path d="M7 10.5l2 2L13 8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9.5" stroke="rgba(0,0,0,0.15)"/>
              </svg>
            </div>
          </div>
        </div>
      </template>

      <!-- Step 2: Price input -->
      <template v-else-if="step === 'price'">
        <div class="price-input">
          <div class="price-display">
            <input
              v-model="price"
              type="text"
              inputmode="decimal"
              class="price-field"
            />
            <img :src="TonIcon" alt="ton" class="ton-icon" />
          </div>
          <div class="presets">
            <button v-for="val in [1, 5, 10, 15]" :key="val" class="preset" :class="{ active: price === String(val) }" @click="setPreset(val)">
              {{ val }}
            </button>
          </div>
        </div>
      </template>

      <!-- Step 3: Description input -->
      <template v-else-if="step === 'description'">
        <div class="desc-input">
          <textarea
            v-model="description"
            placeholder="Type description.."
            rows="3"
          ></textarea>
        </div>
      </template>

      <!-- Footer buttons -->
      <div class="modal-footer">
        <button class="btn-secondary" @click="emit('dismiss')">
          <span>Close</span>
        </button>
        <button
          v-if="step === 'type'"
          class="btn-primary"
          @click="goNext"
        >
          <span>Next</span>
        </button>
        <button
          v-else
          class="btn-primary"
          @click="create"
        >
          <span>Create</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.create-vote-modal {
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

  /* ── Step 1: Options ── */
  .options {
    display: flex;
    flex-direction: column;
    gap: 0;

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: background 0.1s ease;

      &:last-child { border-bottom: none; }

      span {
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.40);
        font-family: 'Onest', var(--font-family);
      }

      &.active span {
        color: #000;
      }

      .radio {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }
  }

  /* ── Step 2: Price ── */
  .price-input {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    padding: 16px 0;

    .price-display {
      display: flex;
      align-items: center;
      gap: 6px;

      .price-field {
        font-size: 32px;
        font-weight: 700;
        color: #000;
        border: none;
        outline: none;
        background: transparent;
        text-align: center;
        width: 120px;
        font-family: 'Onest', var(--font-family);
      }

      .ton-icon {
        width: 28px;
        height: 28px;
        object-fit: contain;
      }
    }

    .presets {
      display: flex;
      gap: 8px;

      .preset {
        width: 40px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.10);
        background: #fff;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.50);
        font-family: 'Onest', var(--font-family);
        transition: all 0.15s ease;

        &:active { transform: scale(0.95); }

        &.active {
          border-color: #355DFF;
          color: #355DFF;
          background: rgba(53, 93, 255, 0.05);
        }
      }
    }
  }

  /* ── Step 3: Description ── */
  .desc-input {
    textarea {
      width: 100%;
      min-height: 80px;
      padding: 14px;
      border-radius: 14px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: #F8F8FB;
      resize: none;
      font-size: 14px;
      font-weight: 400;
      color: #000;
      font-family: 'Onest', var(--font-family);
      outline: none;

      &::placeholder {
        color: rgba(0, 0, 0, 0.30);
      }

      &:focus {
        border-color: #355DFF;
      }
    }
  }

  /* ── Footer ── */
  .modal-footer {
    display: flex;
    gap: 10px;

    .btn-secondary {
      flex-shrink: 0;
      height: 48px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: #F4F4F7;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;

      &:active { transform: scale(0.97); }

      span {
        font-size: 14px;
        font-weight: 600;
        color: #000;
        font-family: 'Onest', var(--font-family);
      }
    }

    .btn-primary {
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

      &:active { transform: scale(0.97); }

      span {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        font-family: 'Onest', var(--font-family);
      }
    }
  }

  /* ── Loading state ── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 24px;
    position: relative;

    .spinner {
      width: 48px;
      height: 48px;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      font-family: 'Onest', var(--font-family);
    }

    p {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.40);
      font-family: 'Onest', var(--font-family);
    }

    .close-x {
      position: absolute;
      top: 0;
      right: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  /* ── Success state ── */
  .success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 24px;
    position: relative;

    .close-x {
      position: absolute;
      top: 0;
      right: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
    }

    .check-icon {
      width: 56px;
      height: 56px;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      font-family: 'Onest', var(--font-family);
    }

    p {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.40);
      text-align: center;
      font-family: 'Onest', var(--font-family);
    }

    .view-btn {
      display: flex;
      align-items: center;
      gap: 2px;
      background: none;
      border: none;
      cursor: pointer;
      margin-top: 4px;

      span {
        font-size: 14px;
        font-weight: 500;
        color: #355DFF;
        font-family: 'Onest', var(--font-family);
      }
    }
  }
}
</style>
