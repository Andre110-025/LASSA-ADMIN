<script setup>
import { reactive, ref } from "vue";
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
import MobileVehicleList from "./MobileVehicleList.vue";
import MobileMontageList from "./MobileMontageList.vue";
import UserAppDetails from "./UserAppDetails.vue";

const { dateToSlash } = useHelpers();

const { userDetails } = useUserStore();

const route = useRoute();

const pageData = ref(null);
// Create an object to store grouped data
const groupedData = ref({});
const groupedArray = ref(null);
const loading = ref(false);
const loadingAction = ref(false);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(
      `admingetmobileadsdetails/${route.params.id}`
    );

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      pageData.value.assigned_hod = response.data.assigned_hod;
      loading.value = false;
      sortVehicle(pageData.value.mobile_ads_vehicle_license);
    }
  } catch (error) {}
};

const sortVehicle = (data) => {
  // Iterate through the array and group objects
  groupedData.value = {};
  groupedArray.value = null;
  data.forEach((item) => {
    const key = `${item.branding_details}_${item.vehicle_type}`;

    // Check if the key exists, if not, create an empty array
    if (!groupedData.value[key]) {
      groupedData.value[key] = [];
    }

    // Push the current object to the array corresponding to the key
    groupedData.value[key].push(item);
  });

  // Convert the grouped data object to an array if needed
  groupedArray.value = Object.values(groupedData.value);

  // console.log(groupedArray.value);
};

getAppInfo();

function openConfirmApplicationPopup(value) {
  const { open, close } = useModal({
    component: ConfirmApplication,
    attrs: {
      type: value,
      advertType: `mobile-firstParty`,
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

    const response = await axios.post(`hodapprovalmobile/${pageData.value.id}`);

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

    const response = await axios.post(`hoddeclinemobile/${pageData.value.id}`);

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
      `legalapprovalformobile/${pageData.value.id}`
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
      `finalapproveformobile/${pageData.value.id}`
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
      `finaldeclineformobile/${pageData.value.id}`
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
      `paymobilewallet/${pageData.value.id}/wa${pageData.value.payment_id}`
    );

    if (response.status === 200) {
      toast.success("Wallet Payment Successful", {
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
      toast.error("Your Payment Could not be confirmed", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};

// User Support Wallet Pay
const submitUpdate = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `submiteditmobileuser/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Application Updated", {
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
      toast.error("Update Could not be submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};

const brandData = reactive({
  brandname: null,
});

const editBrandName = ref(false);

const updateBrandName = async () => {
  if (!brandData.brandname) {
    return;
  }

  loadingAction.value = true;

  try {
    const response = await axios.put(
      `editbrandnamemobile/${pageData.value.id}`,
      brandData
    );
    console.log(response);
    if (response.status === 200) {
      toast.success("Saved! Ensure you Submit Application", {
        position: toast.POSITION.TOP_CENTER,
      });

      pageData.value.brand_name = brandData.brandname;
      brandData.brandname = null;
      editBrandName.value = false;
    }

    loadingAction.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};
</script>

<template>
  <span
    v-if="pageData?.status === 'declined'"
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">MOBILE ADVERT APPLICATION DETAILS</h4>

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

        <div>
          <p
            v-if="!editBrandName"
            class="text-sm"
            v-text="pageData.brand_name"
          ></p>
          <span
            v-if="
              !editBrandName &&
              !pageData.hod_permit_status &&
              (userDetails.userInfo.admin_role_id == 2 ||
                userDetails.userInfo.admin_role_id == 3 ||
                userDetails.userInfo.admin_role_id == 10)
            "
            @click="editBrandName = true"
            class="italic text-xs cursor-pointer"
            >Edit Name</span
          >
          <form
            v-if="editBrandName"
            class="flex gap-2.5"
            @submit.prevent="updateBrandName()"
          >
            <input
              class="text-xs px-1.5 py-2 rounded-md border-2 border-opacity-40 focus:border-opacity-100 border-mainColor outline-none"
              type="text"
              name="brand_name"
              id="brand_name"
              placeholder="Enter Brand Name"
              v-model="brandData.brandname"
            />
            <button :disabled="loadingAction" class="text-xs" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm" v-text="pageData.duration"></p>
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
        Vehicle Information
      </h6>

      <ul class="">
        <MobileVehicleList
          v-for="(vehicleGroup, index) in groupedArray"
          :key="index"
          :finalStatus="pageData.final_status"
          :vehicleData="vehicleGroup"
          :dataIndex="index"
          :appId="pageData.id"
          :status="pageData.hod_permit_status"
          :editable="
            !pageData.hod_permit_status &&
            (userDetails.userInfo.admin_role_id == 2 ||
              userDetails.userInfo.admin_role_id == 3 ||
              userDetails.userInfo.admin_role_id == 10)
          "
          @update="getAppInfo()"
        />
      </ul>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <MobileMontageList
        :montages="pageData.vehicle_mobile"
        :appId="pageData.id"
        :status="pageData.hod_permit_status"
        :editable="
          !pageData.hod_permit_status &&
          (userDetails.userInfo.admin_role_id == 2 ||
            userDetails.userInfo.admin_role_id == 3 ||
            userDetails.userInfo.admin_role_id == 10)
        "
        @update="getAppInfo()"
      />
    </div>

    <!-- Application Approval RM -->
    <div
      class="actionsHolder"
      v-if="
        pageData.status === 'pending' &&
        !pageData.hod_permit_status &&
        (pageData.zone === userDetails.userInfo.zone || pageData.zone === userDetails.userInfo.zone2) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
          userDetails.userInfo.department === 'Mobile_advert'
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
          userDetails.userInfo.department === 'Mobile_advert'
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

    <!-- User Support Update Application -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.status === 'declined' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 10)
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="submitUpdate()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Submit Update
        </span>
      </button>
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
