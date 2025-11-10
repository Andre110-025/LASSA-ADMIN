<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { useModal } from "vue-final-modal";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useUserStore } from "../../stores/user";
import ScoreThirdPartyApp from "./popups/ScoreThirdPartyApp.vue";
import UserAppDetails from "./UserAppDetails.vue";
import { useHelpers } from "../../helper";
import IconAppStatus from "../icons/IconAppStatus.vue";

const { formatDate } = useHelpers();

const { userDetails } = useUserStore();

const route = useRoute();

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const url = import.meta.env.VITE_API_URL;
const taskAdmin = ref(null);

const appScore = computed(() => {
  if (
    pageData.value.account_score &&
    pageData.value.registry_score &&
    pageData.value.legal_score
  ) {
    return (
      pageData.value.account_score +
      pageData.value.registry_score +
      pageData.value.legal_score
    ).toFixed(2);
  } else {
    return null;
  }
});

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`getexpression/${route.params.id}`);

    if (response.status === 200) {
      // console.log(response);
      pageData.value = response.data.data[0];
      taskAdmin.value = response.data.admins;
      loading.value = false;
    }
  } catch (error) {}
};

// OPERATIONS APPROVE/DECLINE SUBMISSION

const subApproveDecline = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`${actionType}/${pageData.value.id}`);

    if (response.status === 200) {
      if (actionType === "operationapproval") {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Declined", {
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

// Score Popup

const { open: openScore, close: closeScore } = useModal({
  component: ScoreThirdPartyApp,
  attrs: {
    id: route.params.id,
    onConfirm(bol) {
      if (bol) {
        getAppInfo();
      }
      closeScore();
    },
  },
  slots: {},
});

// Department Action

const departmentDecline = async (user) => {
  try {
    loadingAction.value = true;

    function getUrl() {
      if (user === "finance") return "accountdisapproval";
      else if (user === "registry") return "registrydisapproval";
      else if (user === "legal") return "legaldisapproval";
    }

    const response = await axios.post(`${getUrl()}/${pageData.value.id}`);

    if (response.status === 200) {
      toast.success(`${user} disapproval successful`, {
        position: toast.POSITION.TOP_CENTER,
      });

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

// HOD ACTION CALL
const actionHod = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`${actionType}/${pageData.value.id}`);

    if (response.status === 200) {
      if (actionType === "hodapproval") {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Declined", {
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

// GM Actions

const actionGm = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`${actionType}/${pageData.value.id}`);

    if (response.status === 200) {
      if (actionType === "mdapproval") {
        toast.success("Request Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Request Successfully Declined", {
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

const sendCert = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `getthirdpartycertificate/${pageData.value.id}`
    );

    if (response.status === 200) {
      toast.success("Certificate Sent Successfully to User", {
        position: toast.POSITION.TOP_CENTER,
      });

      // await getAppInfo();
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

getAppInfo();
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      THIRD PARTY PRACTITIONER APPLICATION DETAILS
    </h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" />

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Company Name</p>
        <p class="text-sm" v-text="pageData.company_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Company Type</p>
        <p class="text-sm" v-text="pageData.company_type"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Employee Count</p>
        <p class="text-sm" v-text="pageData.employee_count"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Local Government</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Full Address</p>
        <p class="text-sm" v-text="pageData.office_address"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Nearest Bus Stop</p>
        <p class="text-sm" v-text="pageData.nearest_bustop"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.operation_status"
      >
        <p class="w-2/5 text-sm font-semibold">O & I Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.operation_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.legal_status">
        <p class="w-2/5 text-sm font-semibold">Legal Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.legal_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.account_status">
        <p class="w-2/5 text-sm font-semibold">Account Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.account_status" />
        </p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.registry_status"
      >
        <p class="w-2/5 text-sm font-semibold">Registry Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.registry_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="appScore">
        <p class="w-2/5 text-sm font-semibold">Application Score</p>
        <p class="text-sm font-bold" v-text="appScore"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.hod_status">
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.hod_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.md_status">
        <p class="w-2/5 text-sm font-semibold">MD Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.md_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Date</p>
        <p class="text-sm" v-text="formatDate(pageData.created_at)"></p>
      </div>

      <div v-if="pageData.user" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Customer ID</p>
        <p class="text-sm" v-text="pageData.user.id"></p>
      </div>
    </div>

    <div
      class="px-6 bg-mainColor/10 py-2.5 rounded-md"
      v-if="taskAdmin?.length"
    >
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

    <!-- Supporting Document -->
    <div class="p-6 space-y-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Supporting Document
      </h6>

      <div class="flex flex-col gap-2" v-if="pageData.company_profile">
        <p class="text-sm font-semibold">Company Profile</p>
        <embed
          :src="pageData.company_profile"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div class="flex flex-col gap-2" v-if="pageData.technical_competence">
        <p class="text-sm font-semibold">Technical Competence</p>
        <embed
          :src="pageData.technical_competence"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.technical_partner">
        <p class="text-sm font-semibold">Technical Partner</p>
        <embed
          :src="pageData.technical_partner"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.cac_document">
        <p class="text-sm font-semibold">CAC Certificate</p>
        <embed
          :src="pageData.cac_document"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.apcon_document">
        <p class="text-sm font-semibold">Apcon Certificate</p>
        <embed
          :src="pageData.apcon_document"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.outdoor_association">
        <p class="text-sm font-semibold">Outdoor Association Certificate</p>
        <embed
          :src="pageData.outdoor_association"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.audit_report">
        <p class="text-sm font-semibold">Audit Report</p>
        <embed
          :src="pageData.audit_report"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.list_past_project">
        <p class="text-sm font-semibold">List of Past Project</p>
        <embed
          :src="pageData.list_past_project"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.tax_clearance">
        <p class="text-sm font-semibold">Tax Clearance</p>
        <embed
          :src="pageData.tax_clearance"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.evidence_finance">
        <p class="text-sm font-semibold">Financial Evidence</p>
        <embed
          :src="pageData.evidence_finance"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.business_plan">
        <p class="text-sm font-semibold">Business Plan</p>
        <embed
          :src="pageData.business_plan"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.director_bank_statement">
        <p class="text-sm font-semibold">Director's Bank Statement</p>
        <embed
          :src="pageData.director_bank_statement"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div
        class="flex flex-col gap-2"
        v-if="pageData.preliminary_technical_design"
      >
        <p class="text-sm font-semibold">Preliminary Technical Design</p>
        <embed
          :src="pageData.preliminary_technical_design"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div
        class="flex flex-col gap-2"
        v-if="pageData.bank_or_corporate_reference"
      >
        <p class="text-sm font-semibold">Bank or Corporate Reference</p>
        <embed
          :src="pageData.bank_or_corporate_reference"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.technical_reference">
        <p class="text-sm font-semibold">Technical Reference</p>
        <embed
          :src="pageData.technical_reference"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
    </div>

    <!-- Operation Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.operation_status === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Operations'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="subApproveDecline('operationdisapproval')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Interest
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="subApproveDecline('operationapproval')"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Approve Interest
        </span>
      </button>
    </div>

    <!-- Finance Actions -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.operation_status === 'approved' &&
        pageData.account_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 8
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="departmentDecline('finance')"
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
        class="w-full px-5 py-3 bg-green-600 text-sm rounded-md text-white"
        @click="openScore()"
      >
        Score Application
      </button>
    </div>

    <!-- Registry RM Actions -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.operation_status === 'approved' &&
        pageData.registry_status === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="departmentDecline('registry')"
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
        @click="openScore()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Score Application(REG)
      </button>
    </div>

    <!-- Legal Actions -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.operation_status === 'approved' &&
        pageData.legal_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 9
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="departmentDecline('legal')"
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
        @click="openScore()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Score Application
      </button>
    </div>

    <!-- Actions Operations HOD -->
    <div
      class="actionsHolder"
      v-else-if="
        pageData.hod_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Operations'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="actionHod('hoddisapproval')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Disapprove Application
        </span>
      </button>
      <button
        :disabled="loadingAction"
        type="submit"
        @click="actionHod('hodapproval')"
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
        pageData.md_status === 'pending' &&
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        @click="actionGm('mddisapproval')"
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
        @click="actionGm('mdapproval')"
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

    <div
      v-if="pageData.md_status === 'approved'"
      class="flex flex-row justify-center gap-4 px-6 pb-5"
    >
      <a
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        :href="`${url}getthirdpartycertificate/${pageData.id}`"
        target="_blank"
        rel="noopener noreferrer"
        v-if="false"
      >
        Download Certificate
      </a>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="sendCert()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Send Certificate
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
