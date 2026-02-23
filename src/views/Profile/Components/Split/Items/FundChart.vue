<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
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
import type { Fund } from "../../../../../types/funds";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

const props = defineProps<{
  fund: Fund;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function getChartData(): number[] {
  const stats = props.fund.gift?.costStatistics?.["7d"];
  if (stats && stats.length > 0) return stats;
  const price = props.fund.fractionPrice ?? props.fund.gift?.cost ?? 0;
  return [price];
}

function initChart() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  chart?.destroy();
  const values = getChartData();

  const w = canvas.clientWidth || 140;
  const h = canvas.clientHeight || 46;

  const mkStroke = () => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0.0, "rgba(56,209,104,0)");
    g.addColorStop(0.35, "rgba(56,209,104,0)");
    g.addColorStop(0.55, "rgba(56,209,104,0.4)");
    g.addColorStop(1.0, "rgba(56,209,104,1)");
    return g;
  };

  const mkFill = () => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0.0, "rgba(56,209,104,0.22)");
    g.addColorStop(0.5, "rgba(56,209,104,0.10)");
    g.addColorStop(1.0, "rgba(56,209,104,0)");
    return g;
  };

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: values.map((_, i) => i),
      datasets: [{
        data: values,
        borderColor: mkStroke(),
        backgroundColor: mkFill(),
        fill: true,
        tension: 0.42,
        pointRadius: 0,
        borderWidth: 1.4,
        spanGaps: true,
      }],
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
      elements: { line: { borderCapStyle: "round", borderJoinStyle: "round" } },
    },
  });
}

onMounted(() => {
  initChart();
});

watch(() => props.fund, () => {
  initChart();
}, { deep: true });

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="graph">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.graph {
  width: 140px;
  height: 46px;
  flex-shrink: 0;
  margin-left: auto;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 38%),
                      linear-gradient(to top, transparent 0%, black 28%);
  -webkit-mask-composite: destination-in;
  mask-image: linear-gradient(to right, transparent 0%, black 38%),
              linear-gradient(to top, transparent 0%, black 28%);
  mask-composite: intersect;
}

.graph canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
