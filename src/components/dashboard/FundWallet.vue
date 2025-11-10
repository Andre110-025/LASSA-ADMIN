<script setup>
import { ref } from "vue";
import WalletHistory from "./WalletHistory.vue";
import FundUserWallet from "./popups/FundUserWallet.vue";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import FilterButton from "./buttons/request/FilterButton.vue";
import IconSearch from "../icons/IconSearch.vue";

const admin_role = useUserStore().userDetails.userInfo.admin_role_id;

const histKey = ref(0);
const search = ref('');

const purpose = [
  "All",
  "Application Fee",
  "Mobile Adverts",
  "PAVs",
  "Street Lamp Processing Fee",
  "Street Lamp Administrative Fee"
];

const purposeType = ref('');

function updateCat(n) {
  n === 'All' ? purposeType.value = '' : purposeType.value = n;
}



const { open: openFund, close: closeFund } = useModal({
  component: FundUserWallet,
  attrs: {
    onConfirm() {
      closeFund();
      histKey.value++;
      purposeType.value = '';
    },
  },
  slots: {},
});
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex 2xs:flex-row flex-col gap-5 2xs:gap-4 justify-between">
      <h4 class="text-2xl text-gray-700">Fund Request</h4>
      <div class="relative">
        <button
          @click="openFund"
          class="bg-mainColor sm:inline-block text-white w-fit px-5 py-2 text-center rounded"
          v-if="false"
        >
          + Fund User
        </button>
      </div>
    </div>
    <div v-if="admin_role == 6 || admin_role == 8 || admin_role == 10" class="flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center mt-10">
      <FilterButton
        :options="purpose" @change-cat="updateCat"
      />
      <div class="relative">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-7 text-sm border-solid outline-none focus:border-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          v-model="search"
        />
        <IconSearch class="absolute top-1.5 right-2 w-6" />
      </div>
    </div>
  </div>
  <div
    v-if="admin_role == 6 || admin_role == 8 || admin_role == 10"
    class="mt-4 p-5 bg-white rounded-lg"
  >
    <WalletHistory :purpose="purposeType" :searchQuery="search" :key="histKey" />
  </div>
</template>
