<script setup>
import { ref, watch } from "vue";
import NoList from "./NoList.vue";
import IconSearch from "../icons/IconSearch.vue";
import GetData from "../dashboard/GetData.vue";
import CreateClient from "./popups/CreateClient.vue";
import FilterButton from "./buttons/request/FilterButton.vue";
import { useModal } from "vue-final-modal";
import axios from "axios";
import { TailwindPagination } from "laravel-vue-pagination";

const headerTitles = ["Name", "Type", "Business Name"];

const roles = ["First Party", "Third Party"];

const loading = ref(false);
const searchQuery = ref("");
const usersInfo = ref(null);

const getAllUser = async (page = 1) => {
  loading.value = true;

  try {
    const response = await axios.get(
      `paginateuserdetails?search=${searchQuery.value}&page=${page}`
    );
    // console.log(response);
    if (response.status === 200) {
      usersInfo.value = response.data.data;

      loading.value = false;
    }
  } catch (error) {
    console.log(error);

    loading.value = false;
  }
};

// async function getAllUser() {
//   loading.value = true;

//   try {
//     const response = await axios.get(
//       `getalluserdetails?search=${searchQuery.value}&`
//     );
//     console.log(response);
//     if (response.status === 200) {
//       usersInfo.value = response.data.data;
//       loading.value = false;
//     }
//   } catch (error) {
//     console.log(error);
//     loading.value = false;
//   }
// }

let delaySearch = null;
watch(searchQuery, async (newVal) => {
  if (delaySearch) {
    clearTimeout(delaySearch);
  }

  delaySearch = setTimeout(() => {
    // Call the function or perform actions that should happen after the delay
    getAllUser();
  }, 1000); // Adjust the delay time in milliseconds as needed
});

const { open: openAddUser, close: closeAddUser } = useModal({
  component: CreateClient,

  attrs: {
    onConfirm() {
      closeAddUser();
      getAllUser();
    },
  },
  slots: {},
});

getAllUser();
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex 2xs:flex-row flex-col gap-5 2xs:gap-4 justify-between">
      <h4 class="text-2xl text-gray-700">Users</h4>
      <div class="relative">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-7 text-sm border-solid outline-none focus:border-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          name=""
          id=""
          v-model="searchQuery"
        />
        <IconSearch class="absolute top-1.5 right-2 w-6" />
      </div>
    </div>
  </div>

  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex justify-between items-center">
      <FilterButton class="hidden sm:inline-block" :options="roles" />
      <button
        @click="openAddUser"
        class="bg-mainColor sm:inline-block text-white w-fit px-5 py-2 text-center rounded"
      >
        + Create User
      </button>
    </div>

    <div v-if="usersInfo && !loading">
      <table class="w-full mt-6 table-auto">
        <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
          <tr>
            <th
              v-for="(header, index) in headerTitles"
              :key="index"
              class="text-sm text-gray-700 text-left p-2.5"
              :class="{
                'hidden md:table-cell': header === 'Name',
                'hidden sm:table-cell': header === 'Type',
              }"
            >
              {{ header }}
            </th>
            <th class="xs:text-sm text-xs font-medium text-gray-700 lg:w-[14.5%] w-1/3 text-left p-2.5">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in usersInfo.data"
            :key="user.id"
            class="even:bg-slate-50"
          >
            <td class="p-2.5 hidden md:table-cell text-xs xs:text-sm">
              {{ user.first_name + " " + user.last_name }}
            </td>
            <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm capitalize">
              {{
                user.user_type === "first_party" ? "First Party" : "Third Party"
              }}
            </td>
            <!-- <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
              {{ user.email }}
            </td> -->
            <td
              class="p-2.5 text-xs xs:text-sm"
              v-text="user.business_name"
            ></td>
            <td class="p-2.5 text-xs xs:text-sm">
              <a
                :href="`customers-details/${user.id}`"
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
          :data="usersInfo"
          @pagination-change-page="getAllUser"
          :limit="2"
        />
      </div>
    </div>

    <GetData v-else-if="loading"> Getting Users </GetData>

    <NoList v-else @performAction="openAddUser">
      <template #description> No User Role </template>
      <template #action> Create User </template>
    </NoList>
  </div>
</template>
