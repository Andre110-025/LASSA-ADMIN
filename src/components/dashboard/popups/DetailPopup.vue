<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { ref } from "vue";
// import { defineProps } from "vue";

const emit = defineEmits(["confirm"]);
// const props = ref(defineProps({
//   data:Object
// }))
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[400px] min-h-[500px] h-fit max-h-dvh max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>
      <!-- content goes here -->
      <div class="flex flex-col">
        <h3 class="text-center font-normal mt-10">{{ "Third Party Site Permit" }}</h3>

        <div class="flex flex-row w-full p-6">
          <img class="block w-14 h-14 bg-gray-500 rounded-full" src="../../../../public/tempImg/b73ae4fd72dafebe18d76c427055dd09.png" alt="" />
          <div class="flex flex-col px-6 justify-between w-4/5 h-fit gap-1">
            <div class="flex flex-row">
              <p class="w-1/2">XYZ Media</p>
              <p class="text-xs my-auto">2 Toyin street Ikeja</p>
            </div>
            <div class="flex flex-row">
              <p class="text-xs w-1/2">LASAA234575</p>
              <p class="text-xs">0801 234 5678</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col p-6 gap-6">
          <div class="flex flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Advert Type</p>
            <p class="text-sm">Billboard</p>
          </div>
          <div class="flex flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Location</p>
            <p class="text-sm">Toyin Bridge, Surulere LGA</p>
          </div>
          <div class="flex flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Duration</p>
            <p class="text-sm">6 Months</p>
          </div>
          <div class="flex flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Application Date</p>
            <p class="text-sm">24 May 2024</p>
          </div>
          <div class="flex flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Payment</p>
            <p class="text-sm">₦50,000</p>
          </div>
        </div>
        <!-- links go here -->
        <div class="flex gap-2 justify-center absolute bottom-4 w-full">
          <a
            class="w-40 py-2 text-center cursor-pointer rounded-md text-xs border-mainColor border-2 text-mainColor"
            >View Profile</a
          >
          <RouterLink
            :to="{ name:'Application Details' }"
            class="w-40 py-2 text-center cursor-pointer rounded-md text-xs border-2 bg-mainColor text-white"
          >
            View Application
          </RouterLink>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
