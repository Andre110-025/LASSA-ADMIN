<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import ConfirmApplication from "./popups/ConfirmApplication.vue";
import ExpressInterest from "./popups/ExpressInterest.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "../../helper";
import UserAppDetails from "./UserAppDetails.vue";

const { userDetails } = useUserStore();
const { dateToSlash } = useHelpers();

const route = useRoute();

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const url = import.meta.env.VITE_API_URL;

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(
      `admingetstreetlampdetails/${route.params.id}`
    );

    if (response.status === 200) {
      // console.log(response);
      pageData.value = response.data.data[0];
      pageData.value.assigned_hod = response.data.assigned_hod;
      loading.value = false;
    }
  } catch (error) {}
};

function openConfirmApplicationPopup(value) {
  const { open, close } = useModal({
    component: ConfirmApplication,
    attrs: {
      type: value,
      advertType: "streetLamp",
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

function openAcceptDeclineInterest(value) {
  const { open, close } = useModal({
    component: ExpressInterest,
    attrs: {
      type: value,
      advertType: "streetLamp",
      id: route.params.id,
      streets: pageData.value.street_lamp_info,
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

// HOD ACTION CALL
const approvePermitHod = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `hodapprovalstreetlamp/${pageData.value.id}`
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
      `hoddeclinestreetlamp/${pageData.value.id}`
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

// Legal Action

const approvePermitLegal = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `legalapprovalforstreetlamp/${pageData.value.id}`
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

// GM Actions
const approvePermitGm = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `finalapproveforstreetlamp/${pageData.value.id}`
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
      `finaldeclineforstreetlamp/${pageData.value.id}`
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
const walletAppPay = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `payslpappwallet/${pageData.value.id}/wa${pageData.value.payment_id}`
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

const walletPermitPay = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `payslppermitwallet/${pageData.value.id}/wa${pageData.value.payment_id}`
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

getAppInfo();
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      STREET LAMP POLE APPLICATION DETAILS
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

      <!-- <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm" v-text="pageData.street_lamp_info[0].type_of_sign"></p>
      </div> -->

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Display</p>
        <p class="text-sm" v-text="pageData.name_of_display"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Expression of Interest</p>
        <p class="text-sm"><IconAppStatus :status="pageData.eoi_status" /></p>
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

      <div v-if="false" class="flex xs:flex-row align-middle">
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
        <p class="w-2/5 text-sm font-semibold">Source of Electricity</p>
        <p class="text-sm" v-text="pageData.source_of_electricity"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.location_of_generator"
      >
        <p class="w-2/5 text-sm font-semibold">Generator Address/Location</p>
        <p class="text-sm" v-text="pageData.location_of_generator"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Customer ID</p>
        <p class="text-sm" v-text="pageData.user.id"></p>
      </div>
    </div>

    <div class="flex flex-col px-6 gap-4">
      <div
        class="flex flex-col gap-2"
        v-if="pageData.authorization_letter_lseb"
      >
        <p class="text-sm font-semibold">
          Authorization Letter from Electricity Supplier
        </p>
        <embed
          :src="pageData.authorization_letter_lseb"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
    </div>

    <!-- Street info and Imagery -->
    <ul>
      <li
        class="flex flex-col p-6 gap-4"
        v-for="(item, index) in pageData.street_lamp_info"
        :key="index"
      >
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Street {{ index + 1 }}
        </h6>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Type of Material</p>
          <p class="text-sm" v-text="item.type_of_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Street Name</p>
          <p class="text-sm" v-text="item.site_address"></p>
        </div>

        <div class="flex xs:flex-row align-middle" v-if="item.street_category">
          <p class="w-2/5 text-sm font-semibold">Street Category</p>
          <p class="text-sm" v-text="item.street_category"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Number of Poles</p>
          <p class="text-sm" v-text="item.number_poles"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Weight</p>
          <p class="text-sm" v-text="item.weight_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Height</p>
          <p class="text-sm" v-text="item.height_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Width</p>
          <p class="text-sm" v-text="item.width_sign"></p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="w-2/5 text-sm font-semibold">Photomontage</p>
          <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
        </div>

        <div class="flex flex-col gap-2" v-if="item.owner_consent">
          <p class="text-sm font-semibold">Street Owner Consent</p>
          <embed
            :src="item.owner_consent"
            width="100%"
            height="100%"
            type="application/pdf"
          />
        </div>
      </li>
    </ul>

    <!-- Expression Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.eoi_status === 'pending' &&
        userDetails.userInfo.department === 'Registry' &&
        pageData.assigned_officer == userDetails.userInfo.id &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3)
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openAcceptDeclineInterest('decline')"
      >
        Decline Interest
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openAcceptDeclineInterest('approve')"
      >
        Approve Interest
      </button>
    </div>
    <!-- Actions RM -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.Application_pay_status === 'paid' &&
        !pageData.hod_permit_status &&
        pageData.status === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
          userDetails.userInfo.department === 'Registry' &&
        pageData.assigned_officer == userDetails.userInfo.id
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
    <!-- Actions HOD -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.hod_permit_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry' &&
        pageData.assigned_hod == userDetails.userInfo.id
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
    <!-- User Support Approval -->
    <div
      class="actionsHolder"
      v-else-if="userDetails.userInfo.admin_role_id == 10"
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="walletAppPay()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        v-if="
          pageData.eoi_status === 'approved' &&
          pageData.Application_pay_status === 'not_paid'
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-else-if="!loadingAction"
        >
          Pay Application Fee
        </span>
      </button>
      <button
        :disabled="loadingAction"
        type="submit"
        @click="walletPermitPay()"
        v-else-if="
          pageData.status === 'approved' &&
          pageData.Application_pay_status === 'paid' &&
          pageData.hod_permit_status === 'approved' &&
          !pageData.legal_status
        "
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-else-if="!loadingAction"
        >
          Pay Permit Fee
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
    <!-- GM Actions -->
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
        :href="`${url}generatestreetlampqrcode/${pageData.id}`"
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
