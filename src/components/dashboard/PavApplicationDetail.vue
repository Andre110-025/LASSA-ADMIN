<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { useUserStore } from "../../stores/user";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import ConfirmApplication from "./popups/ConfirmApplication.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import UserAppDetails from "./UserAppDetails.vue";

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const { userDetails } = useUserStore();

const route = useRoute();

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const groupedData = ref({});
// const groupedArray = ref(null);

const sortVehicle = (data) => {
  console.log(data);
  // Iterate through the array and group objects
  data.forEach((item) => {
    const key = `${item.vehicle_type}`;

    // Check if the key exists, if not, create an empty array
    if (!groupedData.value[key]) {
      groupedData.value[key] = [];
    }

    // Push the current object to the array corresponding to the key
    groupedData.value[key].push(item);
  });

  // Convert the grouped data object to an array if needed
  // groupedArray.value = Object.values(groupedData.value);

  // console.log(groupedArray.value);
};

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(
      `admingetthirdpartymobiledetails/${route.params.id}`
    );

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      pageData.value.assigned_hod = response.data.assigned_hod;
      // console.log(response.data.data[0]);

      sortVehicle(pageData.value.third_party_mobile_vehicle_lincense);
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

function openConfirmApplicationPopup(value) {
  const { open, close } = useModal({
    component: ConfirmApplication,
    attrs: {
      type: value,
      advertType: `mobile-thirdParty`,
      id: route.params.id,
      onConfirm(bol) {
        if (bol) {
          getAppInfo();
        }
        close();
      },
    },
    slots: {},
  });
  open();
}

// HOD Actions
const approvePermitHod = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `hodapprovalthirdpartymobile/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Permit Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};

const declinePermitHod = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `hoddeclinethirdpartymobile/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Permit Successfully Declined", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};
// Legal Approval
const approvePermitLegal = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `legalapprovalforthirdpartymobile/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Permit Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};

// General Manager Actions
const approvePermitGm = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `finalapproveforthirdparty/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Permit Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};

const declinePermitGm = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `finaldeclineforthirdpartymobile/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Permit Successfully Declined", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};

// User Support Wallet Pay
const walletPay = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `paypavwallet/${pageData.value.id}/wa${pageData.value.payment_id}`
    );

    if (response.status === 200) {
      toast.success("Wallet Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if(error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Your Payment Could not be confirmed", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
}
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      PROMOTIONAL ADVERT VEHICLE APPLICATION DETAILS
    </h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" />

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p
          class="text-sm"
          v-text="
            pageData.purpose_of_application || 'Application for a new sign'
          "
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Brand Name</p>
        <p class="text-sm" v-text="pageData.brand_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm" v-text="pageData.duration"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.start_date">
        <p class="w-2/5 text-sm font-semibold">Start Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.start_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.due_date">
        <p class="w-2/5 text-sm font-semibold">Due Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.due_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Status</p>
        <p class="text-sm"><IconAppStatus :status="pageData.status" /></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.hod_permit_status"
      >
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_permit_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.legal_status">
        <p class="w-2/5 text-sm font-semibold">Legal Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.legal_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.final_status">
        <p class="w-2/5 text-sm font-semibold">MD Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.final_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Customer ID</p>
        <p class="text-sm" v-text="pageData.user.id"></p>
      </div>
    </div>

    <!-- Vehicle Licenses -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Vehicle Licenses
      </h6>

      <div class="block mb-4" v-for="(item, type) in groupedData" :key="type">
        <h6 class="text-sm font-semibold pb-2 mb-3" v-text="type"></h6>
        <ul class="flex flex-wrap gap-2.5 list-none">
          <li
            v-for="(carReg, index) in item"
            class="p-1.5 bg-blue-200 text-sm rounded-md"
            :key="index"
            v-text="carReg.vehicle_license"
          ></li>
        </ul>
      </div>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <div class="flex flex-col gap-4">
        <img
          v-for="(img, index) in pageData.vehicle_third_party_mobile"
          :key="index"
          :src="img.image_montage"
          alt=""
          class="w-full h-auto bg-gray-600"
        />
      </div>
    </div>

    <!-- Application Approval RM -->
    <div
      class="actionsHolder"
      v-if="
        pageData.status === 'pending' &&
        !pageData.hod_permit_status &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        pageData.assigned_officer == userDetails.userInfo.id &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('decline')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('approve')"
      >
        Recommend Approval
      </button>
    </div>

    <!-- Application Approval HOD -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.hod_permit_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        pageData.assigned_hod == userDetails.userInfo.id &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="declinePermitHod()"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitHod()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Application
        </span>
      </button>
    </div>

    <!-- Legal Approval -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.legal_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 9
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitLegal()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Application
        </span>
      </button>
    </div>

    <!-- User Support Approval -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.hod_permit_status === 'approved' &&
        userDetails.userInfo.admin_role_id == 10 &&
        pageData.Application_pay_status === 'not_paid'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="walletPay()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-else-if="!loadingAction"
        >
          Pay With Wallet
        </span>
      </button>
    </div>

    <!-- Application Approval GM -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.final_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="declinePermitGm()"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Permit
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitGm()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Permit
        </span>
      </button>
    </div>

    <div
      v-if="pageData.final_status === 'approved'"
      class="flex flex-row justify-center gap-4 pb-5"
    >
      <a
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        :href="`${url}generatethirdpartymobile/${pageData.id}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Permit Letter
      </a>
    </div>
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
