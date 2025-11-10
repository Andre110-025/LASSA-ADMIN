<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import IconSpinner from "../icons/IconSpinner.vue";
import SmallAdvertItem from "./SmallAdvertItem.vue";
import { useUserStore } from "../../stores/user";
import UserAppDetails from "./UserAppDetails.vue";

const { userDetails } = useUserStore();
const route = useRoute();

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const inspection_fee = ref(null);
const taskAdmin = ref(null);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(`admingetsmallformat/${route.params.id}`);

    if (data.success) {
      pageData.value = data.data;
      taskAdmin.value = data.admins;
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

const setInspectionFee = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `adminsetinspectionfee/${pageData.value.id}`,
      {
        inspectionFee: inspection_fee.value,
      }
    );
    console.log(response);

    if (response.status === 200) {
      toast.success("Inspection Fee has been set", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Inspection Fee Could not be submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};
</script>

<template>
  <span
    v-if="pageData?.application_status === 'disapproved'"
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      SMALL FORMAT ADVERT APPLICATION DETAILS
    </h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" />
    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address of Sign</p>
        <p class="text-sm" v-text="pageData.address_site"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm capitalize" v-text="pageData.lga"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.property_owner_phone"
      >
        <p class="w-2/5 text-sm font-semibold">Property Owner Phone</p>
        <p
          class="text-sm capitalize"
          v-text="pageData.property_owner_phone"
        ></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.property_owner_email"
      >
        <p class="w-2/5 text-sm font-semibold">Property Owner Email</p>
        <p
          class="text-sm capitalize"
          v-text="pageData.property_owner_email"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Fee Status</p>
        <p class="text-sm">
          <span
            class="block bg-green-100 text-[#00AE4E] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-if="pageData.application_pay_status === 'paid'"
            >Paid</span
          >
          <span
            class="block bg-red-100 text-[#f00] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-else
            >Not Paid</span
          >
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.inspection_fee">
        <p class="w-2/5 text-sm font-semibold">Inspection Fee Status</p>
        <p class="text-sm">
          <span
            class="block bg-green-100 text-[#00AE4E] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-if="pageData.application_site_inspection_status === 'paid'"
            >Paid</span
          >
          <span
            class="block bg-red-100 text-[#f00] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-else
            >Not Paid</span
          >
        </p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>
    </div>

    <div class="px-6 bg-mainColor/10 py-2.5 rounded-md" v-if="taskAdmin.length">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Assigned Admins
      </h6>

      <div>
        <ul class="pl-10">
          <li
            class="list-[square]"
            v-for="(admin, index) in taskAdmin"
            :key="index"
          >
            {{ admin.first_name }} {{ admin.last_name }} - {{ admin.department }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Advert Details -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Advert Details
      </h6>

      <ul class="space-y-10">
        <SmallAdvertItem
          v-for="(item, index) in pageData.small_format_details"
          :key="index"
          :item="item"
          :index="index"
          :inspectStatus="pageData.application_site_inspection_status"
          :assignedOfficer="pageData.assigned_officer"
          @getUpdate="getAppInfo"
        />
      </ul>
    </div>

    <form
      @submit.prevent="setInspectionFee"
      v-if="
        pageData.application_pay_status === 'paid' &&
        !pageData.inspection_fee &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <div class="inputHolder px-6 max-w-xs">
        <input
          type="number"
          min="10000"
          placeholder=""
          class="input peer"
          id="inspectionFee"
          autocomplete="off"
          v-model="inspection_fee"
          required
        />
        <label for="inspectionFee" class="inputLabel"
          >Enter Inspection Fee</label
        >
      </div>

      <div class="actionsHolder max-w-xs">
        <button
          :disabled="loadingAction"
          type="submit"
          @click="adminActions('rmrecommendtemporaryadsdisapproval')"
          class="max-w-xs w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        >
          <IconSpinner v-if="loadingAction" />
          <span
            class="text-xs text-center font-medium text-white tracking-wider"
            v-if="!loadingAction"
          >
            Set Inspection Fee
          </span>
        </button>
      </div>
    </form>
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
