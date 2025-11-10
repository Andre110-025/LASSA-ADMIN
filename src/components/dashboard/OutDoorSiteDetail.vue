<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import IconSpinner from "../icons/IconSpinner.vue";
import UploadSiteReport from "./popups/UploadSiteReport.vue";
import OutDoorActions from "./popups/OutDoorActions.vue";
import GenerateBill from "./popups/GenerateBill.vue";
import UploadReportExtra from "./popups/UploadReportExtra.vue";
import ExtraGenerateBill from "./popups/ExtraGenerateBill.vue";
import GenerateUpgradeBill from "./popups/GenerateUpgradeBill.vue";
import TransferComp from "./TransferComp.vue";
import OffExpungeComp from "./OffExpungeComp.vue";
import UpDownGradeComp from "./UpDownGradeComp.vue";
import UserAppDetails from "./UserAppDetails.vue";
import CommentBox from "./buttons/CommentBox.vue";
import OutDoorExtraActions from "./popups/OutDoorExtraActions.vue";

const { userDetails } = useUserStore();

const route = useRoute();

const { dateToSlash, formatCurrency } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
const offExpungeData = ref(null);
const upDownGradeData = ref(null);
const transferData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const taskAdmin = ref(null);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(
      `getoneoutdoorapplication/${route.params.id}`
    );

    if (data.success) {
      pageData.value = data.data;
      upDownGradeData.value =
        data.data.third_party_upgrade_and_downgrade[0] || null;
      transferData.value = data.data.third_party_outdoor_transfer[0] || null;
      offExpungeData.value =
        data.data.third_party_off_charge_and_expunction[0] || null;
      loading.value = false;
      taskAdmin.value = data.data.task_admins || null;
    }
  } catch (error) {}
};

// Report Upload

const openSiteInspect = (siteDetail) => {
  const { open: openUpload, close: closeUpload } = useModal({
    component: UploadSiteReport,
    attrs: {
      id: route.params.id,
      siteSpec: siteDetail,
      onConfirm(bol) {
        if (bol) {
          getAppInfo();
        }
        closeUpload();
      },
    },
    slots: {},
  });

  openUpload();
};

// OutdoorActions Upload

const OutDoorActionDialog = (url, value) => {
  const { open, close } = useModal({
    component: OutDoorActions,
    attrs: {
      id: route.params.id,
      endPoint: url,
      type: value,
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
};

// OutdoorExtraActions Upload

const OutDoorExtraActionDialog = (url, value, exId) => {
  const { open, close } = useModal({
    component: OutDoorExtraActions,
    attrs: {
      id: route.params.id,
      endPoint: url,
      type: value,
      extraId: exId,
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
};

// Other reports
const openExtraUpload = (uploadTerm, actId) => {
  const { open, close } = useModal({
    component: UploadReportExtra,
    attrs: {
      id: route.params.id,
      extraId: actId,
      uploadType: uploadTerm,
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
};

function openBilling(obj) {
  const { open, close: closeBilling } = useModal({
    component: GenerateBill,
    attrs: {
      id: route.params.id,
      signData: obj,
      onConfirm(bol) {
        getAppInfo();
        closeBilling();
      },
    },
    slots: {},
  });

  open();
}

function openUpgradeBilling(uploadTerm, actId) {
  const { open, close: closeBilling } = useModal({
    component: GenerateUpgradeBill,
    attrs: {
      id: route.params.id,
      extraId: actId,
      uploadType: uploadTerm,
      signData: upDownGradeData.value,
      onConfirm(bol) {
        getAppInfo();
        closeBilling();
      },
    },
    slots: {},
  });

  open();
}

const openExtraBilling = (uploadTerm, actId) => {
  const { open, close: closeExtraBilling } = useModal({
    component: ExtraGenerateBill,
    attrs: {
      id: route.params.id,
      extraId: actId,
      uploadType: uploadTerm,
      onConfirm() {
        getAppInfo();
        closeExtraBilling();
      },
    },
    slots: {},
  });

  open();
};

getAppInfo();

// Off-charge/Expunge Actions
const offExActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `${actionType}/${pageData.value.id}/${offExpungeData.value.id}`
    );

    if (response.status === 200) {
      if (
        actionType === "complianceapproval" ||
        actionType === "mdapprovalforoffcharges"
      ) {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Disapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
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

// Up/Down grade actions
const upDownActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `${actionType}/${pageData.value.id}/${upDownGradeData.value.id}`
    );

    if (response.status === 200) {
      if (
        actionType === "hodapprovalupgradeordowngrade" ||
        actionType === "mdapprovalupgradeordowngrade" ||
        actionType === "mdfirstapproval"
      ) {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (actionType === "setsiteinspection") {
        toast.success("Site Inspection Completed", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (
        actionType === "hodregbillapproval" ||
        actionType === "hodbillapproval"
      ) {
        toast.success("Bill Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (
        actionType === "hodregbilldisapproval" ||
        actionType === "hodregbilldisapproval"
      ) {
        toast.success("Bill Successfully Sisapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (actionType === "sendupgradeanddowngradebill") {
        toast.success("Upgrade/Downgrade Bill Sent", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (actionType === "sendapprovalletter") {
        toast.success("Approval Letter Sent", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Disapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
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

// Up/Down grade actions
const transferActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `${actionType}/${pageData.value.id}/${transferData.value.id}`
    );

    if (response.status === 200) {
      if (
        actionType === "recommendsitetransferapproval" ||
        actionType === "mdsitetransferapproval"
      ) {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (actionType === "generatebilltransfer") {
        toast.success("Bill Generated and Sent", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Disapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
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
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">OUTDOOR SITE APPLICATION DETAILS</h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" />

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.created_at)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p
          class="text-sm"
          v-text="pageData.purpose_application || 'Application for a new Site'"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Type</p>
        <p class="text-sm" v-text="pageData.type_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address</p>
        <p class="text-sm" v-text="pageData.address_proposed_site"></p>
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.street_category"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Street Category</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.street_category"
        ></p>
      </div>

      <div
        v-if="pageData.installation_date"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Inspection Date</p>
        <p class="text-sm" v-text="pageData.inspection_date"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Certify Status</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.application_certify_status" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.rm_comment1"
        :comments="pageData.rm_comment1"
        :currentState="pageData.application_certify_status"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.hod_recommedation"
      >
        <p class="w-2/5 text-sm font-semibold">HOD First Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_recommedation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.hod_comment1"
        :comments="pageData.hod_comment1"
        :currentState="pageData.hod_recommedation"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.md_first_approval"
      >
        <p class="w-2/5 text-sm font-semibold">MD First Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.md_first_approval" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.md_comment"
        :comments="pageData.md_comment"
        :currentState="pageData.md_first_approval"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.rm_second_recommendation"
      >
        <p class="w-2/5 text-sm font-semibold">RM Second Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.rm_second_recommendation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.rm_comment2"
        :comments="pageData.rm_comment2"
        :currentState="pageData.rm_second_recommendation"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.hod_second_recommendation"
      >
        <p class="w-2/5 text-sm font-semibold">HOD Second Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_second_recommendation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.hod_comment2"
        :comments="pageData.hod_comment2"
        :currentState="pageData.hod_second_recommendation"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.legal_recommendation"
      >
        <p class="w-2/5 text-sm font-semibold">Legal Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.legal_recommendation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.legal_comment"
        :comments="pageData.legal_comment"
        :currentState="pageData.legal_recommendation"
      />

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.md_second_approval"
      >
        <p class="w-2/5 text-sm font-semibold">Final Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.md_second_approval" />
        </p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.hod_bill_generate"
      >
        <p class="w-2/5 text-sm font-semibold">Bill Generation</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_bill_generate" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="false">
        <p class="w-2/5 text-sm font-semibold">Account Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.account_status" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.account_comment"
        :comments="pageData.account_comment"
        :currentState="pageData.account_status"
      />

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Latitude</p>
        <p class="text-sm" v-text="pageData.latitude"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Longitude</p>
        <p class="text-sm" v-text="pageData.longitude"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">North Coordinate</p>
        <p class="text-sm" v-text="pageData.north"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">East Coordinate</p>
        <p class="text-sm" v-text="pageData.east"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner</p>
        <p class="text-sm" v-text="pageData.property_owner_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Email</p>
        <p class="text-sm" v-text="pageData.property_owner_email"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Phone</p>
        <p class="text-sm" v-text="pageData.property_owner_phone"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Consent</p>
        <p
          class="text-sm"
          v-text="pageData.property_owner_consent === 1 ? 'Yes' : 'No'"
        ></p>
      </div>

      <div
        class="flex gap-2"
        style="flex-direction: column"
        v-if="pageData.report_file"
      >
        <p class="text-sm font-semibold">Site Inspection Report</p>
        <embed
          :src="pageData.report_file"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        class="flex gap-2"
        style="flex-direction: column"
        v-if="pageData.property_owner_signature"
      >
        <p class="text-sm font-semibold">Property Owner Signature</p>
        <img
          :src="pageData.property_owner_signature"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>
    </div>

    <div class="px-6 bg-mainColor/10 py-2.5 rounded-md" v-if="taskAdmin">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Assigned Admins
      </h6>

      <div>
        <ul v-if="(typeof taskAdmin != 'string')" class="pl-10">
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

    <!-- Outdoor Site Spec -->
    <div class="flex flex-col p-6 gap-4">
      <div>
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Outdoor Site Specifications
        </h6>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Format</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.signage_format"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Interaction</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.sign_interaction"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Illumination</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.sign_illumination"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of faces</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.number_faces"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Dimension</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.dimension_sign"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Structure Height</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.height_structure"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Length</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.length_sign"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Breadth</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.breadth_sign"
        ></p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img
          :src="pageData.third_party_outdoor_sign_details.photomontage"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.location_map"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">Location Map</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.location_map"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.structural_drawing"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">Structural Drawing</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.structural_drawing"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.eia"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">EIA</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.eia"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.ads_price"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Signage Bill</p>
        <p
          class="text-sm"
          v-text="
            formatCurrency(pageData.third_party_outdoor_sign_details.ads_price)
          "
        ></p>
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.legal_fee_current_year"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Legal Fee</p>
        <p
          class="text-sm"
          v-text="
            formatCurrency(
              pageData.third_party_outdoor_sign_details.legal_fee_current_year
            )
          "
        ></p>
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.ads_price_pyears"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Past Year Bill</p>
        <p
          class="text-sm"
          v-text="
            formatCurrency(
              pageData.third_party_outdoor_sign_details.ads_price_pyears
            )
          "
        ></p>
      </div>
    </div>

    <!-- Offcharge/expunge Request -->
    <OffExpungeComp
      v-if="
        ((pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction') &&
          offExpungeData) ||
        ((pageData.active_status === 'off_charge' ||
          pageData.active_status === 'expunction') &&
          offExpungeData)
      "
      :offExpungeData="offExpungeData"
    />

    <!-- Upgrade/DownGrade Request -->
    <UpDownGradeComp
      v-if="
        pageData.ongoing_request === 'upgrade' ||
        pageData.ongoing_request === 'downgrade' ||
        ((pageData.active_status === 'upgrade' ||
          pageData.active_status === 'downgrade') &&
          upDownGradeData)
      "
      :upDownGradeData="upDownGradeData"
      :adsPrice="pageData.third_party_outdoor_sign_details.ads_price"
      :legalFee="pageData.third_party_outdoor_sign_details.legal_fee"
    />

    <!-- Site Transfer -->
    <TransferComp
      v-if="
        (pageData.ongoing_request === 'transfer' ||
          pageData.active_status === 'transfer') &&
        transferData
      "
      :transferData="transferData"
    />

    <!-- RM Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.application_certify_status === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <!-- <button
        :disabled="loadingAction"
        type="submit"
        @click="OutDoorActionDialog('decertifyoutdoor', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decertify Application
        </span>
      </button> -->

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('certifyoutdoor', 'approve')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Certify Application
        </span>
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        pageData.application_certify_status === 'approved' &&
        !pageData.report_file &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openSiteInspect(pageData.third_party_outdoor_sign_details)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Submit Report
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        pageData.rm_second_recommendation === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <button
        :disabled="loadingAction"
        v-if="false"
        type="submit"
        @click="OutDoorActionDialog('rmseconddisapproval', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('rmsecondapproval', 'approve')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- RM Off CHarge -->
    <div
      class="actionsHolder"
      v-else-if="
        offExpungeData &&
        offExpungeData?.rm_recommedation === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        (pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction') &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="offExActions('compliancedisapproval')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        v-if="false"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Compliance Disapproval
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'rmapprovedrequest',
            'approve',
            offExpungeData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- CP Off CHarge -->
    <div
      class="actionsHolder"
      v-if="
        offExpungeData?.rm_recommedation === 'approved' &&
        offExpungeData?.complaince_confirm_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 11 &&
        (pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openExtraUpload('complianceapproval', offExpungeData.id)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Submit Report
      </button>
    </div>

    <!-- RM Upgrade/Downgrade -->
    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.application_status === 'paid' &&
        upDownGradeData?.site_inspection_status === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="upDownActions('setsiteinspection')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Site Inspected
        </span>
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        !upDownGradeData?.first_assesment &&
        upDownGradeData?.site_inspection_status === 'done' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openExtraUpload('rmassessment', upDownGradeData.id)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Submit Report
      </button>
    </div>

    <!-- Send Bill and approval Letter upgrade-->
    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.hod_billngs === 'approved' &&
        upDownGradeData?.hod_registry === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        v-if="!upDownGradeData?.bill_payment_status"
        :disabled="loadingAction"
        type="submit"
        @click="upDownActions('sendupgradeanddowngradebill')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Send Bill
        </span>
      </button>
      <!-- <button
        v-else-if="upDownGradeData?.bill_payment_status === 'paid'"
        :disabled="loadingAction"
        type="submit"
        @click="upDownActions('sendapprovalletter')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Send Approval Letter
        </span>
      </button> -->
    </div>

    <!-- RM Transfer Actions -->
    <div
      class="actionsHolder"
      v-if="
        transferData &&
        !transferData?.rm_recommendation &&
        pageData.ongoing_request === 'transfer' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == pageData.assigned_officer
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'recommendsitetransferdisapproval',
            'decline',
            transferData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        v-if="false"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Disapprove
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'recommendsitetransferapproval',
            'approve',
            transferData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Approval
        </span>
      </button>
    </div>

    <!-- HOD Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.hod_recommedation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="OutDoorActionDialog('hoddisapproverecommend', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('hodappoverecommend', 'approve')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        pageData.hod_second_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="OutDoorActionDialog('hodseconddisapproval', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('hodsecondapproval', 'approve')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- HOD Off Charge and Expunge -->
    <div
      class="actionsHolder"
      v-if="
        offExpungeData?.hod_recommedation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry' &&
        (pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'hoddisapproverequest',
            'decline',
            offExpungeData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'hodapprovedrequest',
            'approve',
            offExpungeData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- HOD Upgrade / Downgrade -->
    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.first_assesment &&
        upDownGradeData?.second_assessment &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry' &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openExtraUpload('houassessmentreport', upDownGradeData.id)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Submit Report
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.hod_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry' &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'hoddisapprovalupgradeordowngrade',
            'decline',
            upDownGradeData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        v-if="false"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Disapproval
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'hodapprovalupgradeordowngrade',
            'approve',
            upDownGradeData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        !upDownGradeData?.hod_registry &&
        upDownGradeData?.hod_billngs === 'approved' &&
        upDownGradeData?.bill_status === 'generated' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="upDownActions('hodregbilldisapproval')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Bill
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="upDownActions('hodregbillapproval')"
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

    <!-- HOD Transfer -->
    <div
      class="actionsHolder"
      v-if="
        transferData?.hod_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry' &&
        pageData.ongoing_request === 'transfer'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'hodrecommendsitetransferdisapproval',
            'decline',
            transferData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'hodrecommendsitetransferapproval',
            'approve',
            transferData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- Legal Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.legal_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 9
      "
    >
      <button
        :disabled="loadingAction"
        v-if="false"
        type="submit"
        @click="OutDoorActionDialog('legaloutdoordisapproval', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Return Application
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('legaloutdoorapproval', 'approve')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Recommend Application
        </span>
      </button>
    </div>

    <!-- MD Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.md_first_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="OutDoorActionDialog('mdfirstdisapproval', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
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
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('mdfirstapproval', 'approve')"
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

    <div
      class="actionsHolder"
      v-if="
        pageData.md_second_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="OutDoorActionDialog('mdseconddisapproval', 'decline')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
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
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('mdsecondapproval', 'approve')"
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

    <!-- MD Off CHarge -->
    <div
      class="actionsHolder"
      v-if="
        offExpungeData?.md_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6 &&
        (pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'mddisapprovalforoffcharges',
            'decline',
            offExpungeData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Disapprove
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'mdapprovalforoffcharges',
            'approve',
            offExpungeData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve
        </span>
      </button>
    </div>

    <!-- MD Up/Down Grade Actions -->

    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.md_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6 &&
        (pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'mddisapprovalupgradeordowngrade',
            'decline',
            upDownGradeData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'mdapprovalupgradeordowngrade',
            'approve',
            upDownGradeData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve
        </span>
      </button>
    </div>

    <!-- MD Transfer Actions -->
    <div
      class="actionsHolder"
      v-if="
        transferData?.md_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6 &&
        pageData.ongoing_request === 'transfer'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          OutDoorExtraActionDialog(
            'mdsitetransferdisapproval',
            'decline',
            transferData.id
          )
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Disapprove Transfer
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          OutDoorExtraActionDialog(
            'mdsitetransferapproval',
            'approve',
            transferData.id
          )
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Transfer
        </span>
      </button>
    </div>

    <!-- Rm Billing Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.md_second_approval === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Billings' &&
        !pageData.bill_generated
      "
    >
      <button
        type="button"
        @click="openBilling(pageData.third_party_outdoor_sign_details)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Generate Bill
      </button>
    </div>

    <!-- RM Offcharge Bill -->
    <div
      class="actionsHolder"
      v-if="
        offExpungeData?.site_submission &&
        offExpungeData?.compliance_report &&
        offExpungeData?.md_approval === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Billings' &&
        !offExpungeData?.offcharge_expunction_bill
      "
    >
      <button
        type="button"
        @click="openExtraBilling('generateoffchargebill', offExpungeData.id)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Generate Bill
      </button>

      <!-- &&
      !offExpungeData?.bill_generated -->
    </div>

    <!-- RM up/down grade Bill -->
    <div
      class="actionsHolder"
      v-if="
        upDownGradeData?.md_approval === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Billings' &&
        !upDownGradeData?.bill_status
      "
    >
      <button
        type="button"
        @click="
          openUpgradeBilling(
            'billingforupgradeanddowngrade',
            upDownGradeData.id
          )
        "
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Generate Bill
      </button>
    </div>

    <!-- HOD Billing Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.hod_bill_generate === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Billings' &&
        pageData.bill_generated
      "
    >
      <button
        type="button"
        @click="openBilling(pageData.third_party_outdoor_sign_details)"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Review Bill
      </button>
    </div>

    <!-- HOD up/down grade Bill -->
    <div
      class="actionsHolder"
      v-if="
        !upDownGradeData?.hod_billngs &&
        upDownGradeData?.bill_status === 'generated' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="upDownActions('hodbilldisapproval')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Bill
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="upDownActions('hodbillapproval')"
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

    <!-- Transfer Bill Generation -->
    <!-- <div
      class="actionsHolder"
      v-if="
        transferData?.md_approval === 'approved' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Billings' &&
        !transferData?.transfer_bill &&
        pageData.ongoing_request === 'transfer'
      "
    >
      <button
        type="button"
        :disabled="loadingAction"
        @click="transferActions('generatebilltransfer')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Generate Bill
        </span>
      </button>
    </div> -->

    <!-- Account Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.hod_bill_generate === 'approved' &&
        pageData.account_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 8 &&
        pageData.bill_generated
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="OutDoorActionDialog('accountapproval', 'approve')"
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
  </div>
</template>
