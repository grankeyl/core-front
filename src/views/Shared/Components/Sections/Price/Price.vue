<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import type { FundDetail } from "../../../../../types/funds";
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

const fullWidthPlugin = {
  id: "fullWidth",
  afterLayout(chart: any) {
    const ca = chart.chartArea;
    if (!ca) return;
    ca.left = 0;
    ca.right = chart.width;
    if (chart.scales.x) {
      chart.scales.x.left = ca.left;
      chart.scales.x.right = ca.right;
    }
  },
};

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  fullWidthPlugin,
);

const props = defineProps<{
  fund: FundDetail;
}>();

const datePickerActive = ref<string>("7d");
const datePickers = [
  { id: "1d", label: "1D" },
  { id: "7d", label: "7D" },
];

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const stats = computed(() => props.fund.gift.costStatistics);

const activeData = computed(() => {
  if (!stats.value) return [];
  const key = datePickerActive.value as "1d" | "7d";
  return stats.value[key] ?? [];
});

const currentPrice = computed(() => {
  const d = activeData.value;
  return d.length > 0 ? d[d.length - 1] : 0;
});

const priceChange = computed(() => {
  const d = activeData.value;
  if (d.length < 2) return 0;
  return d[d.length - 1] - d[0];
});

const priceChangePercent = computed(() => {
  const d = activeData.value;
  if (d.length < 2 || d[0] === 0) return 0;
  return ((d[d.length - 1] - d[0]) / d[0]) * 100;
});

const isPositive = computed(() => priceChange.value >= 0);

const highestPrice = computed(() => {
  if (activeData.value.length === 0) return 0;
  return Math.max(...activeData.value);
});

const lowestPrice = computed(() => {
  if (activeData.value.length === 0) return 0;
  return Math.min(...activeData.value);
});

function formatPrice(v: number): string {
  if (v >= 1000) return `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(4)}`;
}

function generateLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => String(i));
}

function buildChart() {
  if (!chartRef.value) return;
  if (chart) { chart.destroy(); chart = null; }

  const data = activeData.value;
  if (data.length === 0) return;

  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  const positive = isPositive.value;
  const lineColor = positive ? "#38D168" : "#FF3B30";

  const gradient = ctx.createLinearGradient(0, 0, 0, chartRef.value.height);
  if (positive) {
    gradient.addColorStop(0, "rgba(56, 209, 104, 0.25)");
    gradient.addColorStop(0.5, "rgba(56, 209, 104, 0.12)");
    gradient.addColorStop(1, "rgba(56, 209, 104, 0)");
  } else {
    gradient.addColorStop(0, "rgba(255, 59, 48, 0.25)");
    gradient.addColorStop(0.5, "rgba(255, 59, 48, 0.12)");
    gradient.addColorStop(1, "rgba(255, 59, 48, 0)");
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: generateLabels(data.length),
      datasets: [{
        data: [...data],
        borderColor: lineColor,
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        backgroundColor: gradient,
        pointRadius: 0,
        pointHitRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400, easing: "easeOutCubic" },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      layout: {
        padding: { left: 0, right: 0, top: 12, bottom: 0 },
      },
      scales: {
        x: {
          type: "category",
          min: -0.3,
          max: data.length - 1 + 0.3,
          offset: false,
          bounds: "ticks",
          grid: { display: false, drawOnChartArea: false, drawTicks: false },
          border: { display: false },
          ticks: { display: false, padding: 0 },
        },
        y: { display: false },
      },
    },
  });
}

function setDatePickerActive(id: string) {
  datePickerActive.value = id;
}

watch(activeData, async () => {
  await nextTick();
  buildChart();
});

onMounted(() => buildChart());
onBeforeUnmount(() => { chart?.destroy(); chart = null; });
</script>

<template>
  <div class="price">
    <div class="head">
      <div class="amount">
        <div class="title">
          <h4>{{ formatPrice(currentPrice) }}</h4>
        </div>
        <div class="descr" v-if="activeData.length >= 2">
          <span :class="{ negative: !isPositive }">
            {{ isPositive ? '+' : '' }}{{ formatPrice(Math.abs(priceChange)) }}
          </span>
          <div class="mark" :class="{ negative: !isPositive }">
            <p>{{ isPositive ? '+' : '' }}{{ priceChangePercent.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
      <div class="selector">
        <div
          v-for="item in datePickers"
          @click="setDatePickerActive(item.id)"
          class="item"
          :key="item.id"
          :class="{ active: datePickerActive === item.id }"
        >
          <h4>{{ item.label }}</h4>
        </div>
      </div>
    </div>

    <div class="graph">
      <canvas ref="chartRef"></canvas>
      <div v-if="activeData.length === 0" class="empty-chart">
        <p>No data</p>
      </div>
    </div>

    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>Highest Price</p>
          <h4>{{ formatPrice(highestPrice) }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Lowest Price</p>
          <h4>{{ formatPrice(lowestPrice) }}</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>Data Points</p>
          <h4>{{ activeData.length }} ({{ datePickerActive.toUpperCase() }})</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Price.scss"></style>
