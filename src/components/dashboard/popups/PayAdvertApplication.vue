<script setup>
import { VueFinalModal } from "vue-final-modal";

</script>

<template>
    <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[450px] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
    >
      <div class="border-b-2 border-dashed">
        <h4 class="px-5 py-8 text-center">Submitting Application</h4>
      </div>
      <div class="p-10">
        <p class="text-center">Update your personal information and business information for proper documentation and verifications</p>
        <RouterLink :to="{ name: 'Enter Kyc' }" class="blueBtn mx-auto mt-5 max-w-[200px] text-center">Continue</RouterLink>
      </div>
    </VueFinalModal>
</template>