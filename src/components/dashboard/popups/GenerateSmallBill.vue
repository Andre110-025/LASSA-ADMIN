<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import { ref, reactive } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  id: Number,
  signCost: Number,
  renewalCost: Number,
});

const loading = ref(false);

const emit = defineEmits(["confirm"]);

const billPricing = reactive({
  adsPrice: props.signCost,
  annualPrice: props.renewalCost,
});

const generateBill = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(
      `billinggeneratesmallformat/${props.id}`,
      billPricing
    );

    if (data.success) {
      toast.success("Bill Generated", {
        position: toast.POSITION.TOP_CENTER,
      });
      emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] sm:min-h-[320px] h-fit max-h-dvh max-w-[21.25rem] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <p class="text-center mt-5 font-semibold">
          Enter Bill Pricing
        </p>
      </div>

      <form
        class="py-2.5"
        @submit.prevent="generateBill()"
      >
        <div class="inputHolder px-6">
          <input
            type="number"
            step=".01"
            placeholder=""
            class="input peer"
            id="adsPrice"
            autocomplete="off"
            v-model="billPricing.adsPrice"
            required
          />
          <label for="adsPrice" class="inputLabel"
            >Advert Price</label
          >
        </div>

        <div class="inputHolder px-6">
          <input
            type="number"
            step=".01"
            placeholder=""
            class="input peer"
            id="annualPrice"
            autocomplete="off"
            v-model="billPricing.annualPrice"
            required
          />
          <label for="annualPrice" class="inputLabel"
            >Annual Renewal Price</label
          >
        </div>

        <div class="flex items-center px-4">
          <button
            :disabled="loading"
            type="submit"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Generate Bill
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
