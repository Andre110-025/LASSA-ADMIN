<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import IconEye from "../icons/IconEye.vue";
import axios from "axios";
// import DetailPopup from "./popups/DetailPopup.vue";
import { TailwindPagination } from "laravel-vue-pagination";

import { useHelpers } from "../../helper";

const { formatDate } = useHelpers();

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
  mobileType: String,
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

const getEndPoint = () => {
  if (props.task) {
    return props.mobileType === "Mobile First Party"
      ? "getmobiletask"
      : "getthirdpartymobiletask";
  } else {
    return props.mobileType === "Mobile First Party"
      ? "getmobile"
      : "getthirdpartymobile";
  }
};
const getEndURL = () =>
  props.mobileType === "Mobile First Party" ? "mobile" : "pav";

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
    const response = await axios.get(
      `${getEndPoint()}?${queryString}`
    );
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
  () => props.mobileType,
  () => {
    getData(1);
  }
);

let delaySearch = null;
watch(
  () => props.search,
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
  <div class="w-full overflow-x-auto" v-if="applicationInfo.data?.length && !loading">
    <table class="w-full mt-6">
      <thead class="border-b-[1px] border-b-gray-900 bg-slate-50">
        <tr class="*:whitespace-nowrap">
          <th
            class="xs:text-sm text-xs font-medium text-gray-700 text-left p-2.5 hidden lg:table-cell"
            scope="col"
          >
            User Identifier
          </th>
          <th
            class="xs:text-sm text-xs font-medium text-gray-700 text-left p-2.5"
            scope="col"
          >
            Application Date
          </th>
          <th
            class="xs:text-sm text-xs font-medium text-gray-700 text-left p-2.5"
            scope="col"
          >
            Business Name
          </th>
          <th
            class="xs:text-sm text-xs font-medium text-gray-700 text-left p-2.5 hidden lg:table-cell"
            scope="col"
          >
            Status
          </th>
          <th
            class="xs:text-sm text-xs font-medium text-gray-700 text-left p-2.5 hidden lg:table-cell"
            scope="col"
          >
            Details
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(app, index) in applicationInfo.data" :key="index" class="even:bg-slate-50 *:whitespace-nowrap">
          <td
            class="p-2.5 text-xs xs:text-sm hidden lg:table-cell"
            v-text="app.user_id"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm hidden lg:table-cell"
            v-text="formatDate(app.created_at)"
          ></td>
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.brand_name"></td>
          <td class="p-2.5 hidden lg:table-cell text-xs xs:text-sm">
            <IconAppStatus :status="app.status" />
          </td>
          <td class="p-2.5 text-xs xs:text-sm">
            <a
              :href="`requests/${getEndURL()}-app-detail/${app.id}`"
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
    <div class="flex justify-center mt-8">
      <TailwindPagination
        :data="applicationInfo"
        @pagination-change-page="getData"
        class="vue-pagination"
        :limit="2"
      />
    </div>
  </div>

  <GetData v-else-if="loading">
    Getting {{ props.task ? "Task" : "Applications" }}
  </GetData>

  <NoList :action-btn="false" v-else>
    <template #description>
      No {{ props.task ? "Pending Task" : "Applications" }}
    </template>
  </NoList>
</template>
