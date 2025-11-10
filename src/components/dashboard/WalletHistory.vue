<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import IconEye from "../icons/IconEye.vue";
import { useModal } from "vue-final-modal";
import ViewFundRequest from "./popups/ViewFundRequest.vue";
import { useHelpers } from "../../helper";
import { TailwindPagination } from "laravel-vue-pagination";
import axios from "axios";

const { formatCurrency } = useHelpers();

const props = defineProps({
  purpose: String,
  searchQuery: String 
});

const loading = ref(false);

const viewFundDetail = (obj) => {
  const { open, close } = useModal({
    component: ViewFundRequest,
    attrs: {
      onConfirm(bol) {
        if(bol) {
          getData(1);
        }
        close();
      },
      requestData: obj,
    },
    slots: {},
  });

  open();
};

const fundRequestData = ref({});

async function getData(page = 1) {
  loading.value = true;

  try {
    const response = await axios.get(
      `getwallettransaction?search=${props.purpose}&items=${props.searchQuery}&page=${page}`
    );
    // console.log(response);
    if (response.status === 200) {
      fundRequestData.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

let delaySearch = null;

watch(
  () => props.searchQuery,
  async () => {
    if (delaySearch) {
      clearTimeout(delaySearch);
    }

    delaySearch = setTimeout(() => {
      getData(1);
      // Call the function or perform actions that should happen after the delay
    }, 1500); // Adjust the delay time in milliseconds as needed
  }
);

watch(
  () => props.purpose,
  async () => {
    getData();
  }
);

getData();

// hidden md:table-cell
</script>

<template>
  <div v-if="fundRequestData.data?.length && !loading">
    <table class="w-full mt-6 table-auto">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden md:table-cell"
          >
            Transaction ID
          </th>
          <th class="text-sm text-gray-700 text-left p-2.5">Amount</th>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden md:table-cell"
          >
            Status
          </th>
          <th class="text-sm text-gray-700 text-left p-2.5">Details</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="request in fundRequestData.data" class="even:bg-slate-50">
          <td
            class="p-2.5 text-xs xs:text-sm hidden md:table-cell"
            v-text="request.transaction_id"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm"
            v-text="formatCurrency(request.transaction_amount)"
          ></td>
          <td class="p-2.5 text-xs xs:text-sm hidden md:table-cell">
            <IconAppStatus :status="request.status" />
          </td>
          <td class="p-2.5 text-xs xs:text-sm">
            <span
              class="flex gap-2.5 w-fit cursor-pointer"
              @click="viewFundDetail(request)"
            >
              <IconEye class="w-4 my-auto" />
              <span class="my-auto w-full">View Details</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-8">
      <TailwindPagination
        :data="fundRequestData"
        @pagination-change-page="getData"
        class="vue-pagination"
        :limit="2"
      />
    </div>
  </div>

  <GetData v-else-if="loading"> Getting Wallet History </GetData>

  <NoList v-else>
    <template #description> No Transaction </template>
    <template #action> Fund Wallet Disabled </template>
  </NoList>
</template>
