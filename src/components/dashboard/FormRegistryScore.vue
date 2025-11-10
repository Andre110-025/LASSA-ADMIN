<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(false);

const props = defineProps({
  id: String,
});

const emit = defineEmits(["completed"]);

const regData = reactive({
  companyprofile_score: null,
  maintanance_score: null,
  pastproject_score: null,
  preliminarydesign_score: null,
  designInnovation_score: null,
  companyInfo_score: null,
});

async function submitScore() {
  loading.value = true;

  try {
    const response = await axios.post(`registryscore/${props.id}`, regData);

    // console.log(response);

    if (response.status === 200) {
      toast.success("Application Successfully Scored", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("completed");
    }
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.status == 500) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.data.errors.length) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Application Could not be Scored", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loading.value = false;
  }
}
</script>

<template>
  <form class="py-2.5" @submit.prevent="submitScore()">
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="companyprofile_score"
        autocomplete="off"
        v-model="regData.companyprofile_score"
        step="0.1"
        required
      />
      <label for="companyprofile_score" class="inputLabel">Company Profile Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="maintanance_score"
        autocomplete="off"
        v-model="regData.maintanance_score"
        step="0.1"
        required
      />
      <label for="maintanance_score" class="inputLabel">Maintenance Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="pastproject_score"
        autocomplete="off"
        v-model="regData.pastproject_score"
        step="0.1"
        required
      />
      <label for="pastproject_score" class="inputLabel">Past Project Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="preliminarydesign_score"
        autocomplete="off"
        v-model="regData.preliminarydesign_score"
        step="0.1"
        required
      />
      <label for="preliminarydesign_score" class="inputLabel">Preliminary Design Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="designInnovation_score"
        autocomplete="off"
        v-model="regData.designInnovation_score"
        step="0.1"
        required
      />
      <label for="designInnovation_score" class="inputLabel">Design Innovation Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="companyInfo_score"
        autocomplete="off"
        v-model="regData.companyInfo_score"
        step="0.1"
        required
      />
      <label for="companyInfo_score" class="inputLabel">Company Info Score</label>
    </div>
    <div class="flex items-center px-4">
      <button
        :disabled="loading"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loading"
        >
          Submit Score
        </span>
      </button>
    </div>
  </form>
</template>
