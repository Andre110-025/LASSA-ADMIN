<script setup>
import { VueFinalModal } from "vue-final-modal";
import axios from "axios";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import IconAppStatus from "../../icons/IconAppStatus.vue";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";

const admin_role = useUserStore().userDetails.userInfo.admin_role_id;

const { formatCurrency } = useHelpers();

const loading = ref(false);

const emit = defineEmits(["confirm"]);

const props = defineProps({
  requestData: Object,
});

const fundData = reactive({
  status: null,
  comment: null,
  reference: null
});

const submitFundRequest = async (str) => {
  loading.value = true;

  fundData.status = str;

  try {
    const response = await axios.post(
      `updateuserwalletbalance/${props.requestData.transaction_id}`,
      fundData
    );
    // console.log(response);
    if (response.status === 200) {
      toast.success("Fund Request Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
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
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] h-fit max-h-dvh min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-5 text-center">Fund Request Details</h4>
    </div>

    <div class="p-5 overflow-y-auto">
      <div class="flex flex-col p-6 gap-4 fxfcol">
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Depositor Name</p>
          <p class="text-sm" v-text="props.requestData.transaction_name"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Company Name</p>
          <p class="text-sm" v-text="props.requestData.company_name"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Fund Purpose</p>
          <p class="text-sm" v-text="props.requestData.transaction_type"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Bank Name</p>
          <p class="text-sm" v-text="props.requestData.bank_name"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Number</p>
          <p class="text-sm" v-text="props.requestData.account_number"></p>
        </div>
        <div class="flex xs:flex-row align-middle" v-if="props.requestData.account_name">
          <p class="w-2/5 text-sm font-semibold">Account Name</p>
          <p class="text-sm" v-text="props.requestData.account_name"></p>
        </div>
        <div class="flex xs:flex-row align-middle" v-if="props.requestData.transaction_reference">
          <p class="w-2/5 text-sm font-semibold">Transaction Reference</p>
          <p class="text-sm" v-text="props.requestData.transaction_reference"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Amount</p>
          <p class="text-sm">{{ formatCurrency(props.requestData.transaction_amount) }}</p>
        </div>
        <div class="flex xs:flex-row align-middle" v-if="props.requestData.transaction_date">
          <p class="w-2/5 text-sm font-semibold">Payment Date</p>
          <p class="text-sm" v-text="props.requestData.transaction_date"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Status</p>
          <p class="text-sm">
            <IconAppStatus :status="props.requestData.status" />
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2 px-5">
        <p class="w-2/5 text-sm font-semibold">Payment Slip</p>
        <img
          :src="props.requestData.receipt"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div class="inputHolder" v-if="props.requestData.status === 'pending' && admin_role != 10">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="reference"
          v-model="fundData.reference"
          autocomplete="off"
          required
        />
        <label for="reference" class="inputLabel">Transaction Reference</label>
      </div>

      <div class="inputHolder" v-if="props.requestData.status === 'pending' && admin_role != 10">
        <label class="text-start mb-2.5 text-sm" for="clientComment"
          >Comment to Client</label
        >
        <textarea
          name="clientComment"
          id="clientComment"
          cols="3"
          class="input resize-none"
          required
          v-model="fundData.comment"
        ></textarea>
      </div>

      <div class="actionsHolder" v-if="props.requestData.status === 'pending' && admin_role != 10">
        <button
          :disabled="loading"
          type="submit"
          class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
          @click="submitFundRequest('rejected')"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-xs text-center font-medium text-white tracking-wider"
            v-if="!loading"
          >
            Decline
          </span>
        </button>

        <button
          :disabled="loading"
          type="submit"
          @click="submitFundRequest('completed')"
          class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-xs text-center font-medium text-white tracking-wider"
            v-if="!loading"
          >
            Approve
          </span>
        </button>
      </div>

    </div>
  </VueFinalModal>
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
