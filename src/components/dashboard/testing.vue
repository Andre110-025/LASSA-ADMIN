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

const getData = async () => {
  loading.value = true;
  items.value = [];

  try {
    const response = await axios.get("end-point");
    if (response.status === 200) {
      items.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});

import { ref } from "vue";
import axios from "axios";

const loading = ref(false);

const selectedFile = ref(null);
const base64File = ref(null);
const fileName = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  fileName.value = file.name;
  selectedFile.value = file;

  const reader = new FileReader();

  reader.onload = () => {
    base64File.value = reader.result;
    console.log("Base64:", base64File.value);
  };

  reader.readAsDataURL(file);
};

const uploadDocument = async () => {
  if (!base64File.value) {
    alert("Please select a file first");
    return;
  }

  loading.value = true;

  try {
    const payload = {
      file: base64File.value,

      file_name: fileName.value,

      // optional extra data
      application_id: 25,
    };

    const response = await axios.post("/upload-endpoint", payload);

    console.log("Uploaded:", response.data);

    alert("Upload successful");
  } catch (error) {
    console.error(error);

    alert("Upload failed");
  } finally {
    loading.value = false;
  }
};

const fileName = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  fileName.value = file.name;

  const reader = new FileReader();

  reader.onload = () => {
    noticeData.value.document = reader.result;
  };

  reader.readAsDataURL(file);
};

import { computed } from "vue";

const letters = computed(() =>
  arrears.receipts?.filter((r) => r.type === "Letter"),
);

const invoices = computed(() =>
  arrears.receipts?.filter((r) => r.type === "Invoice"),
);

const debitCredits = computed(() =>
  arrears.receipts?.filter((r) => r.type === "Debit" || r.type === "Credit"),
);

const updateItemStatus = async (item, status) => {
  item.loading = true;

  try {
    const payload = {
      amount: item.amount,
      productType: item.single_muiltiple,
      OnpremiseId: item.onpremise_id,
      type: item.type,
      status: status, // dynamic
    };

    await axios.post("debitcreditadminapproval", payload);

    item.credit_debit_approval =
      status === "approved" ? "Approved" : "Declined";
  } catch (error) {
    console.log(error);
  } finally {
    item.loading = false;
  }
};

onMounted(() => {
  getData();
});

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



import { computed, ref } from "vue";

const openSection = ref(null);

const groupedReceipts = computed(() => {
  if (!arrears.receipts) return {};

  return arrears.receipts.reduce((acc, receipt) => {
    if (!acc[receipt.type]) {
      acc[receipt.type] = [];
    }
    acc[receipt.type].push(receipt);
    return acc;
  }, {});
});

const toggleSection = (type) => {
  openSection.value = openSection.value === type ? null : type;
};

const groupedReceipts = computed(() => {
  if (!arrears.value.receipts) return {};

  return arrears.value.receipts.reduce((acc, receipt) => {
    if (!acc[receipt.type]) {
      acc[receipt.type] = [];
    }
    acc[receipt.type].push(receipt);
    return acc;
  }, {});
});

import { computed } from "vue";

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => {
    const getPriority = (status) => {
      if (!status) return 0;          // Pending
      if (status === "approved") return 1;
      if (status === "declined") return 2;
      return 3;
    };

    return getPriority(a.credit_debit_approval) - 
           getPriority(b.credit_debit_approval);
  });
});

// for parent table
import { ref } from "vue";

const showConfirmModal = ref(false);
const selectedItem = ref(null);
const selectedAction = ref(""); // 'approved' or 'declined'

const openConfirmModal = (item, action) => {
  selectedItem.value = item;
  selectedAction.value = action;
  showConfirmModal.value = true;
};

const confirmAction = async () => {
  if (!selectedItem.value || !selectedAction.value) return;

  await updateItemStatus(selectedItem.value, selectedAction.value);

  showConfirmModal.value = false;
  selectedItem.value = null;
  selectedAction.value = "";
};

const openConfirmAction = (item, status) => {
  const { open, close } = useModal({
    component: ConfirmApproveDecline,
    attrs: {
      item,
      status,
      async onConfirm(comment) {
        const loadingKey =
          status === "approved" ? "loadingApprove" : "loadingDecline";

        item[loadingKey] = true;

        try {
          const payload = {
            amount: item.amount,
            productType: item.single_muiltiple,
            OnpremiseId: item.onpremise_id,
            type: item.credit_debit_type,
            status,
            comment,
          };

          await axios.post("debitcreditadminapproval", payload);

          item.credit_debit_approval = status;
        } catch (error) {
          console.log(error);
        } finally {
          item[loadingKey] = false;
          close();
        }
      },
    },
  });

  open();
};

const sortedItems = computed(() => {
  const query = search.value.toLowerCase().trim();

  // 1️⃣ Filter
  let filtered = items.value.filter((item) => {
    if (!query) return true;

    return (
      item.type?.toLowerCase().includes(query) ||
      item.onpremise?.user?.business_name?.toLowerCase().includes(query) ||
      String(item.onpremise?.user?.id)?.includes(query) ||
      String(item.amount)?.includes(query) ||
      item.credit_debit_approval?.toLowerCase().includes(query)
    );
  });

  // 2️⃣ Sort (your priority logic)
  return filtered.sort((a, b) => {
    const getPriority = (status) => {
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

const getData = async () => {
  loading.value = true;

  try {
    const response = await axios.get("debitcreditadminlist", {
      params: {
        search: search.value,
      },
    });

    if (response.status === 200) {
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

</script>

<template>
<VueFinalModal
  v-model="showConfirmModal"
  class="flex h-full w-full justify-center items-center"
  content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] min-h-[350px] h-fit max-h-dvh overflow-y-auto max-w-[340px]"
  overlay-class="bg-background/80 backdrop-blur-sm"
>
  <div class="w-full h-fit flex flex-col items-center justify-center p-5 space-y-4">
    <h1 class="text-lg font-semibold text-gray-800">
      Confirm {{ selectedAction === 'approved' ? 'Approval' : 'Decline' }} ?
    </h1>

    <p class="text-sm text-gray-500">
      This action cannot be undone.
    </p>

    <div class="flex space-x-2">
      <button
        @click="confirmAction"
        class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
      >
        Confirm
      </button>

      <button
        @click="showConfirmModal = false"
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
</VueFinalModal>

<div class="flex flex-col text-sm divide-y">
  <div
    v-for="(receipts, type) in groupedReceipts"
    :key="type"
    class="py-3"
  >
    <!-- Accordion Header -->
    <div
      @click="toggleSection(type)"
      class="flex items-center justify-between cursor-pointer font-semibold text-red-600"
    >
      <span class="uppercase">{{ type }}</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': openSection === type }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Accordion Body -->
    <div v-if="openSection === type" class="mt-3 space-y-3">
      <div
        v-for="receipt in receipts"
        :key="receipt.id"
        class="pl-3 border-l"
      >
        <div class="flex items-center justify-between">
          <a
            :href="receipt.link"
            target="_blank"
            class="text-mainColor font-medium hover:underline"
          >
            View Document
          </a>

          <a
            v-if="receipt.admin_document"
            :href="receipt.admin_document"
            target="_blank"
            class="ml-2 text-xs font-semibold opacity-70 hover:opacity-100"
          >
            Admin uploaded document
          </a>
        </div>

        <p class="text-gray-400 text-xs mt-1">
          {{
            new Date(receipt.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }}
        </p>
      </div>
    </div>
  </div>

  <p
    v-if="!arrears.receipts || arrears.receipts.length === 0"
    class="text-gray-400 py-3"
  >
    No Documents available
  </p>
</div>

  <td class="p-2.5 text-xs xs:text-sm flex gap-2">
    <!-- Approve -->
    <button
      @click="updateItemStatus(item, 'approved')"
      :disabled="item.loading || item.credit_debit_approval === 'Approved'"
      class="px-3 py-1.5 rounded-md text-white text-xs font-medium transition"
      :class="
        item.credit_debit_approval === 'Approved'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
      "
    >
      <span v-if="item.loading">Processing...</span>
      <span v-else-if="item.credit_debit_approval === 'Approved'">
        Approved
      </span>
      <span v-else>Approve</span>
    </button>

    <!-- Decline -->
    <button
      @click="updateItemStatus(item, 'declined')"
      :disabled="item.loading || item.credit_debit_approval === 'Declined'"
      class="px-3 py-1.5 rounded-md text-white text-xs font-medium transition"
      :class="
        item.credit_debit_approval === 'Declined'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 active:scale-95'
      "
    >
      <span v-if="item.loading">Processing...</span>
      <span v-else-if="item.credit_debit_approval === 'Declined'">
        Declined
      </span>
      <span v-else>Decline</span>
    </button>
  </td>

  <!-- LETTER -->
  <select class="border rounded p-2 text-sm">
    <option value="">Select Letter</option>

    <option v-for="letter in letters" :key="letter.id" :value="letter.link">
      Letter - {{ new Date(letter.created_at).toLocaleDateString("en-GB") }}
    </option>
  </select>

  <!-- INVOICE -->
  <select class="border rounded p-2 text-sm">
    <option value="">Select Invoice</option>

    <option v-for="invoice in invoices" :key="invoice.id" :value="invoice.link">
      Invoice - {{ new Date(invoice.created_at).toLocaleDateString("en-GB") }}
    </option>
  </select>

  <!-- DEBIT / CREDIT -->
  <select class="border rounded p-2 text-sm">
    <option value="">Select Debit/Credit</option>

    <option v-for="doc in debitCredits" :key="doc.id" :value="doc.link">
      {{ doc.type }} -
      {{ new Date(doc.created_at).toLocaleDateString("en-GB") }}
    </option>
  </select>

  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl">
      <h4 class="text-xl mb-5">Onpremise Transaction History</h4>
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg">
      <div class="w-full" v-if="payments.length && !loading">
        <table class="w-full">
          <thead>
            <tr
              class="border-b-[.0938rem] border-gray-900 bg-slate-50 *:whitespace-nowrap"
            >
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Payment Purpose
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Reference Id
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
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in payments"
              :key="index"
              class="even:bg-slate-50"
            >
              <td class="p-2.5 text-xs xs:text-sm">
                {{ item.application_purpose }}
              </td>
              <td class="p-2.5 text-xs xs:text-sm">{{ item.reference_id }}</td>
              <td class="p-2.5 text-xs xs:text-sm">
                {{ formatCurrency(item.amount_paid) }}
              </td>
              <td class="p-2.5 text-xs xs:text-sm">{{ item.status }}</td>
              <td class="p-2.5 text-xs xs:text-sm">
                {{ timeFormat(item.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <GetData v-else-if="loading"> Getting History </GetData>

      <!-- <NoList :showBtn="false" v-else>
        <template #description> No History </template>
      </NoList> -->
      <p v-else>No History</p>
    </div>
  </div>

  <div class="my-5">
    <input
      type="file"
      @change="handleFileUpload"
      accept=".pdf,.jpg,.jpeg,.png"
    />
  </div>

  <div class="inputHolder">
    <input
      type="file"
      id="document"
      class="hidden"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="handleFileUpload"
      required
    />

    <label
      for="document"
      class="input peer cursor-pointer flex items-center justify-between"
    >
      <span :class="['text-sm', fileName ? 'text-gray-800' : 'text-gray-400']">
        {{ fileName || "Upload Document" }}
      </span>

      <!-- icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-mainColor"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16V4m0 0L3 8m4-4l4 4m6 8v4m0 0l-4-4m4 4l4-4"
        />
      </svg>
    </label>

    <label class="inputLabel">Upload Document</label>
  </div>

  <div class="flex flex-col text-sm divide-y">
    <div
      v-for="receipt in arrears.receipts"
      :key="receipt.id"
      class="py-3 group"
    >
      <!-- Top row -->
      <div class="flex items-center justify-between">
        <!-- Left side -->
        <a
          :href="receipt.link"
          target="_blank"
          class="text-red-600 font-medium hover:underline"
        >
          {{ receipt.type }}
        </a>

        <!-- Right side PDF -->
        <a
          v-if="receipt.admin_document"
          :href="receipt.admin_document"
          target="_blank"
          class="text-mainColor text-xs font-semibold opacity-70 group-hover:opacity-100 transition flex items-center gap-1"
        >
          View PDF

          <!-- arrow -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      <!-- Date -->
      <p class="text-gray-400 text-xs mt-1">
        {{
          new Date(receipt.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        }}
      </p>
    </div>

    <!-- Empty state -->
    <p
      v-if="!arrears.receipts || arrears.receipts.length === 0"
      class="text-gray-400 py-3"
    >
      No Documents available
    </p>
  </div>

  <a
    v-for="receipt in arrears.receipts"
    :key="receipt.id"
    :href="receipt.link"
    target="_blank"
    class="text-sm text-red-600 hover:underline"
  >
    {{ receipt.type }}
    <span class="text-gray-400 text-xs ml-1">
      ({{ new Date(receipt.created_at).toLocaleDateString() }})
    </span>
    <div class="flex flex-col text-sm">
      <p v-if="!receipt.admin_document">
        <a
          :href="receipt.admin_document"
          target="_blank"
          class="text-sm text-red-600"
          >View PDF</a
        >
      </p>
      <p v-else>.</p>
    </div>
  </a>
  <p
    v-if="!arrears.receipts || arrears.receipts.length === 0"
    class="text-gray-400"
  >
    No Documents available
  </p>

  <div class="flex xs:flex-row align-middle">
    <p class="w-2/5 text-sm font-semibold">Documents</p>
    <div class="flex flex-col text-sm divide-y">
      <div
        v-for="receipt in arrears.receipts"
        :key="receipt.id"
        class="py-3 group"
      >
        <div class="flex items-center justify-between">
          <a
            :href="receipt.link"
            target="_blank"
            class="text-red-600 font-medium hover:underline"
          >
            {{ receipt.type }}
          </a>

          <a
            v-if="receipt.admin_document"
            :href="receipt.admin_document"
            target="_blank"
            class="ml-[10px] text-mainColor text-xs font-semibold opacity-70 group-hover:opacity-100 transition flex items-center gap-1"
          >
            Admin uploaded document
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <p class="text-gray-400 text-xs mt-1">
          {{
            new Date(receipt.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }}
        </p>
      </div>

      <p
        v-if="!arrears.receipts || arrears.receipts.length === 0"
        class="text-gray-400 py-3"
      >
        No Documents available
      </p>
    </div>
  </div>

  <div class="flex xs:flex-row align-middle">
    <p class="w-2/5 text-sm font-semibold">Documents</p>

    <!-- Show selects only if status is NOT null or declined -->
    <div
      v-if="
        receipts.credit_debit_approval !== null &&
        receipts.credit_debit_approval !== 'declined'
      "
      class="grid grid-cols-2 gap-3 w-full text-sm"
    >
      <div class="relative w-full" v-if="letters?.length">
        <select @change="openDoc($event)" class="...">
          <option value="">Letter</option>
          <option v-for="l in letters" :key="l.id" :value="l.link">
            {{ l.type }} — {{ formatDate(l.created_at) }}
          </option>
        </select>
        <!-- custom arrow -->
      </div>

      <div class="relative w-full" v-if="invoices?.length">
        <select @change="openDoc($event)" class="...">
          <option value="">Invoice</option>
          <option v-for="inv in invoices" :key="inv.id" :value="inv.link">
            {{ inv.type }} — {{ formatDate(inv.created_at) }}
          </option>
        </select>
        <!-- custom arrow -->
      </div>

      <!-- repeat same for debitNote and creditNote -->
    </div>

    <!-- Show empty message if null or declined -->
    <p v-else class="text-gray-400 col-span-2">No Documents available</p>
  </div>

  <div class="flex xs:flex-row align-middle">
    <p class="w-2/5 text-sm font-semibold">Documents</p>

    <div
      v-if="
        receipts.length > 0 &&
        receipts.some(
          (r) =>
            r.credit_debit_approval !== null &&
            r.credit_debit_approval !== 'declined',
        )
      "
      class="grid grid-cols-2 gap-3 w-full text-sm"
    >
      <div class="relative w-full" v-if="letters?.length"></div>
    </div>

    <div v-else-if="receipts.length > 0" class="w-full text-sm">
      <p class="text-gray-400">
        Documents are pending approval or have been declined.
      </p>
    </div>

    <div v-else class="w-full text-sm">
      <p class="text-gray-400">No documents found.</p>
    </div>
  </div>


  <button
  @click="updateItemStatus(item, 'approved')"
  :disabled="item.loadingApprove || item.credit_debit_approval === 'approved'"
  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
  :class="
    item.credit_debit_approval === 'approved' || item.loadingApprove
      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
  "
>
  <span v-if="item.loadingApprove">Processing...</span>
  <span v-else-if="item.credit_debit_approval === 'approved'">Approved</span>
  <span v-else class="text-white">Approve</span>
</button>

<button
  @click="updateItemStatus(item, 'declined')"
  :disabled="item.loadingDecline || item.credit_debit_approval === 'declined'"
  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
  :class="
    item.credit_debit_approval === 'declined' || item.loadingDecline
      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
      : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
  "
>
  <span v-if="item.loadingDecline">Processing...</span>
  <span v-else-if="item.credit_debit_approval === 'declined'">Declined</span>
  <span v-else>Decline</span>
</button>




<!-- <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Documents</p>
        <div
          v-if="
            receipts.length > 0 &&
            receipts.some(
              (r) =>
                r.credit_debit_approval !== null &&
                r.credit_debit_approval !== 'declined',
            )
          "
          class="grid grid-cols-2 gap-3 w-full text-sm"
        >
          <div class="relative w-full" v-if="letters?.length">
            <select
              @change="openDoc($event)"
              class="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor hover:border-gray-400 transition"
            >
              <option value="">Letter</option>

              <option v-for="l in letters" :key="l.id" :value="l.link">
                {{ l.type }} — {{ formatDate(l.created_at) }}
              </option>
            </select>

            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div class="relative w-full" v-if="invoices?.length">
            <select
              @change="openDoc($event)"
              class="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor hover:border-gray-400 transition"
            >
              <option value="">Invoice</option>

              <option v-for="inv in invoices" :key="inv.id" :value="inv.link">
                {{ inv.type }} — {{ formatDate(inv.created_at) }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div class="relative w-full" v-if="debitNote?.length">
            <select
              @change="openDoc($event)"
              class="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor hover:border-gray-400 transition"
            >
              <option value="">Debit Note</option>

              <option v-for="det in debitNote" :key="det.id" :value="det.link">
                {{ det.type }} — {{ formatDate(det.created_at) }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div class="relative w-full" v-if="creditNote?.length">
            <select
              @change="openDoc($event)"
              class="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor hover:border-gray-400 transition"
            >
              <option value="">Credit Note</option>

              <option v-for="cre in creditNote" :key="cre.id" :value="cre.link">
                {{ cre.type }} — {{ formatDate(cre.created_at) }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div v-else-if="receipts.length > 0" class="w-full text-sm">
          <p class="text-gray-400">
            Documents not found.
          </p>
        </div>

        <div v-else class="w-full text-sm">
          <p class="text-gray-400">No documents found.</p>
        </div>
      </div> -->
</template>

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

  <script setup>
import { ref } from "vue";
import { VueFinalModal } from "vue-final-modal";

const props = defineProps({
  item: Object,
  status: String,
  onConfirm: Function,
});

const comment = ref("");

const submit = () => {
  props.onConfirm(comment.value);
};
</script> 

<template>
  <VueFinalModal
    class="flex items-center justify-center"
    content-class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4"
  >
    <h2 class="text-lg font-semibold">
      Confirm {{ status === "approved" ? "Approval" : "Decline" }}
    </h2>

    <textarea
      v-model="comment"
      rows="4"
      placeholder="Enter comment..."
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    ></textarea>

    <div class="flex justify-end gap-2">
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 rounded-md"
      >
        Cancel
      </button>

      <button
        @click="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Confirm
      </button>
    </div>
  </VueFinalModal>
</template>
</template>

<template>

  <button
  @click="openConfirmAction(item, 'approved')"
  :disabled="item.loadingApprove || item.credit_debit_approval"
  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
  :class="
    item.credit_debit_approval || item.loadingApprove
      ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
      : '!bg-blue-600 !text-white hover:bg-blue-700 active:scale-95'
  "
>
  <span v-if="item.loadingApprove">Processing...</span>
  <span v-else class="text-white">Approve</span>
</button>

<button
  @click="openConfirmAction(item, 'declined')"
  :disabled="item.loadingDecline || item.credit_debit_approval"
  class="px-3 py-1.5 rounded-md text-xs font-medium transition"
  :class="
    item.credit_debit_approval || item.loadingDecline
      ? '!bg-gray-400 !text-gray-200 cursor-not-allowed'
      : '!bg-red-600 !text-white hover:bg-red-700 active:scale-95'
  "
>
  <span v-if="item.loadingDecline">Processing...</span>
  <span v-else class="text-white">Decline</span>
</button>

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
                Documents
              </th>
              <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in sortedItems" :key="item.id"
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

              <td class="p-2.5 text-xs xs:text-sm">
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

  <span v-else class="text-gray-400 italic">
    No PDF
  </span>
</td>

              <td class="p-2.5 text-xs xs:text-sm">
                {{ item.comment || 'N/A' }}
              </td>

              <td class="p-2.5 text-xs xs:text-sm flex gap-2">
                <button
                  @click="openConfirmAction(item, 'approved')"
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
                  <span class="text-white" v-else-if="item.credit_debit_approval === 'approved'"
                    >Approved</span
                  >
                  <span v-else class="text-white">Approve</span>
                </button>
                <button
                  @click="openConfirmAction(item, 'declined')"
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
                  <span class="!text-white" v-else-if="item.credit_debit_approval === 'declined'"
                    >Declined</span
                  >
                  <span v-else class="!text-white">Decline</span>
                </button>
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