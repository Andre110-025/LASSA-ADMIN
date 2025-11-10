<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { ref, reactive, computed } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import DocumentLoader from "../DocumentLoader.vue";
import { useHelpers } from "../../../helper";
import IconConfirmationPopup from "../../icons/IconConfirmationPopup.vue";
import IconDeclinePopup from "../../icons/IconDeclinePopup.vue";
import { useVuelidate } from "@vuelidate/core";
import { requiredIf, helpers } from "@vuelidate/validators";

const { formatCurrency } = useHelpers();

const props = defineProps({
  type: String,
  id: String,
  endPont: String,
  advertPrice: {
    default: null,
  },
  pastPrice: {
    default: null,
  },
  removePrice: {
    default: null,
  },
  signList: { type: Array, default: [] },
});
const emit = defineEmits(["confirm"]);

const loading = ref(false);
const ads_price = ref(props.advertPrice);
const previous_price = ref(props.pastPrice);
const remove_price = ref(props.removePrice);

const adminData = reactive({
  comments: null,
  reports_from_branchmanger: null,
  report_file: null,
  onpremiseinfo_ids: [],
});

const rules = computed(() => ({
  // comments: {
  //   required: helpers.withMessage("Email/phone number is required", required),
  // },
  comments: {
    requiredIfAction: helpers.withMessage(
      "Comment is required",
      requiredIf(props.type === "decline")
    ),
  },
  reports_from_branchmanger: {
    requiredIfAction: helpers.withMessage(
      "Comment is required",
      requiredIf(props.type === "approve")
    ),
  },
}));

const v$ = useVuelidate(rules, adminData);

async function declineApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${props.endPont}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      if (endPont === "deleteonpremisedetails") {
        toast.success("Sign Successfully Remove", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Application Successfully Returned", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
      emit("confirm", true);
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loading.value = false;
  }
}

async function approveApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${props.endPont}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Recommendation Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
  }
}

async function approveBill() {
  loading.value = true;

  try {
    const response = await axios.post(`${props.endPont}/${props.id}`, {
      price: ads_price.value,
      previous_ads_price: previous_price.value,
      to_remove_ads_price: remove_price.value,
    });

    // console.log(response);

    if (response.status === 200) {
      toast.success("Bill Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
  }
}

const currentYearBill = computed(() => {
  return ads_price.value - previous_price.value;
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-fit max-h-dvh max-w-[21.25rem] overflow-y-auto"
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

      <div
        v-if="
          props.endPont !== 'approvebillingonpremise' &&
          props.endPont !== 'approveremovebillingonpremise'
        "
        class="flex flex-col justify-center my-2.5 pt-2.5"
      >
        <!-- <IconDeclinePopup v-if="type === 'decline'" />

        <IconConfirmationPopup
          v-if="
            type === 'approve' &&
            props.endPont !== 'approvebillingonpremise' &&
            props.endPont !== 'approveremovebillingonpremise' &&
            props.endPont !== 'approvechangebillingonpremise'
          "
        /> -->

        <!-- <p
          v-if="
            props.endPont !== 'approvebillingonpremise' &&
            props.endPont !== 'approveremovebillingonpremise' &&
            props.endPont !== 'approvechangebillingonpremise'
          "
          class="text-center mt-5"
        >
          Are you sure you want<br />to {{ type }} the application?
        </p> -->

        <p class="text-center font-semibold mt-5">Enter comment to submit</p>
      </div>

      <form class="py-2.5">
        <div
          v-if="
            props.endPont === 'approvebillingonpremise' ||
            props.endPont === 'approveremovebillingonpremise' ||
            props.endPont === 'approveadditionalbillingonpremise' ||
            props.endPont === 'approvechangebillingonpremise'
          "
        >
          <h3 class="text-center font-medium mb-5">Review Bill</h3>

          <div class="flex flex-col justify-center items-center gap-5 mb-5">
            <h4
              v-if="
                props.endPont === 'approvebillingonpremise' ||
                props.endPont === 'approvechangebillingonpremise'
              "
              class="text-sm font-medium"
            >
              Generated Bill
            </h4>
            <h4
              v-else-if="props.endPont === 'approveremovebillingonpremise'"
              class="text-sm font-medium"
            >
              Bill Deducted
            </h4>

            <p
              v-text="formatCurrency(props.advertPrice)"
              class="font-semibold text-2xl"
            ></p>
          </div>

          <div v-if="props.pastPrice" class="inputHolder px-6">
            <input
              type="number"
              min="5000"
              placeholder=""
              class="input peer"
              id="price_rate"
              autocomplete="off"
              v-model="previous_price"
              step="0.01"
              required
            />
            <label for="price_rate" class="inputLabel">Edit Past Bill</label>
          </div>

          <div
            v-if="props.endPont === 'approvechangebillingonpremise'"
            class="inputHolder px-6"
          >
            <input
              type="number"
              min="5000"
              placeholder=""
              class="input peer"
              id="price_rate"
              autocomplete="off"
              v-model="remove_price"
              step="0.01"
              required
            />
            <label for="price_rate" class="inputLabel"
              >Edit Deducted bill</label
            >
          </div>

          <div class="inputHolder px-6">
            <input
              type="number"
              min="5000"
              placeholder=""
              class="input peer"
              id="price_rate"
              autocomplete="off"
              v-model="ads_price"
              step="0.01"
              required
            />
            <label
              v-if="props.endPont === 'approvebillingonpremise'"
              for="price_rate"
              class="inputLabel"
              >Edit Total Bill</label
            >
            <label
              v-else-if="props.endPont === 'approveadditionalbillingonpremise'"
              for="price_rate"
              class="inputLabel"
              >Additional Sign Bill</label
            >
            <label
              v-else-if="props.endPont === 'approvechangebillingonpremise'"
              for="price_rate"
              class="inputLabel"
              >Edit Change Bill</label
            >
            <label v-else for="price_rate" class="inputLabel"
              >Edit Deducted Bill</label
            >
          </div>

          <span
            v-if="props.endPont === 'approvebillingonpremise'"
            class="block my-5 px-6"
          >
            Current Year Bill is {{ formatCurrency(currentYearBill) }}
          </span>

          <div class="px-5">
            <button
              v-if="type === 'approve'"
              :disabled="loading"
              type="submit"
              @click="approveBill()"
              class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
            >
              <IconSpinner v-if="loading" />
              <span
                class="text-xs text-center font-medium text-white tracking-wider"
                v-if="!loading"
              >
                approve Bill
              </span>
            </button>
          </div>
        </div>
        <div v-else>
          <div
            v-if="props.type === 'decline' && endPont === 'declinedonpremise'"
          >
            <div
              v-for="(item, index) in props.signList"
              :key="index"
              class="flex flex-row gap-2.5 items-center px-5"
            >
              <input
                type="checkbox"
                :name="`onpremiseinfo_ids${item.id}`"
                :id="`onpremiseinfo_ids${item.id}`"
                :value="item.id"
                v-model="adminData.onpremiseinfo_ids"
              /><label
                class="text-sm"
                :for="`onpremiseinfo_ids${item.id}`"
                v-text="item.type_of_sign"
              ></label>
            </div>
          </div>
          <div class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="clientComment"
              >Comment to Client</label
            >
            <textarea
              name="clientComment"
              id="clientComment"
              cols="3"
              class="input resize-none"
              required
              v-model="adminData.comments"
              :class="{
                'border-red-600': v$.comments.$error,
              }"
              @blur="v$.comments.$touch"
            ></textarea>
          </div>
          <div v-if="endPont !== 'deleteonpremisedetails'" class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="reportComment"
              >Officer Comment</label
            >
            <textarea
              name="reportComment"
              id="reportComment"
              cols="3"
              class="input resize-none"
              required
              v-model="adminData.reports_from_branchmanger"
              :class="{
                'border-red-600': v$.reports_from_branchmanger.$error,
              }"
              @blur="v$.reports_from_branchmanger.$touch"
            ></textarea>
          </div>

          <!-- <DocumentLoader
            :label="'reportDoc'"
            @updateEncode="
              (base64Content) => (adminData.report_file = base64Content)
            "
          >
            Upload Report Document(optional)
          </DocumentLoader> -->
        </div>

        <div
          v-if="
            props.endPont !== 'approvebillingonpremise' &&
            props.endPont !== 'approveremovebillingonpremise' &&
            props.endPont !== 'approveadditionalbillingonpremise' &&
            props.endPont !== 'approvechangebillingonpremise'
          "
          class="flex items-center px-4"
        >
          <button
            v-if="type === 'decline'"
            :disabled="v$.$invalid || loading"
            type="submit"
            class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
            @click="declineApp()"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Submit
            </span>
          </button>

          <button
            v-if="type === 'approve'"
            :disabled="v$.$invalid || loading"
            type="submit"
            @click="approveApp()"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Submit
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
