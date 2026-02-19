<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
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
    // растягиваем область графика на всю ширину канвы
    ca.left = 0;
    ca.right = chart.width;

    // синхронизируем шкалу X с новой областью
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
  fullWidthPlugin, // <— вот тут
);

const skeleton = ref<boolean>(false);

const datePickerActive = ref<string>("all");
const datePickers = ref<any>([
  { id: "1d", label: "1D" },
  { id: "7d", label: "7D" },
  { id: "1m", label: "1M" },
  { id: "all", label: "ALL" }
]);

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const labels = ["2024", "", "", "2025", "", "", "2026"];
const data = [11.4, 12.5, 12.2, 13, 12, 12, 13];

function setDatePickerActive(id: string) {
  datePickerActive.value = id;
};

onMounted(() => {
  if (!chartRef.value) return;
  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, chartRef.value.height);
  gradient.addColorStop(0, "rgba(56, 209, 104, 0.25)");
  gradient.addColorStop(0.5, "rgba(56, 209, 104, 0.12)");
  gradient.addColorStop(1, "rgba(56, 209, 104, 0)");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: "#38D168",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient,
          pointRadius: 0,
          pointHitRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      layout: {
        padding: { left: 0, right: 0, top: 44, bottom: 0 },
      },
      scales: {
        x: {
          type: "category",
          // чуть выталкиваем первую и последнюю точку за границы,
          // чтобы визуально линия упиралась в края
          min: -0.3,
          max: data.length - 1 + 0.3,

          offset: false,
          bounds: "ticks",
          grid: {
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          border: { display: false },
          ticks: {
            display: false,     // <— скрываем текст на оси, он нам больше не нужен
            padding: 0,
          },
        },
        y: {
          display: false,
        },
      },
    }
  });
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
    chart = null;
  }
});
</script>

<template>
  <div class="price" :class="{ skeleton }">
    <div class="head">
      <div class="amount">
        <div class="title">
          <h4>$78,198.91</h4>
        </div>
        <div class="descr">
          <span>+$7,561,90</span>
          <div class="mark">
            <p>+164%</p>
          </div>
        </div>
      </div>
      <div class="selector">
        <div 
          v-for="(item, index) in datePickers" 
          @click="setDatePickerActive(item.id)"
          class="item" 
          :key="index"
          :class="{ active: datePickerActive === item.id }"
        >
          <h4>{{ item.label }}</h4>
        </div>
      </div>
    </div>
    <div class="graph">
      <canvas ref="chartRef"></canvas>

      <div class="years">
        <span>2024</span>
        <span>2025</span>
        <span>2026</span>
      </div>
    </div>
    <div class="bundles">
      <div class="item">
        <div class="context">
          <p>Highest Price</p>
          <h4>$125,522.08</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>lowest Price</p>
          <h4>980$</h4>
        </div>
      </div>
      <div class="item">
        <div class="context">
          <p>trading volume</p>
          <h4>3 (30D)</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Price.scss"></style>