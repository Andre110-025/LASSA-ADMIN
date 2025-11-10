<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";
import { ref, reactive, watch } from "vue";

const props = defineProps({
  userId: {
    require: true,
  },
});

const loading = ref(false);
const loadingAction = ref(false);

const noticeData = reactive({
  amount: null,
  productType: null,
  paymentId: null,
  type: null,
  applyToAccount: false,
  comments: null,
});

const productType = ["outdoor", "premise"];
const noticeType = ["debit", "credit"];
const applicationList = ref(null);
const emit = defineEmits(["confirm"]);

const getApplications = async () => {
  loadingAction.value = true;

  try {
    const { data } = await axios.post(`debitnoteprodlist/${props.userId}/${noticeData.productType}`);

    console.log(data);

    if (data.success) {
      applicationList.value = data.date;

      loadingAction.value = false;
    }
  } catch (error) {}
};


watch(
  () => noticeData.productType,
  () => {
    applicationList.value = null;
    noticeData.paymentId = null;
    getApplications();
  }
)

const submitNotice = async () => {

  if (noticeData.applyToAccount) {
    noticeData.paymentId = null;
  }
  try {
    loading.value = true;
    const response = await axios.post(
      `debitcreditnote/${props.userId}`,
      noticeData
    );

    console.log(response);

    if (response.status == 200) {
      toast.success("Notice Successfully Created", {
        position: toast.POSITION.TOP_CENTER,
      });

      loading.value = false;

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] h-fit max-h-dvh overflow-y-auto max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-8 text-center">Create Debit/Credit Note</h4>
    </div>

    <div class="overflow-y-auto">
      <form
        @submit.prevent="submitNotice"
        class="w-full max-w-[300px] mx-auto"
        autocomplete="off"
      >
        <div class="inputHolder">
          <select
            v-model="noticeData.productType"
            placeholder=" "
            class="input peer uppercase"
            id="productType"
            required
          >
            <option
              value=""
              v-text="'Select a Product'"
              selected
              disabled
              class="uppercase"
            ></option>
            <option
              v-for="(item, index) in productType"
              :key="index"
              :value="item"
              v-text="item"
              class="uppercase"
            ></option>
          </select>
          <label for="productType" class="inputLabel">Select a Product</label>
        </div>

        <div class="inputHolder">
          <select
            v-model="noticeData.type"
            placeholder=" "
            class="input peer uppercase"
            id="type"
            required
          >
            <option
              value=""
              v-text="'Select a Notice type'"
              selected
              disabled
              class="uppercase"
            ></option>
            <option
              v-for="(item, index) in noticeType"
              :key="index"
              :value="item"
              v-text="item"
              class="uppercase"
            ></option>
          </select>
          <label for="type" class="inputLabel"
            >Select a Notice type</label
          >
        </div>

        <div class="flex flex-row gap-2.5 items-center px-5">
          <input
            type="checkbox"
            name="applyToAccount"
            id="applyToAccount"
            v-model="noticeData.applyToAccount"
          /><label class="text-sm" for="applyToAccount"
            >check to apply to account</label
          >
        </div>

        <div v-if="!noticeData.applyToAccount" class="inputHolder">
          <select
            v-model="noticeData.paymentId"
            placeholder=" "
            class="input peer uppercase text-xs"
            id="payment_id"
            required
            :disabled="loadingAction"
          >
            <option
              value=""
              v-text="'Select an Application'"
              selected
              disabled
              class="uppercase text-xs"
            ></option>
            <option
              v-for="(item, index) in applicationList"
              :key="index"
              :value="item.payment_id"
              class="uppercase text-xs text-wrap"
            > {{ `${item.address_proposed_site || item.sign_address} - ${item.payment_id}` }} </option>
          </select>
          <label for="payment_id" class="inputLabel"
            >Select an Application</label
          >
        </div>

        <div v-if="false" class="inputHolder">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="paymentId"
            autocomplete="off"
            v-model="noticeData.paymentId"
            required
          />
          <label for="paymentId" class="inputLabel"
            >Application Payment ID</label
          >
        </div>

        <div class="inputHolder">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="amount"
            v-model="noticeData.amount"
            step="01"
            required
          />
          <label for="amount" class="inputLabel">Amount</label>
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
            v-model="noticeData.comments"
          ></textarea>
        </div>

        <div class="my-5">
          <button
            :disabled="loading"
            type="submit"
            class="blueBtn min-w-[200px] mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-sm font-medium text-white tracking-wider"
              v-if="!loading"
              >Create Notice</span
            >
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
