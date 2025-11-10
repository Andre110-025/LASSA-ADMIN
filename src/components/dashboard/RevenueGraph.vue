<script setup>
import { ref, computed } from "vue";
import FilterButton from "./buttons/request/FilterButton.vue";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  revData: Object,
});

const rawData = ref(props.revData);

const durationType = ref("daily");
const durationTypes = ["daily", "weekly", "monthly"];

function updateDurationType(n) {
  durationType.value = n;
}

// Compute Chart.js dataset based on selected timeframe
const chartData = computed(() => {
  let labels = [];
  let dataPoints = [];

  if (durationType.value === "daily") {
    labels = rawData.value.payment_breakdown_daily.map((item) => item.date);
    dataPoints = rawData.value.payment_breakdown_daily.map(
      (item) => item.total
    );
  } else if (durationType.value === "weekly") {
    labels = rawData.value.payment_breakdown_weekly.map(
      (item) => `Week ${item.week}`
    );
    dataPoints = rawData.value.payment_breakdown_weekly.map(
      (item) => item.total
    );
  } else if (durationType.value === "monthly") {
    labels = rawData.value.payment_breakdown_monthly.map((item) => item.month);
    dataPoints = rawData.value.payment_breakdown_monthly.map(
      (item) => item.total
    );
  }

  return {
    labels,
    datasets: [
      {
        label: `Revenue (${durationType.value})`,
        data: dataPoints,
        borderColor: "#020F54",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        cubicInterpolationMode: "monotone",
      },
    ],
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: "end",
    },
  },
  scales: {
    x: {
      ticks: {
        display: false,
        autoSkip: true, // Automatically skip labels
        maxTicksLimit: 6, // Show only 12 labels (one per month)
      },
      grid: {
        drawTicks: false,
      },
    },
    y: {
      beginAtZero: true,
      border: {
        display: false
      },
      ticks: {
        display: false
      },
    },
  },
};
</script>

<template>
  <div class="flex w-full flex-col p-4 bg-white rounded-lg">
    <div class="flex flex-row flex-wrap gap-5 justify-between mb-4">
      <div class="flex flex-row gap-4">
        <h5 class="my-auto text-sm">Total Revenue</h5>
      </div>

      <FilterButton
        v-if="durationTypes.length > 1"
        :options="durationTypes"
        @change-cat="updateDurationType"
      />
    </div>

    <!-- graph goes here -->
    <div class="w-full h-[400px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
