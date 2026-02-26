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
</script>

<template>
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
</template>
