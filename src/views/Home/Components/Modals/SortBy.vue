<script setup lang="ts">
import { ref, watch } from "vue";
import CloseIcon from "@/assets/icons/close.svg?raw";
import DoneIcon from "@/assets/icons/done.svg";

const emit = defineEmits<{
  (e: "close"): void
  (e: "reset"): void
  (e: "apply", id: string): void
}>()

const props = defineProps<{
  Active: string
  Items: any[]
}>()

const localItems = ref<any[]>([])
const localActive = ref<string>(props.Active) as any;

watch(
  () => [props.Items, props.Active],
  ([items, active]) => {
    // @ts-ignore
    localItems.value = items.map((i: any) => ({ ...i }))
    localActive.value = active
  },
  { immediate: true, deep: true }
)

function selectItem(id: string) {
  localActive.value = id // <-- КЛЮЧЕВОЕ
}

function apply() {
  emit("apply", localActive.value)
  emit("close")
}

function reset() {
  emit("reset")
  emit("close")
}

function close() {
  emit("close")
}
</script>

<template>
  <div class="sheet">
    <div class="head">
      <div class="title">
        <h4>Sort by</h4>
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
            <div class="checkbox" :class="{ active: localActive === item.id }">
            <div class="circle"></div>
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

<style lang="scss" src="./SortBy.scss" scoped></style>