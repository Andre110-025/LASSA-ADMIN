<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const { formatCurrency } = useHelpers();
const props = defineProps({
  id: String,
  uploadType: String,
  extraId: Number,
});

const loading = ref(false);

const billData = ref(null);

const emit = defineEmits(["confirm"]);


const generateBill = async () => {

  try {
    loading.value = true;
    const { data } = await axios.post(
      `${props.uploadType}/${props.id}/${props.extraId}`
    );

    if (data.success) {
      toast.success("Bill Generated", {
        position: toast.POSITION.TOP_CENTER,
      });

      billData.value = data;
      // emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};

generateBill();
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
        <p class="text-center mt-5 font-semibold">Bill Deducted</p>
      </div>

      <div class="py-2.5 px-10 space-y-5" v-if="billData">
        <div class="flex gap-4">
          <p class="font-medium grow">Signage Bill</p>
          <p class="grow" v-text="formatCurrency(billData.adsPrice)"></p>
        </div>
        <div class="flex gap-4">
          <p class="font-medium grow">Legal Fee</p>
          <p class="grow" v-text="formatCurrency(billData.legalFee)"></p>
        </div>

        <div class="flex items-center">
          <button
            type="button"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
            @click="emit('confirm')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
