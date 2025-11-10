<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import IconEye from "../icons/IconEye.vue";
import axios from "axios";
// import DetailPopup from "./popups/DetailPopup.vue";
import { TailwindPagination } from "laravel-vue-pagination";
// import { useModal } from "vue-final-modal";s
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

const headerTitles = [
  "User Identifier",
  "Application Date",
  "Business Name",
  "EOI Status",
  "Status",
  "Details",
];

const applicationInfo = ref({});

async function getData(page = 1) {
  loading.value = true;

  const apiUrl = props.task ? "getstreetlamptask" : "getstreetlamp";

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
    const response = await axios.get(`${apiUrl}?${queryString}`);
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
    <table class="w-full mt-6">
      <thead class="border-b-[1px] border-b-gray-900 bg-slate-50">
        <tr>
          <th
            v-for="(header, index) in headerTitles"
            :key="index"
            class="xs:text-sm text-xs font-medium text-gray-700 lg:w-[14.5%] w-1/3 text-left p-2.5 whitespace-nowrap"
            scope="col"
            :class="{
              'hidden lg:table-cell': [
                'User Identifier',
                'EOI Status',
                'Application Date',
              ].includes(header),
              'hidden sm:table-cell': header === 'Status',
            }"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="app in applicationInfo.data" :key="app.id" class="even:bg-slate-50 *:whitespace-nowrap">
          <td
            class="p-2.5 text-xs xs:text-sm hidden lg:table-cell"
            v-text="app.user_id"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm hidden lg:table-cell"
            v-text="formatDate(app.created_at)"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm"
            v-text="app.user?.business_name || 'No User'"
          ></td>
          <!-- <td class="p-2.5 text-xs xs:text-sm" v-text="app.vehicle_type"></td> -->
          <td class="p-2.5 hidden lg:table-cell text-xs xs:text-sm">
            <IconAppStatus :status="app.eoi_status" />
          </td>
          <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
            <IconAppStatus :status="app.status" />
          </td>
          <td class="p-2.5 text-xs xs:text-sm">
            <a
              :href="`requests/street-app-detail/${app.id}`"
              class="flex gap-2.5 w-fit"
              target="_blank"
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
