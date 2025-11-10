<script setup>
import { ref, reactive } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const loading = ref(false);

const props = defineProps({
  userId: {
    require: true,
  },
  userData: {
    require: true,
    type: Object
  }
});

const emit = defineEmits(["confirm"]);

const updateData = reactive(props.userData);

const updateUser = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(`adminedituser/${props.userId}`, updateData);

    console.log(data);

    if (data.success) {
      toast.success("User Updated Successfully");

      loading.value = false;

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[450px] h-fit max-h-dvh overflow-y-auto max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-8 text-center">Edit User Information</h4>
    </div>
    <div class="overflow-y-auto">
      <form
        @submit.prevent="updateUser"
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
            v-model="updateData.first_name"
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
            v-model="updateData.last_name"
          />
          <label for="last_name" class="inputLabel">Last Name</label>
        </div>
        <div class="inputHolder">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="business_name"
            required
            v-model="updateData.business_name"
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
            v-model="updateData.phone_number"
          />
          <label for="phone_number" class="inputLabel">Phone Number</label>
        </div>
        <div class="inputHolder">
          <input
            type="email"
            placeholder=" "
            class="input peer"
            id="email"
            required
            v-model="updateData.email"
          />
          <label for="email" class="inputLabel">Business Name</label>
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
              >Update User</span
            >
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
