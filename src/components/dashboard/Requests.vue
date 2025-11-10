<script setup>
import { ref, reactive } from "vue";
import RequestTypeButton from "./buttons/request/RequestTypeButton.vue";
import FilterButton from "./buttons/request/FilterButton.vue";
import PremiseAppDataTable from "./PremiseAppDataTable.vue";
import MobileDataTable from "./MobileDataTable.vue";
import StreetLampDataTable from "./StreetLampDataTable.vue";
import RequestFormTab from "./buttons/request/RequestFormTab.vue";
import ThirdPartyAppTable from "./ThirdPartyAppTable.vue";
import OutDoorSiteAppTable from "./OutDoorSiteAppTable.vue";
import TemporaryTable from "./TemporaryTable.vue";
import SmallFormatTable from "./SmallFormatTable.vue";
import IconSearch from "../icons/IconSearch.vue";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "./../../helper";

const userStore = useUserStore();
const { getCat, lagosLGAs } = useHelpers();

const advertTypes = getCat(
  userStore.userDetails.userInfo.admin_role_id,
  userStore.userDetails.userInfo.department
);

const advertType = ref(advertTypes[0]);

const status = ref("pending");
const search = ref("");
const lga = ref("");
const date = reactive({
  start_date: "",
  end_date: "",
});

function updateCat(n) {
  advertType.value = n;
  status.value = "pending";
  search.value = "";
  lga.value = "";
  date.start_date = ''
  date.end_date = ''
}
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <h4 class="text-2xl text-gray-700">All Requests</h4>
    <div class="mt-5 flex gap-2.5 justify-end flex-wrap">
      <div v-if="advertType !== 'Mobile Third Party'">
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

      <FilterButton
        v-if="advertTypes.length > 1"
        :options="advertTypes"
        @change-cat="updateCat"
      />
    </div>
    <!-- <div class="flex sm:flex-row flex-col gap-4 justify-between"></div> -->

    <RequestFormTab v-if="false" />
    <div
      class="flex flex-col gap-5 sm:flex-row justify-between items-start sm:items-center mt-10"
    >
      <RequestTypeButton
        :choice="status"
        @change-state="(val) => (status = val)"
      />
      <div class="relative block">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-7 text-sm border-solid outline-none focus:border-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          name=""
          id=""
          v-model="search"
        />
        <IconSearch class="absolute top-1.5 right-2 w-6" />
      </div>
    </div>
  </div>

  <div class="mt-4 p-5 bg-white rounded-lg">
    <h4 class="text-gray-700">{{ advertType }} Requests</h4>

    <PremiseAppDataTable
      v-if="advertType === 'On Premise'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />
    <StreetLampDataTable
      v-else-if="advertType === 'Street Lamp Pole'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />
    <MobileDataTable
      v-else-if="
        advertType === 'Mobile First Party' ||
        advertType === 'Mobile Third Party'
      "
      :mobileType="advertType"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />

    <TemporaryTable
      v-else-if="advertType === 'Temporary Advert'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />

    <ThirdPartyAppTable
      v-else-if="advertType === 'Third Party Application'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />
    <OutDoorSiteAppTable
      v-else-if="advertType === 'Outdoor Site'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />
    <SmallFormatTable
      v-else-if="advertType === 'Small Format'"
      :status="status"
      :search="search"
      :lga="lga"
      :date="date"
    />
  </div>
</template>
