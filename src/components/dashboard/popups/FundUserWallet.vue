<script setup>
import { VueFinalModal, useModal } from "vue-final-modal";
import axios from "axios";
import { reactive, ref, computed } from "vue";
import { toast } from "vue3-toastify";
import PhotoLoader from "../PhotoLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import SelectUser from "./SelectUser.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const loading = ref(false);
const selectedBiz = ref(null);

const emit = defineEmits(["confirm"]);

const fundData = reactive({
  user_id: null,
  transaction_amount: null,
  transaction_name: null,
  transaction_purpose: null,
  transaction_date: null,
  bank_name: null,
  account_number: null,
  account_name: null,
  receipt: null,
});

const rules = computed(() => ({
  transaction_amount: { required },
  transaction_name: { required },
  transaction_purpose: { required },
  transaction_date: { required },
  bank_name: { required },
  account_number: { required },
  account_name: { required },
  receipt: { required },
}));

const f$ = useVuelidate(rules, fundData);

const purpose = [
  { name: "Application Fee", value: "Application Fee" },
  { name: "Mobile Adverts", value: "Mobile Adverts" },
  { name: "PAVs", value: "PAVs" },
  { name: "Street Lamp Permit Fee", value: "Street Lamp Processing Fee" },
  {
    name: "Street Lamp Administrative Fee",
    value: "Street Lamp Administrative Fee",
  },
];

const paymentDetails = [
  {
    type: "Application Fee",
    accountName: "LASAA APPLICATION PROCESSING FEE ACCOUNT",
    accountNumber: "2001714167",
    bank: "First City Monument Bank",
  },
  {
    type: "Street Lamp Processing Fee",
    accountName: "STREET LAMP POLE ACCOUNT",
    accountNumber: "5030046052",
    bank: "Fidelity Bank",
  },
  {
    type: "Street Lamp Poles",
    accountName: "SLP ADMINISTRATIVE/PROCESSING FEE",
    accountNumber: "2001714198",
    bank: "First City Monument Bank",
  },
  {
    type: "Mobile Vehicle Branding",
    accountName: "LASAA MOBILE ADVERT ACCOUNT",
    accountNumber: "0876032049",
    bank: "Guaranty Trust Bank",
  },
  {
    type: "3rd Party Ad",
    accountName: "LASAA BILLBOARD ACCOUNT",
    accountNumber: "0055914693",
    bank: "Access Bank",
  },
  {
    type: "On-Premise Signage",
    accountName: "LAGOS STATE SIGN. & ADVERT. AGENCY - REV",
    accountNumber: "1011119613",
    bank: "Zenith Bank",
  },
];

const selectBank = () => {
  switch (fundData.transaction_purpose) {
    case "Application Fee":
      fundData.account_name = paymentDetails[0].accountName;
      fundData.account_number = paymentDetails[0].accountNumber;
      fundData.bank_name = paymentDetails[0].bank;
      break;

    case "Mobile Adverts":
      fundData.account_name = paymentDetails[3].accountName;
      fundData.account_number = paymentDetails[3].accountNumber;
      fundData.bank_name = paymentDetails[3].bank;
      break;

    case "PAVs":
      fundData.account_name = paymentDetails[3].accountName;
      fundData.account_number = paymentDetails[3].accountNumber;
      fundData.bank_name = paymentDetails[3].bank;
      break;

    case "Street Lamp Processing Fee":
      fundData.account_name = paymentDetails[1].accountName;
      fundData.account_number = paymentDetails[1].accountNumber;
      fundData.bank_name = paymentDetails[1].bank;
      break;

    case "Street Lamp Administrative Fee":
      fundData.account_name = paymentDetails[2].accountName;
      fundData.account_number = paymentDetails[2].accountNumber;
      fundData.bank_name = paymentDetails[2].bank;
      break;

    default:
      fundData.account_name = null;
      fundData.account_number = null;
      fundData.bank_name = null;
      break;
  }
};

const submitFundRequest = async () => {
  loading.value = true;
  try {
    const response = await axios.post("savewallettransactionforuser", fundData);
    // console.log(response);
    if (response.status === 200) {
      toast.success("Fund Request Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm");
    }
    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);

    loading.value = false;
  }
};

const { open: openUser, close: closeUser } = useModal({
  component: SelectUser,
  attrs: {
    onConfirm(info) {
      closeUser();
      selectedBiz.value = info.business_name;
      fundData.user_id = info.id;
    },
  },
  slots: {},
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] min-h-[350px] h-fit max-h-dvh max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-5 text-center">Fund Wallet</h4>
    </div>
    <form class="p-10 overflow-y-auto" @submit.prevent="submitFundRequest">
      <div class="inputHolder">
        <input
          type="text"
          placeholder="Click to select user"
          class="input placeholder:text-black"
          id="user_id"
          autocomplete="off"
          readonly
          v-model="selectedBiz"
          required
          @click="openUser"
        />
      </div>

      <div class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          id="transaction_amount"
          v-model="fundData.transaction_amount"
          autocomplete="off"
          required
        />
        <label for="transaction_amount" class="inputLabel"
          >Transaction Amount</label
        >
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="transaction_name"
          v-model="fundData.transaction_name"
          autocomplete="off"
          required
        />
        <label for="transaction_name" class="inputLabel">Depositors Name</label>
      </div>

      <div class="inputHolder">
        <input
          type="date"
          placeholder=" "
          class="input peer"
          id="transaction_date"
          v-model="fundData.transaction_date"
          autocomplete="off"
          required
        />
        <label for="transaction_date" class="inputLabel">Payment Date</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="transaction_purpose"
          v-model="fundData.transaction_purpose"
          required
          @change="selectBank()"
        >
          <option
            v-for="(item, index) in purpose"
            :key="index"
            :value="item.value"
            v-text="item.name"
          ></option>
        </select>
        <label for="transaction_purpose" class="inputLabel"
          >Select Payment Purpose</label
        >
      </div>

      <div v-if="fundData.transaction_purpose" class="inputHolder">
        <span v-text="fundData.account_name"></span>
        <span v-text="fundData.account_number"></span>
        <span v-text="fundData.bank_name"></span>
      </div>

      <PhotoLoader
        :label="'transReceipt'"
        @update:photoEncode="
          (base64Content) => (fundData.receipt = base64Content)
        "
      >
        Upload Transaction Receipt
      </PhotoLoader>

      <div class="mt-5">
        <button
          :disabled="f$.$invalid || loading"
          type="submit"
          class="blueBtn min-w-[200px] mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Submit</span
          >
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>
