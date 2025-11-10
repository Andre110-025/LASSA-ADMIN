<script setup>
import { RouterView } from "vue-router";
import Logo from "../components/icons/IconLogo.vue";
</script>

<template>
  <div
    class="relative w-full min-h-[100dvh] bg-white sm:bg-mainColor sm:bg-[url('/authImg.jpg')] flex justify-center items-center py-10 bg-no-repeat bg-cover"
  >
    <div class="absolute hidden sm:block inset-0 bg-mainColor opacity-70"></div>
    <div class="absolute flex w-full h-full bg-white">
      <div
        class="relative lg:bg-mainColor bg-white w-full lg:w-3/5 h-full flex flex-col justify-center"
      >
        <div
          class="relative bg-white h-3/4 w-4/5 sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px] flex flex-col item-center mx-auto"
        >
          <div class="flex justify-center items-center top-0">
            <Logo class="h-auto w-40" />
          </div>
          <RouterView />
        </div>
      </div>
      <div
        class="hidden lg:block relative w-2/5 bg-[url('/authImg.jpg')] bg-cover bg-center before:content-[''] before:w-full before:h-full before:bg-mainColor before:absolute before:opacity-70"
      >
        <div class="px-10 mt-10">
          <h2 class="relative text-white">
            Lagos State Signage and Advertisement Agency LASAA
          </h2>
          <div class="border-b-2 border-b-white w-2/5 relative my-4"></div>
          <p class="relative text-white">Admin Dashboard and Control System</p>
        </div>
        <p class="absolute text-white px-10 bottom-10">
          Contact Support <b class="text-white">@S-Auto</b>
        </p>
      </div>
    </div>
  </div>
</template>
