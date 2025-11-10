<script setup>
import { ref, reactive, computed } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const { lagosLGAs } = useHelpers();

const emit = defineEmits(["confirm"]);

const loading = ref(false);


const newUserData = reactive({
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
  business_name: null,
  type: null
});

const createUser = async () => {
  loading.value = true;
  try {
    const response = await axios.post("registeruser", newUserData);
    // console.log(response);
    if (response.status === 200) {
      toast.success("Client Creation Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm");

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
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] min-h-[350px] h-fit max-h-dvh overflow-y-auto max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Create New Client</h4>
    </div>
    <form
      @submit.prevent="createUser"
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
          type="text"
          placeholder=" "
          class="input peer"
          id="business_name"
          required
          v-model="newUserData.business_name"
        />
        <label for="business_name" class="inputLabel">Business Name</label>
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

      <div
        class="inputHolder"
        v-if="newUserData.admin_role === 'branch manager'"
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
            :value="item"
            class="capitalize"
            v-text="item"
            :key="index"
          ></option>
        </select>
        <label for="lga" class="inputLabel">Assign To LGA</label>
      </div>

      <div class="inputHolder">
        <select
          v-model="newUserData.type"
          placeholder=" "
          class="input peer"
          id="userType"
          required
        >
          <option
            value="first_party"
            class="capitalize"
            v-text="'First Party'"
          ></option>
          <option
            value="third_party"
            class="capitalize"
            v-text="'Third Party'"
          ></option>
        </select>
        <label for="userType" class="inputLabel">User Type</label>
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
            >Create User</span
          >
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>
