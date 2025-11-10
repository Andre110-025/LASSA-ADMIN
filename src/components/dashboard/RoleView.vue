<script setup>
import { ref, watch } from "vue";
import NoList from "./NoList.vue";
import IconSearch from "../icons/IconSearch.vue";
import GetData from "../dashboard/GetData.vue";
import AddUser from "./popups/AddUser.vue";
import FilterButton from "./buttons/request/FilterButton.vue";
import { useModal } from "vue-final-modal";
import axios from "axios";
import { TailwindPagination } from "laravel-vue-pagination";
import { useHelpers } from "../../helper";

const { dateToSlash } = useHelpers();

const headerTitles = ["Name", "Email", "Role", "Last Login", "Action"];

const roles = [
  "All",
  "branch manager",
  "relationship manager 1",
  "relationship manager 2",
  "head of department",
];

const search = ref("");
const selectedRole = ref("");

function updateUser(n) {
  n === "All" ? (selectedRole.value = "") : (selectedRole.value = n);
}

const loading = ref(false);
const roleData = ref(null);

const getUsers = async (page = 1) => {
  loading.value = true;

  roleData.value = null;
  try {
    const response = await axios.get(
      `getalladmin?search=${search.value}&page=${page}`
    );
    // console.log(response);
    if (response.status === 200) {
      roleData.value = response.data.data;

      loading.value = false;
    }
  } catch (error) {
    console.log(error);

    loading.value = false;
  }
};

let delaySearch = null;

watch(search, () => {
  if (delaySearch) {
    clearTimeout(delaySearch);
  }

  delaySearch = setTimeout(() => {
    getUsers();
  }, 1500);
});

watch(selectedRole, () => {
  getUsers();
});

const createEditUser = (user = null) => {
  const { open, close: closeAddUser } = useModal({
    component: AddUser,

    attrs: {
      existingUser: user,
      onConfirm(bol) {
        if (bol) {
          getUsers();
        }
        closeAddUser();
      },
    },
    slots: {},
  });

  open();
};

getUsers();
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex 2xs:flex-row flex-col gap-0 2xs:gap-4 justify-between">
      <h4 class="text-2xl text-gray-700">Roles</h4>
      <div class="relative">
        <input
          class="2xs:w-60 bg-slate-100 py-[10px] pl-3.5 pr-7 text-sm border-solid outline-none focus:border-mainColor rounded-full w-full"
          type="text"
          placeholder="Search"
          v-model="search"
        />
        <IconSearch class="absolute top-1.5 right-2 w-6" />
      </div>
    </div>
  </div>

  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex justify-between items-center">
      <FilterButton v-if="false" :options="roles" @change-cat="updateUser" />
      <button
        @click="createEditUser(null)"
        class="bg-mainColor inline-block text-white w-fit px-5 py-2 text-center rounded"
      >
        + Add Role
      </button>
    </div>

    <div v-if="roleData">
      <table class="w-full mt-6 table-auto">
        <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
          <tr>
            <th
              v-for="(header, index) in headerTitles"
              :key="index"
              class="text-sm text-gray-700 text-left p-2.5"
              :class="{
                'hidden sm:table-cell':
                  header === 'Email' || header === 'Last Login',
              }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="admin in roleData.data"
            :key="admin.id"
            class="even:bg-slate-50"
          >
            <td class="p-2.5 text-xs xs:text-sm">
              {{ admin.first_name + " " + admin.last_name }}
            </td>
            <td class="p-2.5 text-xs xs:text-sm">
              {{ admin.email }}
            </td>
            <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm uppercase">
              {{ admin.admin_role.role }}
            </td>
            <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
              {{ dateToSlash(admin.last_login) }}
            </td>
            <td class="p-2.5 text-xs xs:text-sm">
              <button @click="createEditUser(admin)" class="text-xs text-white bg-mainColor px-2 py-1 rounded">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-8">
        <TailwindPagination
          :data="roleData"
          @pagination-change-page="getUsers"
          :limit="2"
        />
      </div>
    </div>

    <GetData v-else-if="loading"> Getting Users </GetData>

    <NoList v-else @performAction="createEditUser">
      <template #description> No User Role </template>
      <template #action> Create User </template>
    </NoList>
  </div>
</template>
