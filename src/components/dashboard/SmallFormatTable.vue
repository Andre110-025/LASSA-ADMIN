<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import IconEye from "../icons/IconEye.vue";

const loading = ref(false);

const props = defineProps({
  status: {
    type: String,
    default: "",
  },
  search: {
    type: String,
    default: "",
  },
  lga: {
    type: String,
    default: "",
  },
  date: {
    type: Object,
    default: {
      start_date: "",
      end_date: "",
    },
  },
  task: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const getEndPoint = () => {
  if (props.task) {
    return "getsmallformattask";
  } else {
    return "adminsearchsmallformat";
  }
};

const applicationInfo = ref({});

async function getData(page = 1) {
  loading.value = true;
  applicationInfo.value = {};

  // Base parameters
  const params = {
    search: props.search,
    status: props.status,
    page: page,
  };

  // Only include lga and date parameters when task is false
  if (!props.task) {
    params.lga = props.lga;

    const { start_date, end_date } = props.date;
    if (props.date.start_date && props.date.end_date) {
      params.start_date = props.date.start_date;
      params.end_date = props.date.end_date;
    }
  }

  // Convert params object to query string
  const queryString = new URLSearchParams(params).toString();

  try {
    const response = await axios.get(`${getEndPoint()}?${queryString}`);
    // console.log(response);
    if (response.status === 200) {
      applicationInfo.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

watch(
  () => props.status,
  () => {
    getData(1);
  }
);

// Watch for changes in the date object
watch(
  () => props.date,
  (newDate) => {
    // Only trigger getData when both start_date and end_date are filled
    if (newDate.start_date && newDate.end_date) {
      getData(1);
    }
  },
  { deep: true } // Deep watching is needed since date is an object
);

// Watch for changes in lga
watch(
  () => props.lga,
  (newLga) => {
    getData(1);
  }
);

getData();
</script>

<template>
  <div v-if="applicationInfo.data?.length && !loading">
    <table class="w-full mt-6 table-auto">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr class="*:whitespace-nowrap">
          <th class="text-sm text-gray-700 text-left p-2.5" scope="col">
            User Identifier
          </th>
          <th class="text-sm text-gray-700 text-left p-2.5" scope="col">
            Payment ID
          </th>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden sm:table-cell"
            scope="col"
          >
            App Fee
          </th>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden sm:table-cell"
            scope="col"
          >
            LGA
          </th>
          <th class="text-sm text-gray-700 text-left p-2.5" scope="col">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="app in applicationInfo.data"
          :key="app.id"
          class="even:bg-slate-50 *:whitespace-nowrap"
        >
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.user_id"></td>
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.payment_id"></td>
          <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
            <span
              class="block bg-green-100 text-[#00AE4E] text-xs text-center w-full py-1 px-2 rounded select-none"
              v-if="app.application_pay_status === 'paid'"
              >Paid</span
            >
            <span
              class="block bg-red-100 text-[#f00] text-xs text-center w-full py-1 px-2 rounded select-none"
              v-else
              >Not Paid</span
            >
          </td>
          <td
            class="p-2.5 hidden sm:table-cell text-xs xs:text-sm"
            v-text="app.lga"
          ></td>
          <td class="p-2.5 text-xs xs:text-sm">
            <a
              target="_blank"
              :href="`requests/small-format-detail/${app.id}`"
              class="flex gap-2.5 w-fit"
            >
              <IconEye class="w-4 my-auto" />
              <span class="my-auto w-full">View Details</span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-8">
      <TailwindPagination
        :data="applicationInfo"
        @pagination-change-page="getData"
        class="vue-pagination"
      />
    </div>
  </div>

  <GetData v-else-if="loading"> Getting Application </GetData>

  <NoList v-else @performAction="router.push({ name: 'advertCategory' })">
    <template #description> No Application </template>
    <template #action> Add New Sign </template>
  </NoList>
</template>
