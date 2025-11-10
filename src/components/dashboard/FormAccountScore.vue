<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(false);

const props = defineProps({
  id: String,
});

const emit = defineEmits(['completed'])

const accountData = reactive({
  return_capital: null,
  current_asset_ratio: null,
  acid_test_ratio: null,
  earning_share: null,
  number_shares: null,
  asset_ratio: null,
  total_asset: null,
  evidence_good: null,
});

async function submitScore() {
  loading.value = true;

  try {
    const response = await axios.post(
      `accountscore/${props.id}`,
      accountData
    );

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
        id="return_capital"
        autocomplete="off"
        v-model="accountData.return_capital"
        step="0.1"
        required
      />
      <label for="return_capital" class="inputLabel">Return Capital</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="current_asset_ratio"
        autocomplete="off"
        v-model="accountData.current_asset_ratio"
        step="0.1"
        required
      />
      <label for="current_asset_ratio" class="inputLabel"
        >Current Asset Ration</label
      >
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="acid_test_ratio"
        autocomplete="off"
        v-model="accountData.acid_test_ratio"
        step="0.1"
        required
      />
      <label for="acid_test_ratio" class="inputLabel">Acid Test</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="earning_share"
        autocomplete="off"
        v-model="accountData.earning_share"
        step="0.1"
        required
      />
      <label for="earning_share" class="inputLabel">Earning Share</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="number_shares"
        autocomplete="off"
        v-model="accountData.number_shares"
        required
      />
      <label for="number_shares" class="inputLabel">Number of Shares</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="asset_ratio"
        autocomplete="off"
        v-model="accountData.asset_ratio"
        step="0.1"
        required
      />
      <label for="asset_ratio" class="inputLabel">Asset Ratio</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="total_asset"
        autocomplete="off"
        v-model="accountData.total_asset"
        required
      />
      <label for="total_asset" class="inputLabel">Total Asset</label>
    </div>
    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="evidence_good"
        autocomplete="off"
        v-model="accountData.evidence_good"
        required
      />
      <label for="evidence_good" class="inputLabel">Evidence of Goods</label>
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
