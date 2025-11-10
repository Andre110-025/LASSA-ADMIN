<script setup>
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useUserStore } from "../../stores/user";
import IconSpinner from "../icons/IconSpinner.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import GenerateSmallBill from "./popups/GenerateSmallBill.vue";
import { useModal } from "vue-final-modal";
import { useHelpers } from "../../helper";
import SmallFormatActions from "./popups/SmallFormatActions.vue";
import CommentBox from "./buttons/CommentBox.vue"

const { formatCurrency } = useHelpers();

const { userDetails } = useUserStore();

const props = defineProps({
  inspectStatus: String,
  assignedOfficer: String,
  item: Object,
  index: Number,
  editable: {
    default: false,
    type: Boolean,
  },
});

const loadingAction = ref(false);

const emit = defineEmits(["getUpdate"]);

const certifyActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const { data } = await axios.post(
      `${actionType}/${props.item.small_format_ads_id}/${props.item.id}`
    );

    if (data.success) {
      if (actionType === "admincertifyapplication") {
        toast.success("Application Successfully Certified", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Application Successfully Decertified", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emit("getUpdate");
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

const adminActions = async (actionType) => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`${actionType}/${props.item.id}`);

    if (response.status === 200) {
      if (
        actionType === "registryapprovesmallformat" ||
        actionType === "mdsmallformatdetailsapproval"
      ) {
        toast.success("Application Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Application Successfully Disapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emit("getUpdate");
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

function openSmallFormatActions(value, api) {
  const data = {
    type: value,
    endPoint: api,
    id: props.item.id,
    smallId: props.item.small_format_ads_id
  };

  const { open, close } = useModal({
    component: SmallFormatActions,
    attrs: {
      compData: data,
      onConfirm(bol) {
        if (bol) {
          emit('getUpdate')
        }
        close();
      },
    },
    slots: {},
  });
  open();
}

const { open: openBilling, close: closeBilling } = useModal({
  component: GenerateSmallBill,
  attrs: {
    id: props.item.id,
    signCost: props.item.ads_price,
    renewalCost: props.item.annual_price,
    onConfirm() {
      emit("getUpdate");
      closeBilling();
    },
  },
  slots: {},
});
</script>

<template>
  <li class="">
    <h6 class="font-medium text-sm mb-5">
      Small Format Advert Type {{ props.index + 1 }}
    </h6>

    <div class="flex flex-col gap-4">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Certify Status</p>
        <p class="text-sm">
          <IconAppStatus :status="item.certify_application" />
        </p>
      </div>

      <CommentBox v-if="item.rm_comment && item.certify_application" :comments="item.rm_comment" :currentState="item.certify_application" />

      <div class="flex xs:flex-row align-middle" v-if="item.hod_recommendation">
        <p class="w-2/5 text-sm font-semibold">HOD Recommendation</p>
        <p class="text-sm">
          <IconAppStatus :status="item.hod_recommendation" />
        </p>
      </div>

      <CommentBox v-if="item.hod_comment && item.hod_recommendation" :comments="item.hod_comment" :currentState="item.hod_recommendation" />

      <div class="flex xs:flex-row align-middle" v-if="item.md_approval">
        <p class="w-2/5 text-sm font-semibold">MD Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="item.md_approval" />
        </p>
      </div>

      <CommentBox v-if="item.md_comment && item.md_approval" :comments="item.md_comment" :currentState="item.md_approval" />

      <div class="flex xs:flex-row align-middle" v-if="item.final_bill_generated">
        <p class="w-2/5 text-sm font-semibold">Billing Review</p>
        <p class="text-sm">
          <IconAppStatus :status="item.final_bill_generated" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm capitalize" v-text="item.type_signs"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Length</p>
        <p class="text-sm" v-text="item.length"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Breadth</p>
        <p class="text-sm" v-text="item.breadth"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Dimension</p>
        <p class="text-sm" v-text="item.dimension_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Setback Distance</p>
        <p class="text-sm" v-text="item.setback_distance"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Site Format</p>
        <p class="text-sm capitalize" v-text="item.sign_format"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Site of Sign</p>
        <p class="text-sm capitalize" v-text="item.sign_site"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Illumination</p>
        <p class="text-sm" v-text="item.illumination"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Interactivity</p>
        <p class="text-sm" v-text="item.interactivity"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Electricity Source</p>
        <p class="text-sm" v-text="item.electricity_source"></p>
      </div>

      <div v-if="item.photo_montage" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
      </div>

      <div
        v-if="item.bill_generated === 'generated'"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Signage Cost</p>
        <p class="text-sm" v-text="formatCurrency(item.ads_price)"></p>
      </div>

      <div
        v-if="item.bill_generated === 'generated'"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-2/5 text-sm font-semibold">Renewal Price</p>
        <p class="text-sm" v-text="formatCurrency(item.annual_price)"></p>
      </div>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="edit = true"
        v-if="editable"
      >
        Edit Application
      </button>
    </div>

    <!-- RM Actions -->
    <div
      class="actionsHolder"
      v-if="
        inspectStatus === 'paid' &&
        item.certify_application === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Registry' &&
        userDetails.userInfo.id == assignedOfficer
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openSmallFormatActions('decline', 'admindecertifyapplication')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        v-if="false"
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
        @click="openSmallFormatActions('approve', 'admincertifyapplication')"
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
        item.hod_recommendation === 'pending' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Registry'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openSmallFormatActions('decline', 'registrydisapprovesmallformat')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
        v-if="false"
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
        @click="openSmallFormatActions('approve', 'registryapprovesmallformat')"
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
        item.md_approval === 'pending' &&
        userDetails.userInfo.admin_role_id == 6
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openSmallFormatActions('decline', 'mdsmallformatdetailsdisapproval')"
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
        @click="openSmallFormatActions('approve', 'mdsmallformatdetailsapproval')"
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

    <!-- Bill Generation -->
    <div
      class="actionsHolder"
      v-if="
        item.md_approval === 'approved' &&
        item.bill_generated === 'pending' &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3) &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        type="button"
        :disabled="loadingAction"
        @click="openBilling()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Generate Bill
      </button>
    </div>

    <div
      class="actionsHolder"
      v-if="
        item.final_bill_generated === 'pending' &&
        item.bill_generated === 'generated' &&
        userDetails.userInfo.admin_role_id == 5 &&
        userDetails.userInfo.department === 'Billings'
      "
    >
      <button
        type="button"
        :disabled="loadingAction"
        @click="openBilling()"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        Review Bill
      </button>
    </div>
  </li>
</template>
