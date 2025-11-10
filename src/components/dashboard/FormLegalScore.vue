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

const legalData = reactive({
  arcon_score: null,
  cac_score: null,
  company_profile: null,
});

async function submitScore() {
  loading.value = true;

  try {
    const response = await axios.post(`legalscore/${props.id}`, legalData);

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
        id="arcon_score"
        autocomplete="off"
        v-model="legalData.arcon_score"
        step="0.1"
        required
      />
      <label for="arcon_score" class="inputLabel">ARCON Score</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="cac_score"
        autocomplete="off"
        v-model="legalData.cac_score"
        step="0.1"
        required
      />
      <label for="cac_score" class="inputLabel"
        >CAC Score</label
      >
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="company_profile"
        autocomplete="off"
        v-model="legalData.company_profile"
        step="0.1"
        required
      />
      <label for="company_profile" class="inputLabel">Company Profile</label>
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
