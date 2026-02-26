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
      application_id: 25

    };

    const response = await axios.post(
      "/upload-endpoint",
      payload
    );

    console.log("Uploaded:", response.data);

    alert("Upload successful");

  } catch (error) {

    console.error(error);

    alert("Upload failed");

  } finally {

    loading.value = false;

  }
};

const fileName = ref(null)

const handleFileUpload = (event) => {

  const file = event.target.files[0]

  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()

  reader.onload = () => {

    noticeData.value.document = reader.result

  }

  reader.readAsDataURL(file)

}


</script>

<template>
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
    <span
      :class="[
        'text-sm',
        fileName ? 'text-gray-800' : 'text-gray-400'
      ]"
    >
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
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M7 16V4m0 0L3 8m4-4l4 4m6 8v4m0 0l-4-4m4 4l4-4"/>
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5l7 7-7 7"/>
        </svg>

      </a>

    </div>


    <!-- Date -->
    <p class="text-gray-400 text-xs mt-1">
      {{ new Date(receipt.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) }}
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
                  >View PDF</a>
                </p>
                <p v-else>.</p>
              </div>
            </a>
            <p v-if="!arrears.receipts || arrears.receipts.length === 0" class="text-gray-400">
              No Documents available
            </p>

</template>
