<script setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import { useUserStore } from "../../stores/user";
import { useModal } from "vue-final-modal";
import OnPremiseActions from "./popups/OnPremiseActions.vue";

const { userDetails } = useUserStore();

const { formatCurrency } = useHelpers();

const props = defineProps({
  compData: Object,
});

const { premiseItem, changeData, index, pageData, additionalSignData } =
  props.compData;

const loading = ref(false);
const showEdit = ref(null);
const streetCat = [
  "Rural Zone N",
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
];

const rateData = reactive({
  price: premiseItem.rate,
  previous_ads_price: premiseItem.previous_rate || 0,
  street_category: props.compData.pageData.street_category,
});

const productData = reactive({
  product_on_sign: false,
});

const currentYearRate = computed(() => {
  return rateData.price - rateData.previous_ads_price;
});

const emit = defineEmits(["getUpdate"]);

async function updateProduct() {
  loading.value = true;

  try {
    const response = await axios.post(
      `enabledisableproductonsign/${premiseItem.id}`,
      productData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Product Details Successfully Updated", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("getUpdate");
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
    loading.value = false;
  }
}

async function reviewRate() {
  loading.value = true;

  try {
    const response = await axios.post(
      `approvebillinginfoonpremise/${premiseItem.id}`,
      rateData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Sign Rate Successfully Updated", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("getUpdate");
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
    loading.value = false;
  }
}

const { open: openDeleteSign, close } = useModal({
  component: OnPremiseActions,
  attrs: {
    type: "decline",
    endPont: "deleteonpremisedetails",
    id: premiseItem.id,
    onConfirm(bol) {
      if (bol) {
        emit("getUpdate");
      }
      close();
    },
  },
  slots: {},
});
</script>

<template>
  <li class="flex flex-col p-6 gap-4">
    <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
      Sign {{ index + 1 }}
      {{
        premiseItem.sign_to_add &&
        pageData.purpose_of_application === "Additional Sign"
          ? "Additional Sign"
          : ""
      }}
      {{
        premiseItem.id == changeData?.onpremise_info_id &&
        pageData.purpose_of_application === "Change of Sign"
          ? " to Change"
          : ""
      }}
    </h6>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
      <p class="text-sm" v-text="premiseItem.type_of_sign"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Number of Sign(s)</p>
      <p
        class="text-sm"
        v-text="premiseItem.number_of_sign + premiseItem.sign_to_remove"
      ></p>
    </div>

    <div
      v-if="pageData.purpose_of_application === 'Sign Removal'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Number of Sign(s) after Removal</p>
      <p class="text-sm" v-text="premiseItem.number_of_sign"></p>
    </div>

    <div
      v-if="pageData.purpose_of_application === 'Sign Removal'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Remove</p>
      <p class="text-sm" v-text="premiseItem.sign_to_remove"></p>
    </div>

    <div
      v-if="pageData.purpose_of_application === 'Additional Sign'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Add</p>
      <p class="text-sm" v-text="premiseItem.sign_to_add"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Dimension(Sqm)</p>
      <p
        class="text-sm"
        v-text="premiseItem.length_in_meter * premiseItem.width_in_meter"
      ></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Product on Sign</p>
      <p
        class="text-sm"
        v-text="premiseItem.product_on_sign ? 'Yes' : 'No'"
      ></p>
    </div>

    <div class="flex flex-col gap-2">
      <p class="w-2/5 text-sm font-semibold">Photomontage</p>
      <img :src="premiseItem.photo_montage" alt="" class="w-full bg-gray-600" />
    </div>

    <div
      v-if="
        pageData.purpose_of_application === 'Sign Removal' &&
        premiseItem.photo_montage_remove
      "
      class="flex flex-col gap-2"
    >
      <p class="w-2/5 text-sm font-semibold">Removal Image</p>
      <img
        :src="premiseItem.photo_montage_remove"
        alt=""
        class="w-full bg-gray-600"
      />
    </div>

    <div
      v-if="
        premiseItem.previous_ads_price &&
        userDetails.userInfo.department === 'Billings'
      "
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Previous Rate</p>
      <p
        class="text-sm"
        v-text="formatCurrency(premiseItem.previous_ads_price)"
      ></p>
    </div>

    <div
      v-if="userDetails.userInfo.department === 'Billings' && premiseItem.rate"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Unit Rate</p>
      <p class="text-sm" v-text="formatCurrency(premiseItem.rate)"></p>
    </div>

    <div
      v-if="userDetails.userInfo.department === 'Billings' && premiseItem.rate"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Total Rate</p>
      <p
        class="text-sm"
        v-text="formatCurrency(premiseItem.rate * premiseItem.number_of_sign)"
      ></p>
    </div>

    <div
      class="actionsHolder"
      v-if="
        (pageData.status === 'pending' ||
          (additionalSignData?.status === 'pending' &&
            premiseItem.sign_to_add)) &&
        ((pageData.lga === userDetails.userInfo.lga &&
          !pageData.user.is_institution) ||
          ((pageData.zone === userDetails.userInfo.zone ||
            pageData.zone === userDetails.userInfo.zone2) &&
            userDetails.userInfo.lga === 'Other')) &&
        userDetails.userInfo.admin_role_id == 1 &&
        !showEdit
      "
    >
      <button
        class="px-5 py-3 bg-red-600 text-sm rounded-md text-white grow"
        @click="openDeleteSign()"
        v-if="pageData.onpremise_info.length > 1"
      >
        Remove Sign
      </button>
      <button
        class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="showEdit = 'product'"
      >
        Review Sign
      </button>
    </div>

    <div
      class="actionsHolder"
      v-else-if="
        (pageData.billing_status === 'pending' ||
          (additionalSignData?.billing_status === 'pending' &&
            premiseItem.sign_to_add &&
            pageData.purpose_of_application === 'Additional Sign')) &&
        (userDetails.userInfo.admin_role_id == 2 ||
          userDetails.userInfo.admin_role_id == 3 ||
          userDetails.userInfo.admin_role_id == 5) &&
        userDetails.userInfo.department === 'Billings' &&
        !showEdit
      "
    >
      <button
        class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="showEdit = 'billing'"
      >
        Review Rate
      </button>
    </div>

    <form v-else-if="showEdit === 'product'" @submit.prevent="updateProduct">
      <div class="flex flex-row gap-2.5 items-center px-5">
        <input
          type="checkbox"
          name="product_on_sign"
          id="product_on_sign"
          v-model="productData.product_on_sign"
        /><label class="text-sm" for="product_on_sign"
          >check if Product is on Sign</label
        >
      </div>

      <div class="actionsHolder">
        <button
          class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
          :disabled="loading"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-xs text-center font-medium text-white tracking-wider"
            v-if="!loading"
          >
            Submit Update
          </span>
        </button>
      </div>
    </form>

    <form v-else-if="showEdit === 'billing'" @submit.prevent="reviewRate">
      <div class="inputHolder px-6" v-if="rateData.previous_ads_price">
        <input
          type="number"
          min="500"
          placeholder=""
          class="input peer"
          id="previous_ads_price"
          autocomplete="off"
          v-model="rateData.previous_ads_price"
          step="0.01"
          required
        />
        <label for="previous_ads_price" class="inputLabel">Arrears</label>
      </div>

      <div class="inputHolder px-6">
        <input
          type="number"
          min="500"
          placeholder=""
          class="input peer"
          id="price_rate"
          autocomplete="off"
          v-model="rateData.price"
          step="0.01"
          required
        />
        <label for="price_rate" class="inputLabel">Total Rate</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="street_category"
          v-model="rateData.street_category"
          required
        >
          <option
            v-for="(item, index) in streetCat"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label for="street_category" class="inputLabel">Category</label>
      </div>

      <span v-if="rateData.previous_ads_price" class="block my-5 px-6">
        Current Year Rate is {{ formatCurrency(currentYearRate) }}
      </span>

      <div class="actionsHolder">
        <button
          class="px-5 py-3 bg-mainColor text-sm rounded-md text-white grow"
          :disabled="loading"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-xs text-center font-medium text-white tracking-wider"
            v-if="!loading"
          >
            Submit Rate
          </span>
        </button>
      </div>
    </form>
  </li>
</template>
