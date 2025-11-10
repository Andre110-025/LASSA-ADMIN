<script setup>
import { ref, reactive } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import DocumentLoader from "../DocumentLoader.vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";

const props = defineProps({
  id: String,
  siteSpec: Object
});

const emit = defineEmits(["confirm"]);

const { number_faces, dimension_sign, designation, breadth_sign, length_sign } = props.siteSpec;

const loading = ref(false);
const uploadData = reactive({
  reportFile: null,
  installation_date: null,
});

const uploadReport = async () => {
  if (!uploadData.reportFile) {
    return;
  }
  try {
    loading.value = true;
    const { data } = await axios.post(
      `uploadsitereport/${props.id}`,
      uploadData
    );

    if (data.success) {
      toast.success("Report Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.error(error);
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem]  h-fit max-h-dvh sm:max-h-[31.25rem] max-w-[21.25rem] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <p class="text-center mt-5">Site Inspection Report</p>
      </div>

      <form class="py-5" @submit.prevent="uploadReport()">
        <div class="inputHolder">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="sides"
            autocomplete="off"
            :value="designation"
            readonly
          />
          <label for="sides" class="inputLabel">Structure Type</label>
        </div>

        <div class="inputHolder">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="sides"
            autocomplete="off"
            :value="number_faces"
            readonly
          />
          <label for="sides" class="inputLabel">Number of Sides</label>
        </div>

        <div class="inputHolder">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="signageLength"
            autocomplete="off"
            :value="length_sign"
            readonly
          />
          <label for="signageLength" class="inputLabel">Length</label>
        </div>

        <div class="inputHolder">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="signageBreadth"
            autocomplete="off"
            :value="breadth_sign"
            readonly
          />
          <label for="signageBreadth" class="inputLabel">Breath</label>
        </div>

        <div
          class="inputHolder"
        >
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="installation_date"
            autocomplete="off"
            v-model="uploadData.installation_date"
            required
          />
          <label for="installation_date" class="inputLabel"
            >Site Inspection Date</label
          >
        </div>

        <DocumentLoader
          label="reportDoc"
          @updateEncode="
            (base64Content) => (uploadData.reportFile = base64Content)
          "
        >
          Click to add Site Inspection Summary
        </DocumentLoader>

        <div class="flex items-center px-4">
          <button
            :disabled="loading || !uploadData.reportFile"
            type="submit"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Upload Report
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
