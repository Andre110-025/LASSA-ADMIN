import { reactive, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { useRouter } from "vue-router";

export const useUserStore = defineStore('userStore', () => {

  const router = useRouter();

  const userDetails = useStorage('_auth123', {
    accessToken: "",
    userInfo: null,
  });

  const resetData = reactive({
    userid: null,
    otp: null,
    password: null
  })

  const getUserData = async () => {
    try {
      const response = await axios.get('getcurrentadmin')
      // console.log(response);
      if (response.status === 200) {
        userDetails.value.userInfo = response.data.data[0];
      }
    } catch (error) {
      console.log(error);
    }
  }

  const logOut = async () => {
    try {
      const response = await axios.get('adminlogout')
      if (response.status === 200) {
        $reset()
      }
    } catch (error) {
      $reset();
    }
  }
  
  const $reset = () => {
    userDetails.value.accessToken = null;
    userDetails.value.userInfo = null;
    router.push({ name: "Login" });
  }

  const resetVerify = () => {
    resetData.userid = null;
    resetData.otp = null;
    resetData.password = null;
  }

  return { userDetails, resetData, $reset, resetVerify, getUserData, logOut }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}