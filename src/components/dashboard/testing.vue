<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import { useHelpers } from "../../helper";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const { timeFormat, formatCurrency } = useHelpers();
const items = ref([]);

const payments = router.options.history.state.payments;
console.log(payments);

const goToInvoice = (item) => {
  const url = router.resolve({
    name: "lga-invoice",
    params: { id: item.id },
  }).href;

  window.open(url, "_blank");
};

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const itemData = ref(router.options.history.state?.data || null);
const id = route.params.id;

onMounted(() => {
  if (!itemData.value) {
    // fallback → fetch from API using id
    fetchInvoice(id);
  }
});

const goToInvoice = (item) => {
  const routeData = router.resolve({
    name: "lgaDetails",
    params: { id: item.id },
  });

  // Removing the third argument ensures the browser handles it as a standard new tab
  window.open(routeData.href, "_blank");
};
</script>

<template>

  <input
    type="number"
    step="0.01"
    v-model="amount"
    class="border p-2 rounded"
    placeholder="Enter amount"
  />

<td class="text-sm text-gray-700 p-3 whitespace-nowrap">
  <div
    @click.stop="goToInvoice(item)"
    class="flex gap-2.5 w-fit cursor-pointer"
  >
    <IconEye class="w-4 my-auto" />
  </div>
</td>
</template>
<template>

  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl flex flex-row justify-between items-center shadow-sm">
      <div class="flex flex-col">
        <h4 class="text-xl font-semibold">User LGA Information</h4>
        <span class="text-gray-400">selected LGA: {{ selectedLGA || "None selected" }}</span>
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
      <div v-if="LGAInfo.length && !loading" class="w-full overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-slate-100 bg-slate-50">
              <th scope="col" class="text-sm font-bold text-gray-700 text-left p-3">Business name</th>
              <th scope="col" class="text-sm font-bold text-gray-700 text-left p-3">Local govt</th>
              <th scope="col" class="text-sm font-bold text-gray-700 text-left p-3">Email</th>
              <th scope="col" class="text-sm font-bold text-gray-700 text-left p-3">Phone</th>
              <th scope="col" class="text-sm font-bold text-gray-700 text-left p-3">Date</th>
              <th class="w-10"></th>
            </tr>
          </thead>

          <tbody v-for="(item, index) in LGAInfo" :key="item.id">
            <tr
              @click="toggleRow(index)"
              class="cursor-pointer hover:bg-slate-50 transition-colors border-b last:border-0"
            >
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">{{ item.business_name }}</td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">{{ item.onpremise?.[0]?.lga || "N/A" }}</td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">{{ item.email }}</td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">{{ item.phone_number }}</td>
              <td class="text-sm text-gray-700 p-3 whitespace-nowrap">{{ timeFormat(item.created_at) }}</td>
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
                  <table class="w-full border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <thead>
                      <tr class="bg-slate-100 border-b border-slate-200">
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Zone</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Amount due</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Permit year</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Sign Address</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Installation</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Category</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Property</th>
                        <th class="text-xs font-bold text-gray-600 p-2 text-left">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="app in item.onpremise" 
                        :key="app.id" 
                        class="border-b border-slate-100 last:border-0"
                      >
                        <td class="text-xs p-2 text-gray-600">{{ app.zone || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600 font-medium">₦ {{ formatCurrency(app.initial_amount_due) }}</td>
                        <td class="text-xs p-2 text-gray-600">{{ app.permit_year || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600 max-w-[150px] truncate">{{ app.sign_address || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600">{{ app.installation_date || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600">{{ app.street_category || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600">{{ app.property_type || "N/A" }}</td>
                        <td class="text-xs p-2 text-gray-600">{{ app.purpose_of_application || "N/A" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <GetData v-else-if="loading"> Getting History </GetData>
      <p v-else class="text-center py-10 text-gray-500">No History</p>
    </div>
  </div>
</template>