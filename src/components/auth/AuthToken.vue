<script setup>
import { ref, computed } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import IconVerify from "../icons/IconVerify.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { toast } from "vue3-toastify";

const userStore = useUserStore();

const router = useRouter();

const loading = ref(false);

const token = ref(null);

// Token must be 6 digit

const validateToken = computed(() => {
  return token.value && token.value.length === 6;
});

// From Reset Password
const verifyReset = async () => {
  loading.value = true;
  try {
    const response = await axios.post("checktokenupdate", {
      userid: userStore.resetData.userid,
      otp: token.value,
    });

    if (response.status === 200) {
      toast.success("Token Correct", {
        position: toast.POSITION.TOP_CENTER,
      });

      userStore.resetData.otp = token.value;
      loading.value = false;
      router.push({ name: "Change Password" });
    }
  } catch (error) {
    toast.error("Token Incorrect", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="verifyReset"
    class="w-full max-w-[400px] mx-auto lg:h-2/3 h-1/2 flex flex-col justify-between"
    autocomplete="off"
  >
    <h4 class="text-center font-semibold mt-2.5">Verify your Account</h4>
    <p class="text-center text-xs mx-auto mt-2.5 w-48">
      Enter the 6 digit code sent to your email
    </p>

    <div class="inputHolder w-64 mx-auto">
      <input
        type="Text"
        placeholder="Enter Token"
        class="input"
        v-model="token"
        inputmode="numeric"
      />
    </div>

    <div class="my-5">
      <button
        :disabled="!validateToken || loading"
        type="submit"
        class="blueBtn min-w-[200px] mx-auto"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Proceed</span
        >
      </button>
    </div>
  </form>
</template>
