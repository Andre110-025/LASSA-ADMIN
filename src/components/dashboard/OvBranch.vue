<script setup>
import OverViewChart from './OverViewChart.vue';
import OvNewRequestList from './OvNewRequestList.vue';
import { reactive } from 'vue';
import OvBrandList from './OvBrandList.vue';
import OvQRScanner from './OvQRScanner.vue';

const ChartData = reactive({
  labels: [],
  datasets: [
    {
      backgroundColor: ["#FF5151", "#121F54"],
      data: [15,85],
      cutout: "80%",
    },
  ],
});
const NewRequests = 42;


</script>

<template>
    <h2 class=" text-xl my-5">Branch Manager - Surulere LGA</h2>
    <div class=" w-full relative gap-4 flex md:flex-row flex-col">
        <div class=" lg:w-1/2 w-full">
            <OverViewChart :-doughnut-data="ChartData" :-new-requests="NewRequests"/>
        </div>

        <div class="lg:w-1/2">
            <OvNewRequestList />
        </div>
    </div>
    <div class="flex md:flex-row flex-col my-5 gap-4">
      <OvBrandList />
      <OvQRScanner />
    </div>
</template>
