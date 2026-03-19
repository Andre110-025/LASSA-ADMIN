<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import { useHelpers } from "../../helper";
import { useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import ConfirmApproveDecline from "./ConfirmApproveDecline.vue";
import { useModal } from "vue-final-modal";
import IconSearch from "../icons/IconSearch.vue";

const search = ref("");
const items = ref([]);
const loading = ref(false);
const { formatDate, formatCurrency } = useHelpers();

const getData = async () => {
  loading.value = true;
  items.value = [];

  try {
    const response = await axios.get("debitcreditadminlist", {
      params: {
        search: search.value,
      },
    });
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
      id: item.id
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

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => {
    const getPriority = (status) => {
      // If status is null, undefined, empty string, or explicitly "pending"
      if (!status || status === "pending") return 0;
      if (status === "approved") return 1;
      if (status === "declined") return 2;
      return 3;
    };

    return (
      getPriority(a.credit_debit_approval) -
      getPriority(b.credit_debit_approval)
    );
  });
});

const openConfirmAction = (item, status) => {
  const { open, close } = useModal({
    component: ConfirmApproveDecline,
    attrs: {
      item,
      status,
      async onConfirm(comment) {
        // 1. Find the index of the item to ensure reactivity
        const index = items.value.findIndex((i) => i.id === item.id);
        if (index === -1) return;

        const loadingKey =
          status === "approved" ? "loadingApprove" : "loadingDecline";
        items.value[index][loadingKey] = true;

        try {
          const payload = {
            amount: item.amount,
            productType: item.single_muiltiple,
            OnpremiseId: item.onpremise_id,
            type: item.credit_debit_type,
            status,
            comment,
            id: item.id
          };

          await axios.post("debitcreditadminapproval", payload);

          // 2. Update the original array item
          items.value[index].credit_debit_approval = status;
          items.value[index].comment = comment; // Update the comment too!
        } catch (error) {
          console.error(error);
        } finally {
          items.value[index][loadingKey] = false;
          close();
        }
      },
    },
  });

  open();
};

let delaySearch = null
watch(search, (newValue) => {
  if (delaySearch) {
    clearTimeout(delaySearch)
  }
  delaySearch = setTimeout(() => {
    getData()
  }, 1500);
})

// @keyup.enter="getData"
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl flex flex-row justify-between items-center">
      <h4 class="text-xl">Debit/Credit Approval</h4>

      <div class="relative block">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-7 text-sm border-solid outline-none focus:border-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          name=""
          v-model="search"
          
        />
        <IconSearch class="absolute top-1.5 right-2 w-6" />
      </div>
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg">
      <div v-if="items.length && !loading">
        <div class="w-full overflow-x-auto shadow-sm rounded-lg">
          <table class="w-full min-w-[800px]">
            <thead>
              <tr
                class="border-b-[.0938rem] border-gray-900 bg-slate-50 *:whitespace-nowrap"
              >
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Type
                </th>
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Business Name
                </th>
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Customer Id
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
                  Documents
                </th>
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Comment
                </th>
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Debit/Credit Document
                </th>
                <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in sortedItems"
                :key="item.id"
                class="even:bg-slate-50 hover:bg-slate-100 transition border-b last:border-0"
              >
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
                  {{ item.type }}
                </td>
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
                  {{ item.onpremise.user.business_name }}
                </td>
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
                  {{ item.onpremise.user.id }}
                </td>
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
                  {{ formatCurrencyLocal(item.amount) }}
                </td>
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
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
                <td class="p-2.5 text-xs xs:text-sm whitespace-nowrap">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="p-2.5 text-xs xs:text-sm">
                  <a
                    v-if="item.admin_document"
                    :href="item.admin_document"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline transition"
                  >
                    View PDF
                  </a>
                  <span v-else class="text-gray-400 italic">No PDF</span>
                </td>

                <td
                  class="p-2.5 text-xs xs:text-sm min-w-[200px] max-w-[300px] break-words leading-relaxed"
                >
                  {{ item.comment || "N/A" }}
                </td>

                <td class="p-2.5 text-xs xs:text-sm">
                  <a
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline transition"
                  >
                    View Debit/Credit 
                  </a>
                  <span v-else class="text-gray-400 italic">No Debit/Credit</span>
                </td>

                <td
                  class="p-2.5 text-xs xs:text-sm flex gap-2 whitespace-nowrap"
                >
                  <button
                    @click="openConfirmAction(item, 'approved')"
                    :disabled="
                      item.loadingApprove ||
                      (item.credit_debit_approval &&
                        item.credit_debit_approval !== 'pending')
                    "
                    class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                    :class="
                      (item.credit_debit_approval &&
                        item.credit_debit_approval !== 'pending') ||
                      item.loadingApprove
                        ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
                        : '!bg-blue-600 !text-white hover:bg-blue-700 active:scale-95'
                    "
                  >
                    <span v-if="item.loadingApprove">Processing...</span>
                    <span v-else class="text-white">Approve</span>
                  </button>
                  <button
                    @click="openConfirmAction(item, 'declined')"
                    :disabled="
                      item.loadingDecline ||
                      (item.credit_debit_approval &&
                        item.credit_debit_approval !== 'pending')
                    "
                    class="px-3 py-1.5 rounded-md text-xs font-medium transition"
                    :class="
                      (item.credit_debit_approval &&
                        item.credit_debit_approval !== 'pending') ||
                      item.loadingDecline
                        ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
                        : '!bg-red-600 !text-white hover:bg-red-700 active:scale-95'
                    "
                  >
                    <span v-if="item.loadingDecline">Processing...</span>
                    <span v-else class="text-white">Decline</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4">
          <TailwindPagination
            :data="items"
            @pagination-change-page="getData"
            :limit="2"
          />
        </div>
      </div>

      <GetData v-else-if="loading"> Getting History </GetData>
      <p v-else>No History</p>
    </div>
  </div>
</template>
