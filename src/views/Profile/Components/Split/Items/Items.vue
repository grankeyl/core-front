<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";

// Icons
import ChevroneBottomIcon from "@/assets/icons/chevrone-bottom.svg"
import ChevroneRightRawIcon from "@/assets/icons/chevrone-right-def.svg?raw"

const emit = defineEmits<{
  (e: "openGift", data: any): void;
}>();

const skeleton = ref<boolean>(false);

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

const graphCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const values = [
  10, 10.4, 10.2, 10.6, 10.5,
  10, 10.4, 10.2, 10.65, 10.7,
  10, 10.4, 10.2, 10.6,
  14.8, 15.0,
];

onMounted(() => {
  const canvas = graphCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const mkStroke = () => {
    const g = ctx.createLinearGradient(0, 0, canvas.clientWidth || 150, 0);
    g.addColorStop(0.0, "rgba(56,209,104,0)");    // полностью прозрачно слева
    g.addColorStop(0.45, "rgba(56,209,104,0)");   // держим пустоту
    g.addColorStop(0.65, "rgba(56,209,104,0.35)");
    g.addColorStop(1.0, "rgba(56,209,104,1)");
    return g;
  };

  const mkFill = () => {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 56);
    g.addColorStop(0, "rgba(56,209,104,0.14)");
    g.addColorStop(1, "rgba(56,209,104,0)");
    return g;
  };

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: values.map((_, i) => i),
      datasets: [
        {
          data: values,
          borderColor: mkStroke(),
          backgroundColor: mkFill(),
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 1.4,                 // на рефе тонкая, но читаемая
          spanGaps: true,                 // чтобы null просто пропускались
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      layout: { padding: 0 },
      scales: {
        x: { display: false, grid: { display: false }, offset: false },
        y: { display: false, grid: { display: false } },
      },
      elements: {
        line: { borderCapStyle: "round", borderJoinStyle: "round" },
      },
    },
  });
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});

function handleOpenGift(data: any) {
  emit("openGift", data);
}
</script>

<template>
  <div class="content" :class="{ skeleton: skeleton }">
    <div class="filters">
      <div class="item">
        <div class="context">
          <p>TYPE</p>
          <h4>All</h4>
        </div>
        <div class="icon">
          <img :src="ChevroneBottomIcon" alt="chevrone-bottom" />
        </div>
      </div>
    </div>

    <div class="lists">
      <div class="flexed">
        <div class="item" @click="handleOpenGift({})">
          <div class="inner">
            <div class="head">
              <div class="image">
                <img :src="'https://nft.fragment.com/gift/plushpepe-289.medium.jpg'" alt="">
              </div>
              <div class="context">
                <h4>PlushPepe</h4>
                <p>#1515</p>
              </div>
              <div class="graph">
                <canvas ref="graphCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="markdown">
          <div class="kit-icon" v-html="ChevroneRightRawIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Items.scss" scoped></style>