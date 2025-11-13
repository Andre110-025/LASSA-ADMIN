<script setup>
import { ref, reactive, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import ConfirmApplication from "./popups/ConfirmApplication.vue";
import OnPremiseActions from "./popups/OnPremiseActions.vue";
import { useUserStore } from "../../stores/user";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import CommentBox from "./buttons/CommentBox.vue";
import UserAppDetails from "./UserAppDetails.vue";
import PremiseItemInfo from "./PremiseItemInfo.vue";
import PremiseEditGeneral from "./PremiseEditGeneral.vue";

const { dateToSlash, formatCurrency } = useHelpers();

const { userDetails } = useUserStore();
const route = useRoute();

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const editGeneral = ref(false);
const changeBill = ref(false);
const removalData = ref(null);
const additionalSignData = ref(null);
const changeData = ref(null);
const ad_Price = ref(null);
const past_Price = ref(null);
const remove_Price = ref(null);
const editGen = ref(null);
const taskAdmin = ref(null);

const changeBillData = reactive({
  price: null,
  to_remove_ads_price: null,
});

const getAppInfo = async () => {
  loading.value = true;
  editGeneral.value = false;

  try {
    const response = await axios.get(
      `admingetonpremisedetails/${route.params.id}`
    );
    console.log(response)

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      removalData.value = pageData.value.on_premise_removal[0] || null;
      additionalSignData.value =
        pageData.value.on_premise_additional[0] || null;
      changeData.value = pageData.value.on_premise_change[0] || null;
      ad_Price.value = response.data.ads_price;
      past_Price.value = response.data.previous_years;
      remove_Price.value = response.data.to_remove_ads_price;
      taskAdmin.value = response.data.admins;

      if (changeData.value) {
        changeBillData.price = changeData.value.ratetoadd;
        changeBillData.to_remove_ads_price = changeData.value.ratetoremove;
      }
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

function openConfirmApplicationPopup(value, type = null) {
  const { open, close } = useModal({
    component: ConfirmApplication,
    attrs: {
      type: value,
      advertType: type || "premise",
      id: route.params.id,
      signList: pageData.value.onpremise_info,
      street: pageData.value.sign_address,
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

function openOnPremiseActions(value, api) {
  const { open, close } = useModal({
    component: OnPremiseActions,
    attrs: {
      type: value,
      endPont: api,
      advertPrice: ad_Price.value,
      pastPrice: past_Price.value,
      removePrice: remove_Price.value,
      id: route.params.id,
      signList: pageData.value.onpremise_info,
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
// Billing Approval
const approvePermitBill = async (url) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`${url}/${pageData.value.id}`);

    if (response.status === 200) {
      toast.success("Bill Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
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
    console.log(error);
    loadingAction.value = false;
  }
};

async function approveChangeBill() {
  loadingAction.value = true;

  try {
    const response = await axios.post(
      `approvechangebillingonpremise/${pageData.value.id}`,
      changeBillData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Bill Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      changeBill.value = false;

      getAppInfo();
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
    loadingAction.value = false;
  }
}

// Account Approval
const approvePermitAccount = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `approveaccountonpremise/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Bill Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
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
    console.log(error);
    loadingAction.value = false;
  }
};

const scrollToEdit = async () => {
  editGeneral.value = true;

  if (editGeneral.value) {
    await nextTick();

    if (editGen.value?.$el) {
      editGen.value.$el.scrollIntoView({
        behavior: "smooth",
      });
    }
  }
};
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">ON-PREMISE APPLICATION DETAILS</h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" :business_name="pageData.business_name" />

    <!-- General info -->
    <div
      v-if="!editGeneral"
      class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2"
    >
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Process</p>
        <p class="text-sm" v-text="pageData.purpose_of_application"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Address</p>
        <p class="text-sm" v-text="pageData.sign_address"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.street_category"
      >
        <p class="w-2/5 text-sm font-semibold">Street Category</p>
        <p class="text-sm" v-text="pageData.street_category"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.installation_date"
      >
        <p class="w-2/5 text-sm font-semibold">Installation Date</p>
        <p class="text-sm" v-text="pageData.installation_date"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.app_history.bank_and_others"
      >
        <p class="w-2/5 text-sm font-semibold">Bank or Telecoms</p>
        <p class="text-sm" v-text="pageData.app_history.bank_and_others"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.app_history.product_on_sign"
      >
        <p class="w-2/5 text-sm font-semibold">Product on Display</p>
        <p class="text-sm" v-text="pageData.app_history.product_on_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">BM Status</p>
        <p class="text-sm"><IconAppStatus :status="pageData.status" /></p>
      </div>

      <CommentBox
        v-if="pageData.bm_comment"
        :current-state="pageData.status"
        :comments="pageData.bm_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="pageData.rm_status">
        <p class="w-2/5 text-sm font-semibold">RM Recommendation</p>
        <p class="text-sm">
          <IconAppStatus
            :status="
              pageData.rm_status === 'approved'
                ? 'completed'
                : pageData.rm_status
            "
          />
        </p>
      </div>

      <CommentBox
        v-if="pageData.rm_comment"
        :current-state="pageData.rm_status"
        :comments="pageData.rm_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="pageData.hod_status">
        <p class="w-2/5 text-sm font-semibold">HOD Recommendation</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_status" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.hod_comment"
        :current-state="pageData.hod_status"
        :comments="pageData.hod_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="pageData.billing_status">
        <p class="w-2/5 text-sm font-semibold">Bill Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.billing_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.account_status">
        <p class="w-2/5 text-sm font-semibold">Account Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.account_status" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.account_comment"
        :current-state="pageData.account_status"
        :comments="pageData.account_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="pageData.audit_status">
        <p class="w-2/5 text-sm font-semibold">Audit Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.audit_status" /></p>
      </div>

      <CommentBox
        v-if="pageData.audit_comment"
        :currentState="pageData.audit_status"
        :comments="pageData.audit_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="pageData.due_date">
        <p class="w-2/5 text-sm font-semibold">Due Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.due_date)"></p>
      </div>

      <div
        v-if="pageData.status === 'pending'"
        class="flex flex-row justify-center gap-4 pb-5"
      >
        <button
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
          @click="scrollToEdit()"
        >
          Edit General Info
        </button>
      </div>
    </div>

    <PremiseEditGeneral
      :appInfo="pageData"
      @getUpdate="getAppInfo()"
      :appID="pageData.id"
      ref="editGen"
      v-else
    />

    <div class="px-6 bg-mainColor/10 py-2.5 rounded-md" v-if="taskAdmin">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Assigned Admins
      </h6>

      <div>
        <ul v-if="typeof taskAdmin != 'string'" class="pl-10">
          <li
            class="list-[square]"
            v-for="(admin, index) in taskAdmin"
            :key="index"
          >
            {{ admin.first_name }} {{ admin.last_name }}
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500">
          {{ taskAdmin }}
        </p>
      </div>
    </div>

    <!-- Property Description -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Property Description
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Type</p>
        <p class="text-sm" v-text="pageData.property_type"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Property Owner</p>
        <p class="text-sm" v-text="pageData.name_of_owner"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner Phone No.</p>
        <p class="text-sm" v-text="pageData.phone_number"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.email">
        <p class="w-2/5 text-sm font-semibold">Property Owner Email</p>
        <p class="text-sm" v-text="pageData.email"></p>
      </div>
    </div>

    <!-- Signage info and Imagery -->
    <ul>
      <PremiseItemInfo
        v-for="(item, index) in pageData.onpremise_info"
        :key="index"
        :compData="{
          premiseItem: item,
          pageData: pageData,
          changeData: changeData,
          additionalSignData: additionalSignData,
          index: index,
        }"
        @getUpdate="getAppInfo()"
      />
    </ul>

    <!-- Bill Description -->
    <div
      v-if="
        pageData.billing_status == 'approved' &&
        pageData.audit_status !== 'approved'
      "
      class="flex flex-col p-6 gap-4 fxfcol"
    >
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Bill Information
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Arrears</p>
        <p class="text-sm text-red-600" v-text="formatCurrency(past_Price)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Current Year Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price - past_Price)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Total Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price)"></p>
      </div>
    </div>

    <!-- Removal Process -->
    <div
      v-if="pageData.purpose_of_application === 'Sign Removal'"
      class="flex flex-col p-6 gap-4 fxfcol"
    >
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Removal Process
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">BM Status</p>
        <p class="text-sm"><IconAppStatus :status="removalData.status" /></p>
      </div>

      <CommentBox
        v-if="removalData.bm_comment"
        :comments="removalData.bm_comment"
        :currentState="removalData.status"
      />

      <div class="flex xs:flex-row align-middle" v-if="removalData.cp_status">
        <p class="w-2/5 text-sm font-semibold">CE Approval</p>
        <p class="text-sm"><IconAppStatus :status="removalData.cp_status" /></p>
      </div>

      <CommentBox
        v-if="removalData.cp_comment"
        :comments="removalData.cp_comment"
        :currentState="removalData.cp_status"
      />

      <div class="flex xs:flex-row align-middle" v-if="removalData.rm_status">
        <p class="w-2/5 text-sm font-semibold">RM Approval</p>
        <p class="text-sm"><IconAppStatus :status="removalData.rm_status" /></p>
      </div>

      <CommentBox
        v-if="removalData.rm_comment"
        :comments="removalData.rm_comment"
        :currentState="removalData.rm_status"
      />

      <div class="flex xs:flex-row align-middle" v-if="removalData.hod_status">
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="removalData.hod_status" />
        </p>
      </div>

      <CommentBox
        v-if="removalData.hod_comment"
        :comments="removalData.hod_comment"
        :currentState="removalData.hod_status"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="removalData.billing_status"
      >
        <p class="w-2/5 text-sm font-semibold">Bill Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="removalData.billing_status" />
        </p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="removalData.audit_status"
      >
        <p class="w-2/5 text-sm font-semibold">Audit Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="removalData.audit_status" />
        </p>
      </div>
    </div>

    <!-- Additional Sign Process -->
    <div
      v-if="pageData.purpose_of_application === 'Additional Sign'"
      class="flex flex-col p-6 gap-4 fxfcol"
    >
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Additional Sign Process
      </h6>

      <div
        v-if="additionalSignData.installation_date"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Installation Date</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.installation_date" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">BM Status</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.bm_comment"
        :currentState="additionalSignData.status"
        :comments="additionalSignData.bm_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.cp_status"
      >
        <p class="w-2/5 text-sm font-semibold">CE Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.cp_status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.cp_comment"
        :currentState="additionalSignData.cp_status"
        :comments="additionalSignData.cp_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.rm_status"
      >
        <p class="w-2/5 text-sm font-semibold">RM Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.rm_status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.rm_comment"
        :currentState="additionalSignData.rm_status"
        :comments="additionalSignData.rm_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.hod_status"
      >
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.hod_status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.hod_comment"
        :currentState="additionalSignData.hod_status"
        :comments="additionalSignData.hod_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.billing_status"
      >
        <p class="w-2/5 text-sm font-semibold">Bill Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.billing_status" />
        </p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.account_status"
      >
        <p class="w-2/5 text-sm font-semibold">Account Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.account_status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.account_comment"
        :currentState="additionalSignData.account_status"
        :comments="additionalSignData.account_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="additionalSignData.audit_status"
      >
        <p class="w-2/5 text-sm font-semibold">Audit Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="additionalSignData.audit_status" />
        </p>
      </div>

      <CommentBox
        v-if="additionalSignData.audit_comment"
        :currentState="additionalSignData.audit_status"
        :comments="additionalSignData.audit_comment"
      />

      <div
        v-if="additionalSignData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Past Year Bill</p>
        <p class="text-sm" v-text="formatCurrency(past_Price)"></p>
      </div>

      <div
        v-if="additionalSignData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Current Year Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price - past_Price)"></p>
      </div>

      <div
        v-if="additionalSignData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Total Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price)"></p>
      </div>
    </div>

    <!-- Change of Sign Process -->
    <div
      v-if="pageData.purpose_of_application === 'Change of Sign'"
      class="flex flex-col p-6 gap-4 fxfcol"
    >
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Change of Sign Process
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">BM Status</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.status" />
        </p>
      </div>

      <CommentBox
        v-if="changeData.bm_comment"
        :currentState="changeData.status"
        :comments="changeData.bm_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="changeData.cp_status">
        <p class="w-2/5 text-sm font-semibold">CE Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.cp_status" />
        </p>
      </div>

      <CommentBox
        v-if="changeData.cp_comment"
        :currentState="changeData.cp_status"
        :comments="changeData.cp_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="changeData.rm_status">
        <p class="w-2/5 text-sm font-semibold">RM Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.rm_status" />
        </p>
      </div>

      <CommentBox
        v-if="changeData.rm_comment"
        :currentState="changeData.rm_status"
        :comments="changeData.rm_comment"
      />

      <div class="flex xs:flex-row align-middle" v-if="changeData.hod_status">
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.hod_status" />
        </p>
      </div>

      <CommentBox
        v-if="changeData.hod_comment"
        :currentState="changeData.hod_status"
        :comments="changeData.hod_comment"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="changeData.billing_status"
      >
        <p class="w-2/5 text-sm font-semibold">Bill Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.billing_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="changeData.audit_status">
        <p class="w-2/5 text-sm font-semibold">Audit Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="changeData.audit_status" />
        </p>
      </div>

      <CommentBox
        v-if="changeData.audit_comment"
        :currentState="changeData.audit_status"
        :comments="changeData.audit_comment"
      />

      <div
        v-if="changeData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Past Year Bill</p>
        <p class="text-sm" v-text="formatCurrency(past_Price)"></p>
      </div>

      <div
        v-if="changeData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Current Year Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price - past_Price)"></p>
      </div>

      <div
        v-if="changeData.account_status"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Total Bill</p>
        <p class="text-sm" v-text="formatCurrency(ad_Price)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm" v-text="changeData.type_of_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Sign(s)</p>
        <p class="text-sm" v-text="changeData.number_of_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Dimension in meters</p>
        <p
          class="text-sm"
          v-text="changeData.length_in_meter * changeData.width_in_meter"
        ></p>
      </div>

      <div style="flex-direction: column" class="flex gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img
          :src="changeData.photo_montage"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div v-if="changeData.ratetoremove" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Bill to Remove</p>
        <p class="text-sm" v-text="formatCurrency(changeData.ratetoremove)"></p>
      </div>

      <div v-if="changeData.ratetoadd" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Rate</p>
        <p class="text-sm" v-text="formatCurrency(changeData.ratetoadd)"></p>
      </div>

      <div
        class="actionsHolder"
        v-if="
          changeData?.billing_status === 'pending' &&
          changeData?.hod_status === 'approved' &&
          (userDetails.userInfo.admin_role_id == 2 ||
            userDetails.userInfo.admin_role_id == 3) &&
          userDetails.userInfo.department === 'Billings' &&
          !changeBill
        "
      >
        <button
          class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
          @click="changeBill = true"
        >
          Review/Submit Bill
        </button>
      </div>

      <form @submit.prevent="approveChangeBill()" v-else-if="changeBill">
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Review Billing
        </h6>

        <div class="inputHolder px-6">
          <input
            type="number"
            min="5000"
            placeholder=""
            class="input peer"
            id="ratetoremove"
            autocomplete="off"
            v-model="changeBillData.to_remove_ads_price"
            step="0.01"
            required
          />
          <label for="ratetoremove" class="inputLabel">Amount to Remove</label>
        </div>

        <div class="inputHolder px-6">
          <input
            type="number"
            min="5000"
            placeholder=""
            class="input peer"
            id="ratetoadd"
            autocomplete="off"
            v-model="changeBillData.price"
            step="0.01"
            required
          />
          <label for="ratetoadd" class="inputLabel">Sign Rate</label>
        </div>

        <!-- Billing Change of Sign -->
        <div class="actionsHolder">
          <button
            class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
            type="submit"
            :disabled="loadingAction"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

    <!-- BM -->
    <div
      class="actionsHolder"
      v-if="
        pageData.status === 'pending' &&
        ((pageData.lga === userDetails.userInfo.lga &&
          !pageData.user.is_institution) ||
          ((pageData.zone === userDetails.userInfo.zone ||
            pageData.zone === userDetails.userInfo.zone2) &&
            userDetails.userInfo.lga === 'Other')) &&
        userDetails.userInfo.admin_role_id == 1
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('decline')"
      >
        Return Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('approve')"
      >
        Approve Application
      </button>
    </div>

    <!-- BM Removal-->
    <div
      class="actionsHolder"
      v-if="
        removalData?.status === 'pending' &&
        ((pageData.lga === userDetails.userInfo.lga &&
          !pageData.user.is_institution) ||
          ((pageData.zone === userDetails.userInfo.zone ||
            pageData.zone === userDetails.userInfo.zone2) &&
            userDetails.userInfo.lga === 'Other')) &&
        userDetails.userInfo.admin_role_id == 1
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('decline', 'removeOnpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('approve', 'removeOnpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- BM Additional Sign-->
    <div
      class="actionsHolder"
      v-if="
        additionalSignData?.status === 'pending' &&
        ((pageData.lga === userDetails.userInfo.lga &&
          !pageData.user.is_institution) ||
          ((pageData.zone === userDetails.userInfo.zone ||
            pageData.zone === userDetails.userInfo.zone2) &&
            userDetails.userInfo.lga === 'Other')) &&
        userDetails.userInfo.admin_role_id == 1
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('decline', 'addOnPremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('approve', 'addOnPremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- BM Change of Sign-->
    <div
      class="actionsHolder"
      v-if="
        changeData?.status === 'pending' &&
        ((pageData.lga === userDetails.userInfo.lga &&
          !pageData.user.is_institution) ||
          ((pageData.zone === userDetails.userInfo.zone ||
            pageData.zone === userDetails.userInfo.zone2) &&
            userDetails.userInfo.lga === 'Other')) &&
        userDetails.userInfo.admin_role_id == 1
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('decline', 'changeOnPremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openConfirmApplicationPopup('approve', 'changeOnPremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- Compliance Removal -->
    <div
      class="actionsHolder"
      v-if="
        removalData?.cp_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 11
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'removeOnpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approveremovalcponpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- Compliance Additional Sign -->
    <div
      class="actionsHolder"
      v-if="
        additionalSignData?.cp_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 11
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinedadditionalonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approveadditionalcponpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- Compliance Change of Sign -->
    <div
      class="actionsHolder"
      v-if="
        changeData?.cp_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 11
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinechangeonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approvechangecponpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- RM M&I -->
    <div
      class="actionsHolder"
      v-if="
        pageData.rm_status === 'pending' &&
        pageData.status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinedonpremise')"
      >
        Return Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approvermonpremise')"
      >
        Recommend Application
      </button>
    </div>

    <!-- RM M&I Removal -->
    <div
      class="actionsHolder"
      v-if="
        removalData?.rm_status === 'pending' &&
        removalData?.cp_status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'removeOnpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approveremovalrmonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- RM M&I Additional Sign -->
    <div
      class="actionsHolder"
      v-if="
        additionalSignData?.rm_status === 'pending' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinedadditionalonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approveadditionalrmonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- RM M&I Change of Sign -->
    <div
      class="actionsHolder"
      v-if="
        changeData?.rm_status === 'pending' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinechangeonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approvechangermonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- HOD M&I -->
    <div
      class="actionsHolder"
      v-if="
        pageData.hod_status === 'pending' &&
        pageData.rm_status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinedonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approvehodonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- HOD M&I Removal -->
    <div
      class="actionsHolder"
      v-if="
        removalData?.hod_status === 'pending' &&
        removalData?.rm_status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'removeOnpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approveremovalhodonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- HOD M&I Additional -->
    <div
      class="actionsHolder"
      v-if="
        additionalSignData?.hod_status === 'pending' &&
        additionalSignData?.rm_status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinedadditionalonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="
          openOnPremiseActions('approve', 'approveadditionalhodonpremise')
        "
      >
        Approve Application
      </button>
    </div>

    <!-- HOD M&I Change of Sign -->
    <div
      class="actionsHolder"
      v-if="
        changeData?.hod_status === 'pending' &&
        changeData?.rm_status === 'approved' &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2) &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'M_I'
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('decline', 'declinechangeonpremise')"
      >
        Decline Application
      </button>
      <button
        class="px-5 py-3 bg-green-600 text-sm rounded-md text-white grow"
        @click="openOnPremiseActions('approve', 'approvechangehodonpremise')"
      >
        Approve Application
      </button>
    </div>

    <!-- Billing -->
    <div
      class="actionsHolder"
      v-if="
        pageData.billing_status === 'pending' &&
        pageData.hod_status === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 5) &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitBill('approvebillingonpremise')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Bill
        </span>
      </button>
    </div>

    <!-- Billing Removal -->
    <div
      class="actionsHolder"
      v-if="
        removalData?.billing_status === 'pending' &&
        removalData?.hod_status === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 5) &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="
          openOnPremiseActions('approve', 'approveremovebillingonpremise')
        "
      >
        Review Bill
      </button>
    </div>

    <!-- Billing Additional Sign -->
    <div
      class="actionsHolder"
      v-if="
        additionalSignData?.billing_status === 'pending' &&
        additionalSignData?.hod_status === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 5) &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitBill('approveadditionalbillingonpremise')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Bill
        </span>
      </button>
    </div>

    <!-- Account Approval -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.account_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 8
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openOnPremiseActions('approve', 'approveaccountonpremise')"
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

    <!-- Account Approval Additional Sign -->
    <div
      class="actionsHolder"
      v-else-if="
        additionalSignData?.account_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 8
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="approvePermitAccount('approveadditionalaccountonpremise')"
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

    <!-- Audit -->
    <div
      class="actionsHolder"
      v-else-if="
        userDetails.userInfo.admin_role_id == 4 &&
        pageData.audit_status === 'pending'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="openOnPremiseActions('decline', 'declinedonpremise')"
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
        @click="openOnPremiseActions('approve', 'approveauditonpremise')"
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

    <!-- Audit Removal -->
    <div
      class="actionsHolder"
      v-else-if="
        userDetails.userInfo.admin_role_id == 4 &&
        removalData?.audit_status === 'pending'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="openOnPremiseActions('decline', 'removeOnpremise')"
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
        @click="openOnPremiseActions('approve', 'approveremovalauditonpremise')"
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

    <!-- Audit Additional Sign -->
    <div
      class="actionsHolder"
      v-else-if="
        userDetails.userInfo.admin_role_id == 4 &&
        additionalSignData?.audit_status === 'pending'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="openOnPremiseActions('decline', 'declinedadditionalonpremise')"
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
        @click="
          openOnPremiseActions('approve', 'approveadditionalauditonpremise')
        "
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

    <!-- Audit Change of Sign -->
    <div
      class="actionsHolder"
      v-else-if="
        userDetails.userInfo.admin_role_id == 4 &&
        changeData?.audit_status === 'pending'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="openOnPremiseActions('decline', 'declinechangeonpremise')"
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
        @click="openOnPremiseActions('approve', 'approvechangeauditonpremise')"
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
