<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import IconSpinner from "../icons/IconSpinner.vue";
import TemporaryAdvertItem from "./TemporaryAdvertItem.vue";
import GenerateBill from "./popups/GenerateBill.vue";
import TemporaryActions from "./popups/TemporaryActions.vue";
import UserAppDetails from "./UserAppDetails.vue";
import CommentBox from "./buttons/CommentBox.vue";

const route = useRoute();
const { userDetails } = useUserStore();

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const taskAdmin = ref(null);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(
      `admingetonefirstpartytemporaryads/${route.params.id}`
    );

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      taskAdmin.value = response.data.admins;
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

function openTemporaryActions(value, api) {
  const data = {
    type: value,
    endPoint: api,
    id: route.params.id,
    department: pageData.value.assigned_department,
    roleId: userDetails.userInfo.admin_role_id,
  };

  const { open, close } = useModal({
    component: TemporaryActions,
    attrs: {
      compData: data,
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

const adminActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const { data } = await axios.post(`${actionType}/${pageData.value.id}`, {
      accept_price: false,
    });

    if (data.success) {
      if (actionType === "hodrecommendtemporaryadsapproval") {
        toast.success("Application Recommended For Approval", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (actionType === "rmrecommendtemporaryadsapproval") {
        toast.success("Application Recommended For Approval", {
          position: toast.POSITION.TOP_CENTER,
        });
        const { open, close } = useModal({
          component: GenerateBill,
          attrs: {
            id: route.params.id,
            temporalBill: data.data,
            adType: "TemporaryAd",
            onConfirm() {
              getAppInfo();
              close();
            },
          },
          slots: {},
        });

        open();

        return;
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
      TEMPORARY ADVERT APPLICATION DETAILS
    </h4>

    <UserAppDetails v-if="pageData.user" :user="pageData.user" />
    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Applicant(Company)</p>
        <p class="text-sm" v-text="pageData.name_of_company"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address of Company</p>
        <p class="text-sm" v-text="pageData.company_address"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA Of Company</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Service/Product</p>
        <p class="text-sm" v-text="pageData.name_of_service"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Location</p>
        <p class="text-sm capitalize" v-text="pageData.site_location"></p>
      </div>

      <div
        v-if="pageData.rm_recommendation"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">RM Recommendation</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.rm_recommendation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.rm_comment && pageData.rm_recommendation"
        :comments="pageData.rm_comment"
        :currentState="pageData.rm_recommendation"
      />

      <div
        v-if="pageData.hod_recommendation"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">HOD Recommendation</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.hod_recommendation" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.hod_comment && pageData.hod_recommendation"
        :comments="pageData.hod_comment"
        :currentState="pageData.hod_recommendation"
      />

      <div v-if="pageData.md_approval" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">MD Recommendation</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.md_approval" />
        </p>
      </div>

      <CommentBox
        v-if="pageData.md_comment && pageData.md_approval"
        :comments="pageData.md_comment"
        :currentState="pageData.md_approval"
      />

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Type</p>
        <p class="text-sm">Blanket</p>
      </div>

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm">
          {{ pageData.duration }}
        </p>
      </div>

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Blanket Category</p>
        <p class="text-sm">
          {{ pageData.first_party_temporary_ads_details[0].type_sign }}
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.start_date">
        <p class="w-2/5 text-sm font-semibold">Start Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.start_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.end_date">
        <p class="w-2/5 text-sm font-semibold">End Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.end_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
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

    <!-- Advert Details -->
    <div v-if="!pageData.duration" class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Advert Details
      </h6>

      <ul>
        <TemporaryAdvertItem
          v-for="(item, index) in pageData.first_party_temporary_ads_details"
          :key="index"
          :item="item"
          :index="index"
          :editable="
            pageData.application_status === 'disapproved' ||
            pageData.rm_recommendation === 'pending'
          "
          @getUpdate="getAppInfo"
        />
      </ul>
    </div>

    <!-- RM Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.rm_recommendation === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === pageData.assigned_department &&
        (pageData.zone === userDetails.userInfo.zone ||
          pageData.zone === userDetails.userInfo.zone2 ||
          userDetails.userInfo.id == pageData.assigned_officer)
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          openTemporaryActions('decline', 'rmrecommendtemporaryadsdisapproval')
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
          openTemporaryActions('approve', 'rmrecommendtemporaryadsapproval')
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

    <!-- HOD Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.hod_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === pageData.assigned_department
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="
          openTemporaryActions('decline', 'hodrecommendtemporaryadsdisapproval')
        "
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          {{
            pageData.assigned_department === "Registry"
              ? "Return Application"
              : "Disapprove Application"
          }}
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="
          openTemporaryActions('approve', 'hodrecommendtemporaryadsapproval')
        "
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          {{
            pageData.assigned_department === "Registry"
              ? "Recommend Application"
              : "Approve Application"
          }}
        </span>
      </button>
    </div>

    <!-- MD Actions -->
    <div
      class="actionsHolder"
      v-if="
        pageData.md_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6 &&
        pageData.assigned_department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openTemporaryActions('decline', 'mddisapprovaltemporaryads')"
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
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="openTemporaryActions('approve', 'mdapprovaltemporaryads')"
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
