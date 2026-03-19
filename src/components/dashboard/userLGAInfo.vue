<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import IconSearch from "../icons/IconSearch.vue";
import IconEye from "../icons/IconEye.vue";
import { useRouter } from "vue-router";
import { useHelpers } from "../../helper";
import { TailwindPagination } from "laravel-vue-pagination";

const search = ref("");
const loading = ref(false);
const { timeFormat } = useHelpers();
const router = useRouter();
const selectedLGA = ref(router.options.history.state?.lga ?? "");
const checkInstitution = (lgaName) => {
  if (!lgaName) return false;

  return lgaName.includes("Institution") ? "1" : "0";
};
const LGAInfo = ref({});
const expandedRows = ref([]);
const toggleRow = (index) => {
  if (expandedRows.value.includes(index)) {
    expandedRows.value = expandedRows.value.filter((i) => i !== index);
  } else {
    expandedRows.value.push(index);
  }
};
async function getLGA(page = 1) {
  loading.value = true;
  // LGAInfo.value = [];

  try {
    const response = await axios.get("paginateuserdetailsbylga", {
      params: {
        search: search.value,
        lga: selectedLGA.value,
        is_institution: checkInstitution(selectedLGA.value),
        page: page,
      },
    });
    if (response.status === 200) {
      LGAInfo.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
}
let delaySearch = null;
watch(search, (newValue) => {
  if (delaySearch) {
    clearTimeout(delaySearch);
  }
  delaySearch = setTimeout(() => {
    getLGA();
  }, 1500);
});
const formatCurrency = (value) => {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
const goToInvoice = (item) => {
  // Store in sessionStorage before navigating
  sessionStorage.setItem("lgaPaymentHistory", JSON.stringify(item.payment_onpremise));
  sessionStorage.setItem("lgaBusinessName", item.business_name);

  router.push({ name: "lgaDetails" }); // 👈 no params needed
};
onMounted(() => {
  getLGA();
});
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div
      class="bg-white p-5 mb-5 rounded-xl flex flex-row justify-between items-center shadow-sm"
    >
      <div class="flex flex-col">
        <h4 class="text-xl font-semibold">User LGA Information</h4>
        <span class="text-gray-400"
          >selected LGA: {{ selectedLGA || "None selected" }}</span
        >
      </div>

      <div class="relative block">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-10 text-sm border-none outline-none focus:ring-2 focus:ring-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          v-model="search"
        />
        <IconSearch class="absolute top-2.5 right-3 w-5 text-gray-400" />
      </div>
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg shadow-sm">
      <div
        v-if="LGAInfo.data?.length && !loading"
        class="w-full overflow-x-auto"
      >
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-slate-100 bg-slate-50">
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Business name
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Local govt
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Email
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Phone
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Outstanding balance
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                Date
              </th>
              <th
                scope="col"
                class="text-sm font-bold text-gray-700 text-left p-3"
              >
                View history
              </th>
              <th class="w-10"></th>
            </tr>
          </thead>

          <tbody v-for="(item, index) in LGAInfo.data" :key="item.id">
            <tr
              @click="toggleRow(index)"
              class="cursor-pointer hover:bg-slate-50 transition-colors border-b last:border-0"
            >
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                {{ item.business_name || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                {{ item.kycdetail.lga || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                {{ item.email || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                {{ item.phone_number || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                <!-- {{ item.total_approved_balance || "N/A" }} -->
                ₦ {{ formatCurrency(item.total_approved_balance) || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                {{ timeFormat(item.created_at) || "N/A" }}
              </td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">
                <div
                  @click.stop.prevent="goToInvoice(item)"
                  class="flex gap-2.5 w-fit cursor-pointer p-2 hover:bg-slate-200 rounded-full"
                >
                  <IconEye class="w-4 my-auto" />
                </div>
              </td>
              <td class="p-3 text-center">
                <span
                  class="inline-block transition-transform duration-200"
                  :class="{ 'rotate-90': expandedRows.includes(index) }"
                >
                  ▶
                </span>
              </td>
            </tr>

            <tr v-if="expandedRows.includes(index)">
              <td colspan="6" class="p-0 bg-slate-50/50">
                <div class="p-4 overflow-x-auto">
                  <table
                    class="w-full border border-slate-200 rounded-lg overflow-hidden bg-white"
                  >
                    <thead>
                      <tr class="bg-slate-100 border-b border-slate-200">
                        <!-- <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Zone
                        </th> -->
                        <!-- <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Amount due
                        </th> -->
                        <!-- <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Permit year
                        </th> -->
                        <!-- <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Sign Address
                        </th>
                        <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Category
                        </th>
                        <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Property
                        </th> -->
                        <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Local Govt LGA
                        </th>
                        <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Balance
                        </th>
                        <!-- <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          Purpose
                        </th> -->
                        <th
                          class="text-xs font-bold text-gray-600 p-2 text-left"
                        >
                          View details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="app in item.onpremise"
                        :key="app.id"
                        class="border-b border-slate-100 last:border-0"
                      >
                        <!-- <td class="text-xs p-2 text-gray-600">
                          {{ app.zone || "N/A" }}
                        </td> -->
                        <!-- <td class="text-xs p-2 text-gray-600 font-medium">
                          ₦
                          {{ formatCurrency(app.initial_amount_due) || "N/A" }}
                        </td> -->
                        <!-- <td
                          class="text-xs p-2 text-gray-600 max-w-[150px] truncate"
                        >
                          {{ app.sign_address || "N/A" }}
                        </td> -->
                        <!-- <td class="text-xs p-2 text-gray-600">
                          {{ app.sign_address || "N/A" }}
                        </td>
                        <td class="text-xs p-2 text-gray-600">
                          {{ app.street_category || "N/A" }}
                        </td>
                        <td class="text-xs p-2 text-gray-600">
                          {{ app.property_type || "N/A" }}
                        </td> -->
                        <td class="text-xs p-2 text-gray-600">
                          {{ app.lga || "N/A" }}
                        </td>
                        <td class="text-xs p-2 text-gray-600 font-medium">
                          ₦
                          {{ formatCurrency(app.app_history.balance) || "N/A" }}
                        </td>
                        <td class="text-xs p-2 text-gray-600">
                          <a
                            :href="`appUser-details/${app.id}`"
                            target="_blank"
                            class="flex gap-2.5 w-fit"
                          >
                            <IconEye class="w-4 my-auto" />
                            <span class="my-auto w-full">View Details</span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-center mt-8">
          <TailwindPagination
            :data="LGAInfo"
            @pagination-change-page="getLGA"
            class="vue-pagination"
            :limit="2"
          />
        </div>
      </div>

      <GetData v-else-if="loading"> Getting History </GetData>
      <p v-else class="text-center py-10 text-gray-500">No History</p>
    </div>
  </div>
</template>
