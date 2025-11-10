<script setup>
import { ref, reactive, computed } from "vue";
import OverMobileStats from "./OverMobileStats.vue";
import OverviewOnPremise from "./OverviewOnPremise.vue";
import OverviewOutdoor from "./OverviewOutdoor.vue";
import OverPavStats from "./OverPavStats.vue";
import OverTemporaryStats from "./OverTemporaryStats.vue";
import OverSmallFormatStats from "./OverSmallFormatStats.vue";
import OverStreetLampStats from "./OverStreetLampStats.vue";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "./../../helper";
import FilterButton from "./buttons/request/FilterButton.vue";
import TimelineFilterButton from "./buttons/TimelineFilterButton.vue";
import IconLoading from "../icons/IconLoading.vue";
import CSVDownloadButton from "./CSVDownloadButton.vue";

const userStore = useUserStore();
const { getCat, lagosLGAs } = useHelpers();

const getFormattedDate = (date) => date.toISOString().split("T")[0];

const today = new Date();
// Get the start of the current year (January 1st)
const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

const advertTypes = getCat(
  userStore.userDetails.userInfo.admin_role_id,
  userStore.userDetails.userInfo.department
).filter((type) => type !== "Third Party Application");

// I want to remove "Third Party Application" from the list of advert types
const filteredAdvertTypes = advertTypes.filter(
  (type) => type !== "Third Party Application"
);

// const canAccessRevenue = ![1, 2, 3, 10, 11].includes(
//   userStore.userDetails.userInfo.admin_role_id
// );

// const canAccessRevenue = computed(() => {
//   if ([1, 2, 3, 10, 11].includes(userStore.userDetails.userInfo.admin_role_id)) {
//     return false;
//   } else if (
//     userStore.userDetails.userInfo.admin_role_id === 1 &&
//     userStore.userDetails.userInfo.department === "Billings"
//   ) {
//     return false;
//   } else {
//     return true;
//   }
// })

const canAccessRevenue = !(
  [1, 2, 3, 10, 11].includes(parseInt(userStore.userDetails.userInfo.admin_role_id)) ||
  (parseInt(userStore.userDetails.userInfo.admin_role_id) == 1 &&
    userStore.userDetails.userInfo.department == "Billings")
);

const advertType = ref(advertTypes[0]);

// Default start and end date to 7 days ago and today in dd-mm-yyyy format
const date = reactive({
  start_date: getFormattedDate(startOfYear),
  end_date: getFormattedDate(today),
});

const lga = ref("");

const setDateRange = (days = 7) => {
  // console.log(days);
  const start = new Date();
  start.setDate(today.getDate() - days);
  date.start_date = getFormattedDate(start);
  date.end_date = getFormattedDate(today);
};

function updateCat(n) {
  advertType.value = n;
  lga.value = "";
}

const isChildLoading = ref(true);

const handleLoadingChange = (loadingState) => {
  isChildLoading.value = loadingState;
  // Now you can use isChildLoading in your parent component
};
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex sm:flex-row flex-col gap-4 justify-between">
      <div>
        <h4 class="text-2xl text-gray-700">{{ advertType }} Overview</h4>
        <IconLoading v-if="isChildLoading" />
      </div>
      <FilterButton
        v-if="advertTypes.length > 1"
        :options="advertTypes"
        @change-cat="updateCat"
      />
    </div>

    <div class="mt-5">
      <div class="flex flex-col sm:flex-row justify-end gap-2.5">
        <div
          v-if="advertType === 'On Premise' || advertType === 'Outdoor Site'"
        >
          <select
            class="text-mainColor outline-none bg-blue-100 border-none hover:border border-mainColor text-xs rounded-md px-2.5 py-1"
            v-model="lga"
            name="lga"
            id="lga"
          >
            <option selected value="">All LGAs</option>
            <option v-for="(lga, index) in lagosLGAs" :key="index" :value="lga">
              {{ lga }}
            </option>
          </select>
        </div>
        <TimelineFilterButton @updateRange="(n) => setDateRange(n)" />
        <div class="hidden sm:block">
          <input
            class="text-mainColor bg-blue-100 border-none hover:border border-mainColor text-xs rounded-md px-2.5 py-1"
            type="date"
            v-model="date.start_date"
          />
          <span class="mx-2 text-xs">to</span>
          <input
            class="text-mainColor bg-blue-100 border-none hover:border border-mainColor text-xs rounded-md px-2.5 py-1"
            type="date"
            v-model="date.end_date"
          />
        </div>
      </div>
      <div class="flex justify-end mt-2">
        <CSVDownloadButton
          v-if="advertType !== 'Third Party Application'"
          :productType="advertType"
          :payload="{
            start_date: date.start_date,
            end_date: date.end_date,
            lga: lga,
          }"
        />
      </div>
    </div>
  </div>

  <div class="lg:container mx-auto mt-4">
    <OverviewOnPremise
      @loadingChange="handleLoadingChange"
      :lga="lga"
      :date="date"
      v-if="advertType === 'On Premise'"
      :accessRev="canAccessRevenue"
    />
    <OverMobileStats
      @loadingChange="handleLoadingChange"
      :date="date"
      v-else-if="advertType === 'Mobile First Party'"
      :accessRev="canAccessRevenue"
    />
    <OverPavStats
      @loadingChange="handleLoadingChange"
      :date="date"
      v-else-if="advertType === 'Mobile Third Party'"
      :accessRev="canAccessRevenue"
    />
    <OverTemporaryStats
      @loadingChange="handleLoadingChange"
      :date="date"
      v-else-if="advertType === 'Temporary Advert'"
      :accessRev="canAccessRevenue"
    />
    <OverSmallFormatStats
      @loadingChange="handleLoadingChange"
      :date="date"
      v-else-if="advertType === 'Small Format'"
      :accessRev="canAccessRevenue"
    />
    <OverStreetLampStats
      @loadingChange="handleLoadingChange"
      :date="date"
      v-else-if="advertType === 'Street Lamp Pole'"
      :accessRev="canAccessRevenue"
    />
    <OverviewOutdoor
      @loadingChange="handleLoadingChange"
      :lga="lga"
      :date="date"
      v-else-if="advertType === 'Outdoor Site'"
      :accessRev="canAccessRevenue"
    />
  </div>
</template>
