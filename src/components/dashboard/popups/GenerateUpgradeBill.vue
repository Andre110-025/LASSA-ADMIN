<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";

const { formatCurrency } = useHelpers();
const { userDetails } = useUserStore();
const props = defineProps({
  id: String,
  uploadType: String,
  extraId: Number,
  signData: Object,
});

const loading = ref(false);

const billGenerated = ref(false);
const billData = ref(null);

const streetCategory = [
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  "Local & International Airport N",
  "Encroachment Zone N",
  "Not Applicable",
];

const filteredStreetCategory = computed(() => {
  if (props.signData.request_outdoor_signage.includes("LED")) {
    return streetCategory.filter(
      (category) => category !== "Restrictive Zone N"
    );
  } else {
    return streetCategory.filter(
      (category) => category !== "Encroachment Zone N"
    );
  }
});

const emit = defineEmits(["confirm"]);

const billCategoryData = reactive({
  streetClassification: props.signData?.street_category || null,
  // ads_price: props.signData?.ads_price || null,
  price_rate: props.signData?.price_rate || null,
  // ads_price_remove: props.signData?.price_rate || null,
});

const generateBill = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(
      `${props.uploadType}/${props.id}/${props.extraId}`,
      billCategoryData
    );

    if (data.success) {
      toast.success("Bill Generated", {
        position: toast.POSITION.TOP_CENTER,
      });

      billData.value = data;
      billGenerated.value = true;
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

      <div>
        <div class="flex flex-col justify-center my-2.5 pt-2.5">
          <p v-if="!billGenerated" class="text-center mt-5 font-semibold">
            Categorize Application
          </p>
          <p v-else class="text-center mt-5 font-semibold">Generated Bill</p>
        </div>

        <form
          v-if="!billGenerated"
          class="py-2.5"
          @submit.prevent="generateBill()"
        >
          <div class="inputHolder">
            <select
              placeholder=" "
              class="input peer"
              id="streetClassification"
              v-model="billCategoryData.streetClassification"
              required
            >
              <option
                v-for="(item, index) in filteredStreetCategory"
                :key="index"
                :value="item"
                v-text="item"
              ></option>
            </select>
            <label for="streetClassification" class="inputLabel"
              >Street Classification</label
            >
          </div>

          <div
            v-if="
              billCategoryData.streetClassification === 'Not Applicable' ||
              (userDetails.userInfo.admin_role_id == 5 &&
                userDetails.userInfo.department === 'Billings')
            "
            class="inputHolder px-6"
          >
            <input
              type="number"
              placeholder=""
              class="input peer"
              id="price_rate"
              autocomplete="off"
              v-model="billCategoryData.price_rate"
              step=".01"
              required
            />
            <label for="price_rate" class="inputLabel">Advert Annual Rate</label>
          </div>

          <!-- <div
            v-if="
              billCategoryData.streetClassification === 'Not Applicable' ||
              (userDetails.userInfo.admin_role_id == 5 &&
                userDetails.userInfo.department === 'Billings')
            "
            class="inputHolder px-6"
          >
            <input
              type="number"
              min="10000"
              placeholder=""
              class="input peer"
              id="ads_price"
              autocomplete="off"
              step=".01"
              v-model="billCategoryData.ads_price"
              required
            />
            <label for="ads_price" class="inputLabel">Advert Price</label>
          </div> -->

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

        <div v-else class="py-2.5 px-10 space-y-5">
          <div class="flex gap-4">
            <p class="font-medium grow">Signage Bill</p>
            <p
              class="grow"
              v-text="formatCurrency(billData.adsPrice)"
            ></p>
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
    </div>
  </VueFinalModal>
</template>
