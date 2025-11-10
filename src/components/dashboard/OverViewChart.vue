<script setup>
import { reactive } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Legend, ArcElement } from "chart.js";

ChartJS.register(Legend, ArcElement);

ChartJS.defaults.font.size = 10;

const props = defineProps({
  DoughnutData: Object,
  NewRequests:Number,
});

const doughnutOptions = reactive({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      align: "center",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 30,
      },
    },
  },
});
</script>

<template>
  <div class="flex flex-col justify-center pb-4 bg-white rounded-lg gap-4 w-full">

    <h6 class="flex flexrow justify-between border-b-2 px-6 border-b-gray-300 py-4">
      Request Metrics
    </h6>

    <div class="flex flex-col relative max-w-xs w-1/2 mx-auto">
      <Doughnut
        id="my-chart-id"
        class="h-full w-full"
        :options="doughnutOptions"
        :data="props.DoughnutData"
      />
  
      <div class="flex flex-col absolute top-1/2 w-full translate-y-[-55%]">
        <h4 class="text-4xl w-full text-center">{{ NewRequests }}</h4>
        <p class="text-base w-full text-center">New Requests</p>
      </div>
  
    </div>
    <div class="flex md:flex-row flex-col gap-4 justify-center">
      <p class=" text-sm md:text-left text-center"> <span class=" inline-block w-2 h-2 bg-[#FF5151] rounded-full"></span> Approved Requests {{ DoughnutData.datasets[0].data[0] }}%</p>
      <p class=" text-sm md:text-left text-center"> <span class=" inline-block w-2 h-2 bg-[#121F54] rounded-full"></span> Declined Requests {{ DoughnutData.datasets[0].data[1] }}%</p>
    </div>
  </div>
</template>
