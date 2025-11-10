<script setup>
import { ref } from "vue";

const signs = ref([74, 39, 27, 21, 10]);
</script>

<template>
  <div
    class="flex flex-col bg-white rounded-lg h-full justify-between pb-8 md:w-[65%] w-full gap-4"
  >
    <div class="flex flex-col">
      <div
        class="flex flexrow justify-between border-b-2 border-b-gray-300 py-4 px-6"
      >
        <h6>Brands</h6>
        <a href="#">View All</a>
      </div>
    </div>

    <div v-for="i in 5" class="px-6">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-4">
          <p class="my-auto text-sm">XYZ Media ltd</p>
        </div>
        <p class="my-auto text-sm">{{ signs[i-1] }} Signs</p>
      </div>
    </div>
  </div>
</template>
