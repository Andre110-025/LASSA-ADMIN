<script setup>
import { ref, reactive, computed } from "vue";
import IconEye from "../icons/IconEye.vue";
import IconHidden from "../icons/IconHidden.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { toast } from "vue3-toastify";

const userStore = useUserStore();

const router = useRouter();

const pwdShow1 = ref(false);
const loading = ref(false);

const loginData = reactive({
  email: null,
  password: null,
});

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Email/phone number is required", required),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
  },
}));

const v$ = useVuelidate(rules, loginData);

const submitLogInInfo = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post("adminlogin", loginData);
    // console.log(response);
    if (response.status === 200) {
      toast.success("Login Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.success.token;
      userStore.userDetails.accessToken = response.data.success.token;

      await userStore.getUserData();

      router.push({ name: "Overview" });

      loading.value = false;
    }
  } catch (error) {
    toast.error("Enter Valid Credentials", {
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
    <p class="text-center uppercase mt-2.5">Login to Continue</p>

    <div>
      <div class="inputHolder">
        <input
          type="text"
          placeholder="Email/Phone Number"
          class="input placeholder:text-gray-800"
          id="email"
          v-model="loginData.email"
          autocomplete="email"
          @blur="v$.email.$touch"
          required
          inputmode="email"
        />
      </div>

      <!-- Password -->
      <div class="inputHolder">
        <input
          :type="pwdShow1 ? 'text' : 'password'"
          placeholder="Password"
          class="input placeholder:text-gray-800"
          id="pwd"
          v-model="loginData.password"
          autocomplete="new-password"
          @blur="v$.password.$touch"
          required
        />
        <div class="absolute top-1.5 right-7" @click="pwdShow1 = !pwdShow1">
          <IconEye class="w-5" v-if="pwdShow1" />
          <IconHidden class="w-5" v-else />
        </div>
        <router-link
          class="mt-2.5 text-end text-sm font-semibold"
          :to="{ name: 'Reset Password' }"
          >Forgot Password?</router-link
        >
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
          >Sign In</span
        >
      </button>
    </div>
  </form>
</template>
