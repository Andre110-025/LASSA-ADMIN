<script setup>
import { ref, onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const admins = ref([]);
const loading = ref(false);
const selectAdmin = ref(null);

const props = defineProps({
  userId: {
    require: true,
  },
  adminId: {
    require: true,
  },
});

const emit = defineEmits(["confirm"]);

const assignUser = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `outdoorreassign/${props.userId}/${selectAdmin.value}`
    );

    console.log(response);

    if (response.status == 200) {
      toast.success("User Successfully Reassigned", {
        position: toast.POSITION.TOP_CENTER,
      });

      loading.value = false;

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};

const getRegRm = async () => {
  try {

    loading.value = true;

    const response = await axios.get(`getrmregistry`);

    // console.log(response);

    if (response.status == 200) {
      admins.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    toast.error("Something Went Wrong while get RMs", {
      position: toast.POSITION.TOP_CENTER,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getRegRm();
});
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
      <h4 class="px-5 py-8 text-center">Assign User</h4>
    </div>
    <div class="overflow-y-auto">
      <form
        @submit.prevent="assignUser"
        class="w-full max-w-[300px] mx-auto"
        autocomplete="off"
      >
        <div class="inputHolder">
          <select
            v-model="selectAdmin"
            placeholder=" "
            class="input peer uppercase"
            id="admin_role"
            required
            :disabled="loading"
          >
            <option
              v-for="(item, index) in admins"
              :key="index"
              :value="item.id"
              v-text="`${item.first_name} ${item.last_name}`"
              :disabled="item.id === adminId"
              class="uppercase"
            ></option>
          </select>
          <label for="admin_role" class="inputLabel">Select RM</label>
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
              >Reassign User</span
            >
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
