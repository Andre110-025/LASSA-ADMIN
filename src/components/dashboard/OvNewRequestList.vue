<script setup>

import { ref } from "vue"

const imgContainer = ref([
  '../../../public/tempImg/715c781f38b560d5c0076eda1a27a9fe.jpg',
  '../../../public/tempImg/b73ae4fd72dafebe18d76c427055dd09.png',
  '../../../public/tempImg/bfe777199bc507703f55aa5c682fcd10.png',
  '../../../public/tempImg/dce85928efa6721f7c33c2533426c5f6.png',
])

</script>

<template>
  <div class="flex flex-col gap-2 bg-white rounded-lg h-full justify-between pb-8 min-w-[300px]">
    <div class="flex flex-col">
      <div
        class="flex flexrow justify-between border-b-2 border-b-gray-300 py-4 px-6"
      >
        <h6 class="text-sm">New Requests</h6>
        <a class="text-sm" href="#"> View All </a>
      </div>
    </div>

    <div v-for="i in 5" class="px-6">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-4">
          <img :src="imgContainer[i%imgContainer.length]" class="w-8 h-8 rounded-full bg-gray-400" />
          <p class="my-auto text-sm">XYZ Media ltd</p>
        </div>
        <p class="my-auto text-sm">New Sign</p>
      </div>
    </div>
  </div>
</template>
