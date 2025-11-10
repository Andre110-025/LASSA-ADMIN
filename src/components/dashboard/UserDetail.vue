<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import IconSpinner from "../icons/IconSpinner.vue";
import AssignUser from "./popups/AssignUser.vue";
import DebitCreditUser from "./popups/DebitCreditUser.vue";
import EditUser from "./popups/EditUser.vue";

const { userDetails } = useUserStore();
const route = useRoute();
const { formatCurrency } = useHelpers();

const pageData = ref(null);
const arrears = ref({
  total_onpremise: null,
  total_outdoor: null,
  total_small_format: null,
});
const loading = ref(false);
const loadingAction = ref(false);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(`pagegetuserinfo/${route.params.uid}`);

    if (data.success) {
      pageData.value = data.data[0];
      arrears.value = {
        total_onpremise: data.total_onpremise,
        total_outdoor: data.total_outdoor,
        total_small_format: data.total_small_format,
      };

      loading.value = false;
    }
  } catch (error) {}
};

const { open: openTransfer, close } = useModal({
  component: AssignUser,
  attrs: {
    userId: route.params.uid,
    adminId: userDetails.userInfo.id,
    onConfirm() {
      getAppInfo();
      close();
    },
  },
});

const { open: openNotice, close: closeNotice } = useModal({
  component: DebitCreditUser,
  attrs: {
    userId: route.params.uid,
    onConfirm() {
      getAppInfo();
      closeNotice();
    },
  },
});

const openEdit = () => {
  const { open, close: closeEdit } = useModal({
    component: EditUser,
    attrs: {
      userId: route.params.uid,
      userData: {
        first_name: pageData.value?.first_name,
        last_name: pageData.value?.last_name,
        business_name: pageData.value?.business_name,
        phone_number: pageData.value?.phone_number,
        email: pageData.value?.email,
      },
      onConfirm() {
        getAppInfo();
        closeEdit();
      },
    },
  });

  open();
};

const reverseTransfer = async () => {
  try {
    loadingAction.value = true;
    const response = await axios.get(
      `outdoorreversereassign/${route.params.uid}`
    );

    console.log(response);

    if (response.status == 200) {
      toast.success("User Successfully Reassigned", {
        position: toast.POSITION.TOP_CENTER,
      });

      loadingAction.value = false;
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

    loadingAction.value = false;
  }
};

getAppInfo();
</script>

<template>
  <GetData v-if="loading">Getting User Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <!-- <pre v-text="pageData"></pre> -->
    <h4 class="text-sm text-center mb-5">USER DETAILS</h4>

    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex flex-col justify-between w-4/5 h-fit gap-4">
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Business Name</p>
          <p class="text-sm" v-text="pageData.business_name"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Type</p>
          <p
            class="text-sm uppercase"
            v-text="pageData.user_type.replace('_', ' ')"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Business Name</p>
          <p class="text-sm" v-text="pageData.business_name"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Contact First Name</p>
          <p class="text-sm" v-text="pageData.first_name"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Contact Second Name</p>
          <p class="text-sm" v-text="pageData.last_name"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Contact Email</p>
          <p class="text-sm" v-text="pageData.email"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Contact Phone</p>
          <p class="text-sm" v-text="pageData.phone_number"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Verified</p>
          <p
            class="text-sm"
            v-text="pageData.verified_account ? 'YES' : 'NO'"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">KYC Completed</p>
          <p class="text-sm" v-text="pageData.kyc_status ? 'YES' : 'NO'"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Is An Institution</p>
          <p
            class="text-sm"
            v-text="pageData.is_institution ? 'YES' : 'NO'"
          ></p>
        </div>
      </div>
    </div>

    <div class="flex flex-col p-6 gap-4">
      <div>
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Total Arrears
        </h6>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">On Premise</p>
        <p
          class="text-sm text-red-600"
          v-text="formatCurrency(arrears.total_onpremise)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Small Format</p>
        <p
          class="text-sm text-red-600"
          v-text="formatCurrency(arrears.total_small_format)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Outdoor Arrears</p>
        <p
          class="text-sm text-red-600"
          v-text="formatCurrency(arrears.total_outdoor)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Total Arrears</p>
        <p
          class="text-sm text-red-600"
          v-text="
            formatCurrency(
              arrears.total_outdoor +
                arrears.total_small_format +
                arrears.total_onpremise
            )
          "
        ></p>
      </div>
    </div>

    <div
      class="actionsHolder"
      v-if="
        ((((userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
          userDetails.userInfo.id ==
            pageData.kyc_third_party?.assigned_officer) ||
          userDetails.userInfo.admin_role_id == 5) &&
          userDetails.userInfo.department === 'Registry') ||
        userDetails.userInfo.admin_role_id == 7 ||
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        @click="openTransfer()"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        Reassign User
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="reverseTransfer()"
        v-if="
          userDetails.userInfo.id == pageData.kyc_third_party?.assigned_officer
        "
      >
        Reverse Reassignment
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 5) &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        @click="openNotice()"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        Apply Notice
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        userDetails.userInfo.admin_role_id == 6 ||
        userDetails.userInfo.admin_role_id == 7 ||
        userDetails.userInfo.admin_role_id == 10
      "
    >
      <button
        @click="openEdit()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Edit User
      </button>
    </div>
  </div>
</template>
