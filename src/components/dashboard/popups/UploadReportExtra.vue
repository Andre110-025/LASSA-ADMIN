<script setup>
import { ref, reactive, onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import DocumentLoader from "../DocumentLoader.vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";

const props = defineProps({
  id: String,
  uploadType: String,
  extraId: Number,
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);
const uploadData = reactive({
  reportFile: null,
  siteSubmission: null,
  complianceReport: null,
  installation_date: null,
});

const uploadReport = async () => {
  // if (!uploadData.reportFile) {
  //   return;
  // }
  try {
    loading.value = true;

    const { data } = await axios.post(
      `${props.uploadType}/${props.id}/${props.extraId}`,
      uploadData
    );

    if (data.success) {
      toast.success("Report Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    if (!error.response.data.success) {
      toast.error(error.response.data.data, {
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
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-fit max-h-dvh max-w-[21.25rem] overflow-y-auto"
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
        <p class="text-center mt-5">Upload Report File</p>
      </div>

      <form class="py-5" @submit.prevent="uploadReport()">
        <div class="inputHolder" v-if="uploadType === 'rmassessment'">
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
            >Site Installation Date</label
          >
        </div>

        <DocumentLoader
          v-if="uploadType === 'complianceapproval'"
          label="complianceReport"
          @updateEncode="
            (base64Content) => (uploadData.complianceReport = base64Content)
          "
        >
          Click to add Compliance report file
        </DocumentLoader>

        <DocumentLoader
          label="reportDoc"
          @updateEncode="
            (base64Content) => (uploadData.reportFile = base64Content)
          "
          v-else
        >
          Click to add report file
        </DocumentLoader>

        <div class="flex items-center px-4">
          <button
            :disabled="loading || !uploadData.complianceReport"
            type="submit"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
            v-if="uploadType === 'complianceapproval'"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Upload Report
            </span>
          </button>
          <button
            :disabled="loading || !uploadData.reportFile"
            type="submit"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
            v-else
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
