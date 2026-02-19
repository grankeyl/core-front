<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  modelValue: number;
  max: number;
  min?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const min = computed(() => props.min ?? 1);

const trackRef = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);

// "официальный" процент по модели (по количеству шеров)
const modelPercent = computed(() => {
  const range = props.max - min.value;
  if (range <= 0) return 0;
  const v = Math.min(props.max, Math.max(min.value, props.modelValue || min.value));
  return ((v - min.value) / range) * 100;
});

// живой процент по пальцу во время драга (0–100)
const dragPercent = ref<number | null>(null);

// проценты для UI: если тащим — берём живой, иначе — из модели
const uiPercent = computed(() => dragPercent.value ?? modelPercent.value);

// позиция bubble с запасом по краям
const bubblePercent = computed(() => {
  const p = uiPercent.value;
  const margin = 10; // %
  if (p < margin) return margin;
  if (p > 100 - margin) return 100 - margin;
  return p;
});

function clampValue(v: number) {
  return Math.min(props.max, Math.max(min.value, v));
}

function setFromClientX(clientX: number) {
  const track = trackRef.value;
  if (!track) return;

  const rect = track.getBoundingClientRect();
  const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
  const ratio = rect.width === 0 ? 0 : x / rect.width;

  // непрерывный процент для плавного движения
  dragPercent.value = ratio * 100;

  // но значение шеров округляем
  const rawShares = min.value + ratio * (props.max - min.value);
  const next = clampValue(Math.round(rawShares));

  emit("update:modelValue", next);
}

function onPointerDown(e: MouseEvent | TouchEvent) {
  isDragging.value = true;

  if (e instanceof MouseEvent) {
    setFromClientX(e.clientX);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  } else {
    setFromClientX(e.touches[0].clientX);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchcancel", onPointerUp);
  }
}

function onPointerMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;

  if (e instanceof MouseEvent) {
    setFromClientX(e.clientX);
  } else {
    setFromClientX(e.touches[0].clientX);
    e.preventDefault();
  }
}

function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;

  // после отпускания возвращаемся к "ровному" modelPercent
  dragPercent.value = null;

  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  window.removeEventListener("touchmove", onPointerMove);
  window.removeEventListener("touchend", onPointerUp);
  window.removeEventListener("touchcancel", onPointerUp);
}

onBeforeUnmount(onPointerUp);

onMounted(() => {
  if (!props.modelValue) emit("update:modelValue", min.value);
});
</script>

<template>
  <div class="shares-slider" :class="{ 'is-dragging': isDragging }">
    <div class="bubble-wrapper">
      <div class="bubble" :style="{ left: bubblePercent + '%' }">
        <span>{{ modelValue }} Shares</span>
        <div class="bubble-tip" />
      </div>
    </div>

    <div
      class="track"
      ref="trackRef"
      @mousedown="onPointerDown"
      @touchstart.prevent="onPointerDown"
    >
      <div class="track-bg" />
      <div class="track-fill" :style="{ width: uiPercent + '%' }" />
      <button
        class="thumb"
        type="button"
        :style="{ left: uiPercent + '%' }"
        aria-label="Shares slider"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shares-slider {
  width: 100%;
  padding: 16px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: none;

  .bubble-wrapper {
    position: relative;
    width: 100%;
    height: 34px;
    pointer-events: none;
  }

  .bubble {
    position: absolute;
    top: 0;
    transform: translate(-50%, 0);
    padding: 6px 18px;
    border-radius: 999px;
    background: linear-gradient(180deg, #4b74ff 0%, #7f98ff 100%);
    box-shadow:
      0 10px 26px rgba(46, 79, 255, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.3);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    transition:
      left 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
    margin-top: -4px;

    span {
        color: #FFF;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
    }
  }

  .bubble-tip {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 10px;
    background: #7f98ff;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    filter: drop-shadow(0 3px 6px rgba(46, 79, 255, 0.35));
  }

.track {
  height: 30px;                // трек чуть выше круга
  border-radius: 999px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;            // всё лишнее отрезаем
}

.track-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, #f1f2f5 0%, #e3e4e8 100%);
}

.track-fill {
  position: absolute;
  inset: 0;
  width: 0;
  background: linear-gradient(90deg, #355DFF 0%, #7F98FF 100%);
  border-radius: inherit;
  transition: width 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1;
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;                 // МЕНЬШЕ высоты трека
  height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;      // внешний диаметр = 26px
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  transition:
    left 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.14s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: grab;
  z-index: 2;
}

  &.is-dragging {
    .thumb {
      transform: translate(-50%, -50%) scale(1.04);
      box-shadow:
        0 10px 26px rgba(12, 20, 51, 0.55),
        0 0 0 4px rgba(76, 106, 255, 0.3);
      cursor: grabbing;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .shares-slider * {
    transition: none !important;
  }
}
</style>