<script setup>
import { ref, reactive, computed } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { toast } from "vue3-toastify";

const userStore = useUserStore();

const router = useRouter();

const loading = ref(false);

// const loginData = reactive({
//   email: "oluwasheges@gmail.com" || null,
//   password: "Nw5tSr7XoT4N20231214132559" || null
// })

const authData = reactive({
  email: null,
});

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Email/phone number is required", required),
  }
}));

const v$ = useVuelidate(rules, authData);

const submitLogInInfo = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post("checkemailadmin", authData);
    // console.log(response);
    if (response.status === 200) {
      userStore.resetData.userid = response.data.userId

      router.push({ name: "Verify Account" });

      loading.value = false;
    }
  } catch (error) {
    toast.error("Email not correct", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="submitLogInInfo"
    class="w-full max-w-[400px] mx-auto lg:h-2/3 h-1/2 flex flex-col justify-between"
    autocomplete="off"
  >
    <p class="text-center uppercase mt-2.5">Reset Password</p>

    <div>
      <div class="inputHolder">
        <input
          type="text"
          placeholder="Enter Email"
          class="input placeholder:text-gray-800"
          id="email"
          v-model="authData.email"
          autocomplete="email"
          @blur="v$.email.$touch"
          required
          inputmode="email"
        />
      </div>
    </div>
    <div class="mt-5">
      <button
        :disabled="v$.$invalid || loading"
        type="submit"
        class="blueBtn min-w-[200px] mx-auto"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Get Token</span
        >
      </button>
    </div>
  </form>
</template>
