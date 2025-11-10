<script setup>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Legend,
  ArcElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(Legend, ArcElement, Title, Tooltip);

const props = defineProps({
  DoughnutData: Object,
  statsHeading: String,
  appTotal: Number,
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <div class="lg:basis-[50%] basis-full grow w-full pb-4 bg-white rounded-lg">
    <div
      class="flex flex-row justify-between border-b-2 px-6 border-b-gray-300 py-4"
    >
      <h6 class="">
        {{ props.statsHeading }}
      </h6>

      <div class="flex flex-row gap-4">
        <h6 class="text-xs text-gray-500">
          Total - <strong>{{ props.appTotal }}</strong>
        </h6>
      </div>
    </div>

    <div class="max-w-xs mx-auto p-5">
      <Doughnut
        id="my-chart-id"
        class="h-full w-full"
        :options="chartOptions"
        :data="props.DoughnutData"
      />
    </div>
  </div>
</template>
