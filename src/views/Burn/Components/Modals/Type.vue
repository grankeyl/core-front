<script setup lang="ts">
import { ref, watch } from "vue";
import CloseIcon from "@/assets/icons/close.svg?raw";
import DoneIcon from "@/assets/icons/done.svg";

const emit = defineEmits<{
  (e: "close"): void,
  (e: "reset"): void,
  (e: "apply", data: any[]): void,
}>();

const props = defineProps<{
  Items: any[];
}>();

const localItems = ref<any[]>([]);

watch(
  () => props.Items,
  (val) => {
    localItems.value = val.map((i) => ({ ...i }));
  },
  { immediate: true, deep: true }
);

function close() {
  emit("close");
}

function selectItem(id: string) {
  localItems.value = localItems.value.map((i) =>
    i.id === id ? { ...i, active: !i.active } : i
  );
}

function reset() {
  emit("reset");
  close();
}

function apply() {
  emit("apply", localItems.value);
  close();
}
</script>

<template>
  <div class="sheet">
    <div class="head">
      <div class="title">
        <h4>Type</h4>
      </div>
      <div class="close" @click="close">
        <div class="kit-icon" v-html="CloseIcon"></div>
      </div>
    </div>

    <div class="selects">
      <div
        v-for="item in localItems"
        :key="item.id"
        class="item"
        @click="selectItem(item.id)"
      >
        <div class="left">
          <h4>{{ item.title }}</h4>
        </div>
        <div class="right">
          <div class="checkbox" :class="{ active: item.active }">
            <img :src="DoneIcon" alt="done-icon" />
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="reset" @click="reset">
        <h4>Reset</h4>
      </div>
      <div class="button">
        <button @click="apply">
          <h4>Apply</h4>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Type.scss" scoped></style>