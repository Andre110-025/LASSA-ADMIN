<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import { useHelpers } from "../../helper";
import { useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";

const items = ref([]);
const loading = ref(false);
const { formatDate, formatCurrency } = useHelpers();

// const getData = async () => {
//   loading.value = true;
//   items.value = [];

//   try {
//     const response = await axios.get("debitcreditadminlist");
//     if (response.status === 200) {
//       items.value = response.data.date.data;
//       loading.value = false;
//     }
//   } catch (error) {
//     console.log(error);
//     loading.value = false;
//   } finally {
//     loading.value = false;
//   }
// };

const getData = async () => {
  loading.value = true;
  items.value = [];

  try {
    const response = await axios.get("debitcreditadminlist");
    if (response.status === 200) {
      // Add separate loading flags for approve and decline
      items.value = response.data.date.data.map((item) => ({
        ...item,
        loadingApprove: false,
        loadingDecline: false,
      }));
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// const updateItemStatus = async (item, status) => {
//   item.isloading = true;

//   try {
//     const payload = {
//       amount: item.amount,
//       productType: item.single_muiltiple,
//       OnpremiseId: item.onpremise_id,
//       type: item.credit_debit_type,
//       status: status,
//     };

//     await axios.post("debitcreditadminapproval", payload);

//     item.credit_debit_approval =
//       status === "approved" ? "Approved" : "Declined";
//   } catch (error) {
//     console.log(error);
//   } finally {
//     item.loading = false;
//   }
// };

const updateItemStatus = async (item, status) => {
  const loadingKey =
    status === "approved" ? "loadingApprove" : "loadingDecline";
  item[loadingKey] = true;

  try {
    const payload = {
      amount: item.amount,
      productType: item.single_muiltiple,
      OnpremiseId: item.onpremise_id,
      type: item.credit_debit_type,
      status: status,
    };

    await axios.post("debitcreditadminapproval", payload);

    item.credit_debit_approval = status;
  } catch (error) {
    console.log(error);
  } finally {
    item[loadingKey] = false;
  }
};

onMounted(() => {
  getData();
});

const formatCurrencyLocal = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return "₦0.00";
  }

  const value = Number(amount);

  if (isNaN(value)) {
    return "₦0.00";
  }

  return value.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl">
      <h4 class="text-xl mb-5">Debit/Credit Approval</h4>
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg">
      <div class="w-full" v-if="items.length && !loading">
        <table class="w-full">
          <thead>
            <tr
              class="border-b-[.0938rem] border-gray-900 bg-slate-50 *:whitespace-nowrap"
            >
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Type
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Id
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Amount
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Status
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Date
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="even:bg-slate-50 hover:bg-slate-100 transition"
            >
              <td class="p-2.5 text-xs xs:text-sm">
                {{ item.type }}
              </td>

              <td class="p-2.5 text-xs xs:text-sm">onpremise{{ item.id }}</td>

              <td class="p-2.5 text-xs xs:text-sm">
                {{ formatCurrencyLocal(item.amount) }}
              </td>

              <td class="p-2.5 text-xs xs:text-sm">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    item.credit_debit_approval === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : item.credit_debit_approval === 'declined'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ item.credit_debit_approval || "Pending" }}
                </span>
              </td>

              <!-- <td class="p-2.5 text-xs xs:text-sm">
                {{ item.single_muiltiple }}
              </td> -->

              <td class="p-2.5 text-xs xs:text-sm">
                {{ formatDate(item.created_at) }}
              </td>

              <td class="p-2.5 text-xs xs:text-sm flex gap-2">
                <!-- Approve -->
                <button
                  @click="updateItemStatus(item, 'approved')"
                  :disabled="
                    item.loadingApprove ||
                    item.credit_debit_approval === 'approved'
                  "
                  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  :class="
                    item.credit_debit_approval === 'approved' ||
                    item.loadingApprove
                      ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
                      : '!bg-blue-600 !text-white hover:bg-blue-700 active:scale-95'
                  "
                >
                  <span v-if="item.loadingApprove">Processing...</span>
                  <span v-else-if="item.credit_debit_approval === 'approved'"
                    >Approved</span
                  >
                  <span v-else>Approve</span>
                </button>
                <!-- <button
                  @click="updateItemStatus(item, 'approved')"
                  :disabled="
                    item.loadingApprove ||
                    item.credit_debit_approval === 'approved'
                  "
                  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  :class="
                    item.credit_debit_approval === 'approved'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  "
                >
                  <span v-if="item.loadingApprove">Processing...</span>
                  <span v-else-if="item.credit_debit_approval === 'approved'"
                    >Approved</span
                  >
                  <span v-else>Approve</span>
                </button> -->

                <button
                  @click="updateItemStatus(item, 'declined')"
                  :disabled="
                    item.loadingDecline ||
                    item.credit_debit_approval === 'declined'
                  "
                  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  :class="
                    item.credit_debit_approval === 'declined' ||
                    item.loadingDecline
                      ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
                      : '!bg-red-600 !text-white hover:bg-red-700 active:scale-95'
                  "
                >
                  <span v-if="item.loadingDecline">Processing...</span>
                  <span v-else-if="item.credit_debit_approval === 'declined'"
                    >Declined</span
                  >
                  <span v-else>Decline</span>
                </button>
                <!-- <button
                  @click="updateItemStatus(item, 'declined')"
                  :disabled="
                    item.loadingDecline ||
                    item.credit_debit_approval === 'declined'
                  "
                  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  :class="
                    item.credit_debit_approval === 'declined'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  "
                >
                  <span v-if="item.loadingDecline">Processing...</span>
                  <span v-else-if="item.credit_debit_approval === 'declined'"
                    >Declined</span
                  >
                  <span v-else>Decline</span>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
        <TailwindPagination
          :data="items"
          @pagination-change-page="getData"
          :limit="2"
        />
      </div>

      <GetData v-else-if="loading"> Getting History </GetData>

      <p v-else>No History</p>
    </div>
  </div>
</template>
