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
  advertType: String,
  id: String,
  street: { type: String, default: null },
  signList: { type: Array, default: [] },
});
const emit = defineEmits(["confirm"]);

const streetCat = [
  "Rural Zone N",
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  // "Enchroachment Fee N",
];

const loading = ref(false);

const getEndPoint = () => {
  if (props.type === "decline") {
    if (props.advertType === "premise") return "declinedonpremise";
    else if (props.advertType === "removeOnpremise")
      return "declinedremovalonpremise";
    else if (props.advertType === "addOnPremise")
      return "declinedadditionalonpremise";
    else if (props.advertType === "changeOnPremise")
      return "declinechangeonpremise";
    else if (props.advertType === "mobile-firstParty")
      return "declinemobileads";
    else if (props.advertType === "mobile-thirdParty")
      return "declinethirdpartymobile";
    else if (props.advertType === "streetLamp") return "declinedstreetlamp";
  } else if (props.type === "approve") {
    if (props.advertType === "premise") return "approveonpremise";
    else if (props.advertType === "removeOnpremise")
      return "approveremovalonpremise";
    else if (props.advertType === "addOnPremise")
      return "approveadditionalonpremise";
    else if (props.advertType === "changeOnPremise")
      return "approvechangeonpremise";
    else if (props.advertType === "mobile-firstParty")
      return "approvemobileads";
    else if (props.advertType === "mobile-thirdParty")
      return "approvethirdpartymobile";
    else if (props.advertType === "streetLamp") return "approvestreetlamp";
  }
};

const adminData = reactive({
  bank_and_others: false,
  product_on_sign: false,
  installation_date: null,
  comments: null,
  action: false,
  reports_from_branchmanger: null,
  report_file: null,
  discount: null,
  street_category: null,
  onpremiseinfo_ids: [],
});

const actionText = ref(false);
const permitCost = ref(null);

const approveText = computed(() => {
  return actionText.value ? "Continue" : "Submit";
});

const discountMobile = computed(() => {
  return (
    props.type === "approve" &&
    (props.advertType === "mobile-firstParty" ||
      props.advertType === "mobile-thirdParty")
  );
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
  onpremiseinfo_ids: {
    signLength: function () {
      if (props.type === "decline" && props.advertType === "premise") {
        return adminData.onpremiseinfo_ids.length;
      } else {
        return true;
      }
    },
  },
}));

const v$ = useVuelidate(rules, adminData);

async function declineApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${getEndPoint()}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Application Successfully Declined", {
        position: toast.POSITION.TOP_CENTER,
      });

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
  adminData.accept_price = actionText.value;
  try {
    const response = await axios.post(
      `${getEndPoint()}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      if (actionText.value) {
        toast.success("Application Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });

        emit("confirm", true);
      } else {
        actionText.value = true;
        loading.value = false;
        permitCost.value = response.data;

        // console.log(permitCost.value.Total)
      }
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
    loading.value = false;
  }
}

const getOnPremiseTitle = () => {
  if (props.advertType === "removeOnpremise") {
    return 'Amount to be removed'
  } else if (props.advertType === "addOnPremise") {
    return 'Additional Sign Permit Bill'
  } else {
    return 'Permit Bill'
  }
}

// console.log(getEndPoint());
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

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <IconDeclinePopup v-if="type === 'decline'" />

        <IconConfirmationPopup v-if="type === 'approve'" />

        <p class="text-center mt-5">
          Are you sure you want<br />to {{ type }} the application?
        </p>
      </div>

      <form class="py-2.5">
        <div v-if="!actionText">
          <div class="inputHolder" v-if="discountMobile">
            <input
              placeholder=" "
              type="number"
              max="100"
              min="0"
              class="input"
              id="email"
              v-model="adminData.discount"
            />
            <label for="first_name" class="inputLabel">Discount(%)</label>
          </div>
          <div
            v-if="
              props.type === 'approve' &&
              (props.advertType === 'premise' ||
                props.advertType === 'removeOnpremise' ||
                props.advertType === 'changeOnPremise' ||
                props.advertType === 'addOnPremise')
            "
          >
            <h6
              class="font-medium text-sm px-5 my-5 flex items-center justify-between"
              v-if="props.advertType === 'premise'"
            >
              Select Street Category
            </h6>
            <div v-if="props.advertType === 'premise'" class="inputHolder">
              <input
                type="text"
                placeholder=" "
                class="input peer"
                id="site_address_1"
                autocomplete="off"
                v-model="props.street"
                required
                disabled
              />
              <label for="site_address_1" class="inputLabel">Street Name</label>
            </div>

            <div class="inputHolder" v-if="props.advertType === 'premise'">
              <select
                placeholder=" "
                class="input peer"
                id="street_category"
                v-model="adminData.street_category"
                required
              >
                <option
                  v-for="(item, index) in streetCat"
                  :key="index"
                  :value="item"
                  v-text="item"
                ></option>
              </select>

              <label for="street_category" class="inputLabel">Category</label>
            </div>

            <div
              class="inputHolder"
              v-if="
                props.advertType === 'premise' ||
                props.advertType === 'addOnPremise'
              "
            >
              <input
                type="date"
                placeholder=" "
                class="input peer"
                id="installation_date"
                autocomplete="off"
                v-model="adminData.installation_date"
                required
              />
              <label for="installation_date" class="inputLabel"
                >Installation Date</label
              >
            </div>

            <div
              class="inputHolder"
              v-if="
                props.advertType === 'removeOnpremise'
              "
            >
              <input
                type="date"
                placeholder=" "
                class="input peer"
                id="removal_date"
                autocomplete="off"
                v-model="adminData.removal_date"
                required
              />
              <label for="removal_date" class="inputLabel"
                >Removal Date</label
              >
            </div>

            <div v-if="props.advertType === 'premise'" class="flex flex-row gap-2.5 items-center px-5">
              <input
                type="checkbox"
                name="bank_and_others"
                id="bank_and_others"
                v-model="adminData.bank_and_others"
              /><label class="text-sm" for="bank_and_others"
                >check if business is a Bank or 5 Major Telecoms</label
              >
            </div>

            <div v-if="props.advertType === 'changeOnPremise'" class="flex flex-row gap-2.5 items-center px-5">
              <input
                type="checkbox"
                name="product_on_sign"
                id="product_on_sign"
                v-model="adminData.product_on_sign"
              /><label class="text-sm" for="product_on_sign"
                >check if Product is on Sign</label
              >
            </div>
          </div>
          <div
            v-if="props.type === 'decline' && props.advertType === 'premise'"
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
          <div class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="reportComment"
              >Officer Comment</label
            >
            <textarea
              name="declineComment"
              id="declineComment"
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

        <div v-else>
          <div
            v-if="permitCost.AdministrativeFee"
            class="flex flex-col justify-center items-center gap-5 mb-5"
          >
            <h4 class="text-sm font-medium">Administrative Fee</h4>

            <p
              v-text="formatCurrency(parseInt(permitCost.AdministrativeFee))"
              class="font-semibold text-2xl"
            ></p>
          </div>

          <div
            v-if="permitCost.PermitFee"
            class="flex flex-col justify-center items-center gap-5 mb-5"
          >
            <h4 class="text-sm font-medium">Permit Bill</h4>

            <p
              v-text="formatCurrency(parseInt(permitCost.PermitFee))"
              class="font-semibold text-2xl"
            ></p>
          </div>

          <div
            v-if="permitCost.LegalPrice"
            class="flex flex-col justify-center items-center gap-5 mb-5"
          >
            <h4 class="text-sm font-medium">Legal Fee</h4>

            <p
              v-text="formatCurrency(parseInt(permitCost.LegalPrice))"
              class="font-semibold text-2xl"
            ></p>
          </div>

          <div class="flex flex-col justify-center items-center gap-5 mb-5">
            <h4 class="text-sm font-medium" v-if="permitCost.PermitFee">
              Total Fee
            </h4>
            <h4 class="text-sm font-medium" v-else>
              {{ getOnPremiseTitle() }}
            </h4>

            <p
              v-text="
                formatCurrency(permitCost.Total || permitCost['Total Fee'])
              "
              class="font-semibold text-2xl"
            ></p>
          </div>
        </div>

        <div class="flex items-center px-4">
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
              Decline Application
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
              {{ approveText }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
