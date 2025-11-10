<script setup>
import { useModal } from "vue-final-modal";
import ConfirmApplication from "./popups/ConfirmApplication.vue";

function openConfirmApplicationPopup(value) {
  const { open, close } = useModal({
    component: ConfirmApplication,
    attrs: {
      type: value,
      onConfirm() {
        close();
      },
    },
    slots: {},
  });
  open();
}
</script>

<template>
  <div class="bg-white rounded-md p-5 pt-8 mt-6 max-w-xl mx-auto">
    <h4 class="text-sm text-center">
      OUTDOOR ADVERTISING STRUCTURE APPLICATION
      <br class="block md:hidden" />
      (<span class="text-red-500"> FIRST PARTY </span>)
    </h4>

    <!-- Image and address -->
    <div
      class="flex 2md:flex-row flex-col w-full p-6 border-t-2 border-gray-300 border-b-2 mt-4"
    >
      <img class="block w-14 h-14 bg-gray-500 rounded-full m-auto" src="" alt="" />
      <div class="flex flex-col px-6 justify-between w-4/5 h-fit gap-1 m-auto">
        <div class="flex 2md:flex-row 2md:text-left text-center flex-col">
          <p class="2md:w-1/2 w-full">Tola Beauty</p>
          <p class="text-xs my-auto">2 Toyin street Surulere</p>
        </div>
        <div class="flex 2md:flex-row 2md:text-left text-center flex-col">
          <p class="text-xs 2md:w-1/2 w-full">LASAA234575</p>
          <p class="text-xs">0801 234 5678</p>
        </div>
      </div>
    </div>

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p class="text-sm">Application for a new sign</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm">Projecting Billboard</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Address</p>
        <p class="text-sm">42, Yemi St, unity lane Surulere, Lagos</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm">24 Surulere</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Signs</p>
        <p class="text-sm">1</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Dimension in meters</p>
        <p class="text-sm">24 by 40 meters</p>
      </div>
    </div>

    <!-- Property Description -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Property Description
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Type</p>
        <p class="text-sm">Single business unit</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Property Owner</p>
        <p class="text-sm">Ademumi Mall</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner Phone No.</p>
        <p class="text-sm">0901 234 5678</p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner Email</p>
        <p class="text-sm">account@email.com</p>
      </div>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img src="#" alt="" class="w-full h-40 bg-gray-600" />
      </div>
    </div>

    <div class="flex flex-row justify-center gap-4 pb-20">
      <button
        class="px-8 py-3 bg-red-600 text-sm rounded-md text-white"
        @click="openConfirmApplicationPopup('decline')"
      >
        Decline Application
      </button>
      <button
        class="px-16 py-3 bg-green-600 text-sm rounded-md text-white"
        @click="openConfirmApplicationPopup('approve')"
      >
        Approve Application
      </button>
    </div>
  </div>
</template>

<style scoped>
div.fxfcol > div.flex {
  @apply gap-2 2md:flex-row flex-col;
}
div.fxfcol > div > p:nth-of-type(1) {
  @apply 2md:w-[40%] w-full;
}
div.fxfcol > div > p:nth-of-type(2) {
  @apply 2md:w-[60%] w-full;
}
</style>
