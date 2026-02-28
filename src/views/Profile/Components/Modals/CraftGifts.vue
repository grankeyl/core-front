<script setup lang="ts">
import { computed, ref } from "vue";
import type { Gift } from "@/types/gifts";
import { craftApi } from "@/api/craft";

// Icons
import CloseIcon from "@/assets/icons/close.svg?raw";
import EditRawIcon from "@/assets/icons/edit.svg?raw";
import InfoRawIcon from "@/assets/icons/info.svg?raw";

const props = defineProps<{
  items: Gift[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "resolve", payload: { crafted: boolean }): void;
}>();

const loading = ref(false);
const error = ref("");
const success = ref(false);

const totalGifts = computed(() => props.items.length);
const totalValue = computed(() => props.items.reduce((s, g) => s + (g.cost || 0), 0));

function close() {
  emit("close");
}

async function craft() {
  if (!props.items.length || loading.value) return;
  loading.value = true;
  error.value = "";
  try {
    await craftApi.createCraft(props.items.map((g) => g.id));
    success.value = true;
    emit("resolve", { crafted: true });
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? "Failed to create craft pool";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="sheet">
    <div class="head">
      <div class="info">
        <div class="kit-icon" v-html="InfoRawIcon"></div>
      </div>
      <div class="title">
        <h4>Confirm Craft</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>

    <div class="items">
      <div v-for="item in items" :key="item.id" class="item">
        <div class="image">
          <img :src="item.image || 'https://nft.fragment.com/gift/lovepotion-25434.large.jpg'" alt="">
        </div>
      </div>
    </div>

    <div class="info">
      <div class="item">
        <div class="left"><h4>Total gifts</h4></div>
        <div class="right"><h4>{{ totalGifts }}</h4></div>
      </div>
      <div class="item">
        <div class="left"><h4>Total Gift Value</h4></div>
        <div class="right">
          <h4>{{ totalValue.toLocaleString() }}</h4>
        </div>
      </div>
    </div>

    <div class="banner">
      <div class="mark">
        <div class="kit-icon" v-html="InfoRawIcon"></div>
      </div>
      <div class="text">
        <h4>Your gifts will be added to a craft pool. You'll receive rewards when the pool completes.</h4>
      </div>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div class="footer">
      <div class="craft" :class="{ disabled: loading }" @click="craft">
        <div class="context">
          <div class="kit-icon" v-html="EditRawIcon"></div>
          <h4>{{ loading ? "..." : "Create Pool" }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./BurnGifts.scss" scoped></style>
<style scoped>
.footer .craft {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  background: #355DFF;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.12s ease-in-out;
}
.footer .craft:active { transform: scale(0.96); }
.footer .craft.disabled { opacity: 0.7; pointer-events: none; }
.footer .craft .context { display: flex; align-items: center; gap: 4px; }
.footer .craft .context h4 { color: #fff; font-size: 14px; font-weight: 600; }
.footer .craft .kit-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
.footer .craft :deep(svg) { width: 100%; height: 100%; }
.footer .craft :deep(svg path) { fill: #fff; }
</style>
