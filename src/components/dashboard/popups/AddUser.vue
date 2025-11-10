<script setup>
import { ref, watch, reactive, computed, onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const { lagosLGAs } = useHelpers();

const emit = defineEmits(["confirm"]);

const props = defineProps({
  // Add prop for existing user data when editing
  existingUser: {
    type: Object,
    default: null,
  },
});

const roles = [
  "BRANCH MANAGER",
  "RELATIONSHIP MANAGER 1",
  "RELATIONSHIP MANAGER 2",
  "HEAD OF DEPARTMENT",
  "FINANCE",
  "LEGAL",
  "AUDITS",
  "COMPLIANCE",
  "USER SUPPORT",
];

const departmentList = [
  { value: "M_I", name: "M & I" },
  { value: "Registry", name: "Registry" },
  { value: "Mobile_advert", name: "Mobile Advert" },
  { value: "Billings", name: "Billings" },
  { value: "Operations", name: "Operations" },
];

const zoneList = [
  "Lagos Central",
  "Lagos East",
  "Lagos West 1",
  "Lagos West 2",
];

const loading = ref(false);
const assignTos = ref(null);

// Initialize newUserData with props if editing
const newUserData = reactive({
  first_name: props.existingUser?.first_name || null,
  department: props.existingUser?.department || null,
  last_name: props.existingUser?.last_name || null,
  email: props.existingUser?.email || null,
  phone_number: props.existingUser?.phone_number || null,
  line_manager: props.existingUser?.line_manager || null,
  admin_role: props.existingUser ? props.existingUser.admin_role?.role : null,
  lga: props.existingUser?.lga || null,
  zone: props.existingUser?.zone || null,
  zone2: props.existingUser?.zone2 || null,
  user_id: props.existingUser?.id || null, // Add user_id for edit
});

// watch the admin_role to reset fields
watch(() => newUserData.admin_role, () => {
  // console.log("Admin role changed:", newUserData.admin_role);
  newUserData.line_manager = null;
  newUserData.lga = null;
  newUserData.zone = null;
  newUserData.zone2 = null;
  newUserData.department = null;
});

const deptBool = computed(() => {
  if (
    newUserData.admin_role === "HEAD OF DEPARTMENT" ||
    newUserData.admin_role === "RELATIONSHIP MANAGER 1" ||
    newUserData.admin_role === "RELATIONSHIP MANAGER 2"
  ) {
    // newUserData.department = null;
    return true;
  } else {
    // newUserData.department = null;
    return false;
  }
});

const checkMobileAd = () => {
  if (newUserData.department != "Mobile_advert") {
    newUserData.zone2 = null;
  }
};

const getAllUser = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`getassignableadmin`);
    if (response.status === 200) {
      assignTos.value = response.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const assignable = computed(() => {
  // Reset these fields when admin_role changes

  if (
    (newUserData.admin_role === "BRANCH MANAGER" ||
      newUserData.admin_role === "HEAD OF DEPARTMENT" ||
      newUserData.admin_role === "FINANCE" ||
      newUserData.admin_role === "LEGAL" ||
      newUserData.admin_role === "AUDITS" ||
      newUserData.admin_role === "COMPLIANCE") &&
    assignTos.value
  ) {
    return assignTos.value.filter((item) => item.admin_role_id == 6);
  } else if (
    (newUserData.admin_role === "RELATIONSHIP MANAGER 1" ||
      newUserData.admin_role === "RELATIONSHIP MANAGER 2") &&
    assignTos.value
  ) {
    return assignTos.value.filter((item) => item.admin_role_id == 5);
  } else if (newUserData.admin_role === "USER SUPPORT") {
    newUserData.line_manager = 0;
    return [];
  } else {
    return [];
  }
});

const submitUser = async () => {
  loading.value = true;

  // Handle LGA edge case
  if (
    newUserData.admin_role === "BRANCH MANAGER" &&
    newUserData.lga === "Others"
  ) {
    newUserData.lga = "Other";
  }

  try {
    let response;
    // Check if it's an edit or create operation
    if (props.existingUser) {
      // Edit existing user
      response = await axios.post(
        `editadminuser/${newUserData.user_id}`,
        newUserData
      );
    } else {
      // Create new user
      response = await axios.post("adminregister", newUserData);
    }

    if (response.status === 200) {
      toast.success(
        props.existingUser
          ? "User Updated Successfully"
          : "User Creation Successful",
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );

      emit("confirm", true);
      loading.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};

onMounted(() => {
  getAllUser();
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] min-h-[350px] h-fit max-h-dvh overflow-y-auto max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-8 text-center">
        {{ existingUser ? "Edit User" : "Add User" }}
      </h4>
    </div>
    <div class="overflow-y-auto">
      <form
        @submit.prevent="submitUser"
        class="w-full max-w-[300px] mx-auto"
        autocomplete="off"
      >
        <div class="inputHolder">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="first_name"
            required
            v-model="newUserData.first_name"
          />
          <label for="first_name" class="inputLabel">First Name</label>
        </div>

        <div class="inputHolder">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="last_name"
            required
            v-model="newUserData.last_name"
          />
          <label for="last_name" class="inputLabel">Last Name</label>
        </div>

        <div class="inputHolder">
          <input
            type="email"
            placeholder=" "
            class="input peer"
            id="email"
            required
            v-model="newUserData.email"
          />
          <label for="email" class="inputLabel">Email</label>
        </div>

        <div class="inputHolder">
          <input
            type="tel"
            placeholder=" "
            class="input peer"
            id="phone_number"
            required
            v-model="newUserData.phone_number"
          />
          <label for="phone_number" class="inputLabel">Phone Number</label>
        </div>

        <div class="inputHolder">
          <select
            v-model="newUserData.admin_role"
            placeholder=" "
            class="input peer uppercase"
            id="admin_role"
            required
          >
            <option
              v-for="(item, index) in roles"
              :key="index"
              :value="item"
              v-text="item"
              class="uppercase"
            ></option>
          </select>
          <label for="admin_role" class="inputLabel">User Role</label>
        </div>

        <div
          class="inputHolder"
          v-if="newUserData.admin_role && assignable.length"
        >
          <select
            v-model="newUserData.line_manager"
            placeholder=" "
            class="input peer"
            id="line_manager"
            required
          >
            <option
              v-for="(item, index) in assignable"
              :key="index"
              :value="item.id"
              class="capitalize"
            >
              {{ item.first_name + " " + item.last_name }}
            </option>
          </select>
          <label for="line_manager" class="inputLabel">Assign To</label>
        </div>

        <div
          class="inputHolder"
          v-if="newUserData.admin_role === 'BRANCH MANAGER'"
        >
          <select
            v-model="newUserData.lga"
            placeholder=" "
            class="input peer"
            id="lga"
            required
          >
            <option
              v-for="(item, index) in lagosLGAs"
              :key="index"
              :value="item"
              class="capitalize"
              v-text="item"
            ></option>
          </select>
          <label for="lga" class="inputLabel">Assign To LGA</label>
        </div>

        <div class="inputHolder" v-if="deptBool">
          <select
            v-model="newUserData.department"
            placeholder=" "
            class="input peer"
            id="department"
            required
            @change="checkMobileAd"
          >
            <option
              v-for="(item, index) in departmentList"
              :key="index"
              :value="item.value"
              class="capitalize"
              v-text="item.name"
            ></option>
          </select>
          <label for="department" class="inputLabel"
            >Assign To Department</label
          >
        </div>

        <div
          class="inputHolder"
          v-if="
            newUserData.department === 'M_I' ||
            newUserData.department === 'Mobile_advert' ||
            newUserData.lga === 'Others'
          "
        >
          <select
            v-model="newUserData.zone"
            placeholder=" "
            class="input peer"
            id="zoneList"
            required
          >
            <option
              v-for="(item, index) in zoneList"
              :key="index"
              :value="item"
              :disabled="item === newUserData.zone2"
              class="capitalize"
              v-text="item"
            ></option>
          </select>
          <label for="zoneList" class="inputLabel">Assign To Zone</label>
        </div>

        <div
          class="inputHolder"
          v-if="
            newUserData.department === 'Mobile_advert' ||
            newUserData.lga === 'Others'
          "
        >
          <select
            v-model="newUserData.zone2"
            placeholder=" "
            class="input peer"
            id="zoneList"
            required
          >
            <option
              v-for="(item, index) in zoneList"
              :key="index"
              :value="item"
              class="capitalize"
              v-text="item"
              :disabled="item === newUserData.zone"
            ></option>
          </select>
          <label for="zoneList" class="inputLabel">Assign To second Zone</label>
        </div>

        <div class="my-5">
          <button
            :disabled="loading"
            type="submit"
            class="blueBtn min-w-[200px] mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-sm font-medium text-white tracking-wider"
              v-if="!loading"
            >
              {{ existingUser ? "Update User" : "Create User" }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
