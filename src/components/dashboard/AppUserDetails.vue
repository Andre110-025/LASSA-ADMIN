<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import { useUserStore } from "../../stores/user";
import IconAppStatus from "../icons/IconAppStatus.vue";
// import IconAppStatus from "../icons/IconAppStatus.vue";
import CommentBox from "./buttons/CommentBox.vue";
import onpremiseUserAppDetails from "./onpremiseUserAppDetails.vue";
import PremiseItemInfo from "./PremiseItemInfo.vue";

const { userDetails } = useUserStore();
const route = useRoute();
const { formatDate, timeFormat } = useHelpers();
const pageData = ref(null);
const price = ref(null);
const loading = ref(false);
const getAppInfo = async () => {
  loading.value = true;
  pageData.value = [];

  try {
    const response = await axios.get(
      `admingetonpremisedetails/${route.params.uid}`,
    );
    console.log(response);
    pageData.value = response.data.data[0];
    price.value = response.data.balance;
  } catch (error) {
    console.log(error);
    toast.error("An error occurred while fetching user details.");
  } finally {
    loading.value = false;
  }
};
const formatCurrency = (value) => {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
onMounted(() => {
  getAppInfo();
});
</script>

<template>
  <GetData v-if="loading">Getting User Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">MORE DETAILS</h4>
    <onpremiseUserAppDetails
      v-if="pageData.user"
      :user="pageData.user"
      :business_name="pageData.business_name"
    />
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <!-- <div class="flex flex-col justify-between w-4/5 h-fit gap-4">
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Business Name</p>
          <p class="text-sm">{{ pageData.business_name || "N/A" }}</p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Type</p>
          <p
            class="text-sm uppercase"
            v-text="pageData.user.user_type.replace('_', ' ') || 'N/A'"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Name</p>
          <p class="text-sm" v-text="pageData.business_name || 'N/A'"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Email</p>
          <p class="text-sm" v-text="pageData.email || 'N/A'"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Account Phone</p>
          <p class="text-sm" v-text="pageData.phone_number || 'N/A'"></p>
        </div>
      </div> -->

      <div class="flex flex-col gap-4 fxfcol border-gray-300 border-t-2">
        <div class="flex xs:flex-row align-middle mt-3.5">
          <p class="w-2/5 text-sm font-semibold">Application Process</p>
          <p
            class="text-sm"
            v-text="pageData.purpose_of_application || 'N/A'"
          ></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Sign Address</p>
          <p class="text-sm" v-text="pageData.sign_address || 'N/A'"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Street Category</p>
          <p class="text-sm" v-text="pageData.street_category || 'N/A'"></p>
        </div>
        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Property Type</p>
          <p class="text-sm" v-text="pageData.property_type || 'N/A'"></p>
        </div> -->
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">LGA</p>
          <p class="text-sm" v-text="pageData.lga || 'N/A'"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Payment ID</p>
          <p class="text-sm" v-text="pageData.payment_id || 'N/A'"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Balance</p>
          ₦ {{ formatCurrency(price) }}
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Installation Date</p>
          <p class="text-sm" v-text="pageData.installation_date || 'N/A'"></p>
        </div>
        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Zone</p>
          <p class="text-sm" v-text="pageData.zone || 'N/A'"></p>
        </div>
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Type of sign</p>
          <p
            class="text-sm"
            v-text="pageData.onpremise_info?.[0]?.type_of_sign || 'N/A'"
          ></p>
        </div> -->
        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Number of signs</p>
          <p
            class="text-sm"
            v-text="pageData.onpremise_info?.[0]?.number_of_signs || 'N/A'"
          ></p>
        </div> -->
        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Photo Montage</p>

          <div class="text-sm">
            <template v-if="pageData.onpremise_info?.[0]?.photo_montage">
              <img
                :src="pageData.onpremise_info?.[0]?.photo_montage"
                alt="Photo Montage"
                class="max-h-40 object-contain"
              />
              <!-- optional: also show link 
              <div class="text-xs text-gray-500 mt-1">
                <a
                  :href="pageData.onpremise_info?.[0]?.photo_montage"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                >
                </a>
              </div>
            </template>

            <span v-else>N/A</span>
          </div>
        </div> -->

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Bank or Telecoms</p>
          <p
            class="text-sm"
            v-text="pageData.app_history.bank_and_others || 'N/A'"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Product on Display</p>
          <p
            class="text-sm"
            v-text="pageData.app_history.product_on_sign || 'N/A'"
          ></p>
        </div>

        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Purpose</p>
          <p class="text-sm" v-text="pageData.app_history.purpose || 'N/A'"></p>
        </div> -->

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">BM Status</p>
          <p class="text-sm"><IconAppStatus :status="pageData.status" /></p>
        </div>

        <CommentBox
          v-if="pageData.bm_comment"
          :current-state="pageData.status"
          :comments="pageData.bm_comment"
        />

        <div class="flex xs:flex-row align-middle">
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

        <div
          class="flex xs:flex-row align-middle"
          v-if="pageData.billing_status"
        >
          <p class="w-2/5 text-sm font-semibold">Bill Approval</p>
          <p class="text-sm">
            <IconAppStatus :status="pageData.billing_status" />
          </p>
        </div>

        <div
          class="flex xs:flex-row align-middle"
          v-if="pageData.account_status"
        >
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
          <p class="text-sm">
            <IconAppStatus :status="pageData.audit_status" />
          </p>
        </div>

        <CommentBox
          v-if="pageData.audit_comment"
          :currentState="pageData.audit_status"
          :comments="pageData.audit_comment"
        />

        <!-- <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Due Date</p>
          <p class="text-sm" v-text="timeFormat(pageData.due_date) || 'N/A'"></p>
        </div> -->
      </div>
    </div>

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

    <!-- <ul>
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
    </ul> -->
    <ul v-if="pageData.onpremise_info && pageData.onpremise_info.length">
      <li
        v-for="(item, index) in pageData.onpremise_info"
        :key="item.id || index"
        class="flex flex-col p-6 gap-4 border-b border-gray-100 last:border-0"
      >
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Sign {{ index + 1 }}
          {{
            item.sign_to_add &&
            pageData.purpose_of_application === "Additional Sign"
              ? " - Additional Sign"
              : ""
          }}
          {{
            item.id == pageData.onpremise_change?.[0]?.onpremise_info_id &&
            pageData.purpose_of_application === "Change of Sign"
              ? " to Change"
              : ""
          }}
        </h6>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
          <p class="text-sm" v-text="item.type_of_sign || 'N/A'"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s)</p>
          <p
            class="text-sm"
            v-text="(item.number_of_sign || 0) + (item.sign_to_remove || 0)"
          ></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Sign Removal'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">
            Number of Sign(s) after Removal
          </p>
          <p class="text-sm" v-text="item.number_of_sign"></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Sign Removal'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Remove</p>
          <p class="text-sm" v-text="item.sign_to_remove"></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Additional Sign'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Add</p>
          <p class="text-sm" v-text="item.sign_to_add"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Dimension(Sqm)</p>
          <p
            class="text-sm"
            v-text="(item.length_in_meter || 0) * (item.width_in_meter || 0)"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Product on Sign</p>
          <p class="text-sm" v-text="item.product_on_sign ? 'Yes' : 'No'"></p>
        </div>

        <div class="flex flex-col gap-2" v-if="item.photo_montage">
          <p class="w-2/5 text-sm font-semibold">Photomontage</p>
          <img
            :src="item.photo_montage"
            alt="Sign Image"
            class="w-full bg-gray-600 rounded-md"
          />
        </div>

        <div
          v-if="
            pageData.purpose_of_application === 'Sign Removal' &&
            item.photo_montage_remove
          "
          class="flex flex-col gap-2"
        >
          <p class="w-2/5 text-sm font-semibold">Removal Image</p>
          <img
            :src="item.photo_montage_remove"
            alt="Removal Preview"
            class="w-full bg-gray-600 rounded-md"
          />
        </div>

        <!-- <template v-if="userDetails?.userInfo?.department === 'Billings'">
          <div v-if="item.previous_rate" class="flex xs:flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Previous Rate</p>
            <p class="text-sm" v-text="formatCurrency(item.previous_rate)"></p>
          </div>

          <div v-if="item.rate" class="flex xs:flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Unit Rate</p>
            <p class="text-sm" v-text="formatCurrency(item.rate)"></p>
          </div>

          <div v-if="item.rate" class="flex xs:flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Total Rate</p>
            <p
              class="text-sm"
              v-text="formatCurrency(item.rate * (item.number_of_sign || 1))"
            ></p>
          </div>
        </template> -->
      </li>
    </ul>

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

      <!-- <div v-if="changeData.ratetoremove" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Bill to Remove</p>
        <p class="text-sm" v-text="formatCurrency(changeData.ratetoremove)"></p>
      </div>

      <div v-if="changeData.ratetoadd" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Rate</p>
        <p class="text-sm" v-text="formatCurrency(changeData.ratetoadd)"></p>
      </div> -->

      <!-- <div
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
      </div> -->
    </div>
  </div>
</template>
