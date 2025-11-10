<script setup>
import logo from "../icons/IconLogo.vue";
import IconNotification from "../icons/IconNotification.vue";
import { useUserStore } from "../../stores/user";
import IconHamburger from "../icons/IconHamburger.vue";
import IconDashboard from "../icons/IconDashboard.vue";
import IconRequest from "../icons/IconRequest.vue";
import IconRevenues from "../icons/IconRevenues.vue";
import IconPayment from "../icons/IconPayment.vue";
import IconTask from "../icons/IconTask.vue";
import IconLocation from "../icons/IconLocation.vue";
import IconGroup from "../icons/IconGroup.vue";
import IconSettings from "../icons/IconSettings.vue";
import IconScanQR from "../icons/IconScanQR.vue";
import IconApplication from "../icons/IconApplication.vue";
import IconUser from "../icons/IconUser.vue";
import IconLogOut from "../icons/IconLogOut.vue";
import { onClickOutside } from "@vueuse/core";

import { ref } from "vue";

const userStore = useUserStore();
const admin_role = useUserStore().userDetails.userInfo.admin_role_id;
const userInfo = useUserStore().userDetails.userInfo;
const openNav = ref(false);

const navTrigger = ref(null);
onClickOutside(navTrigger, (event) => (openNav.value = false));
</script>

<template>
  <header class="bg-white shadow-md fixed w-full z-50">
    <div class="flex mx-auto h-full">
      <div class="w-64 h-20 flex items-center justify-center">
        <logo class="max-h-16 w-auto" />
      </div>
      <!-- Your header content here -->
      <div class="py-4 px-5 w-full">
        <div
          class="flex py-4 first:pt-0 last:pb-0 justify-end w-full gap-5 align-middle h-full"
        >
          <div
            class="lg:hidden block my-auto scale-150 cursor-pointer"
            @click="openNav = !openNav"
          >
            <IconHamburger :icon-close="openNav" />
          </div>
          <!-- <IconNotification class="my-auto lg:block hidden" /> -->
          <!-- <img
            class="h-10 w-10 rounded-full lg:block hidden"
            src="/authImg.jpg"
            alt=""
          /> -->
          <div class="ml-3 overflow-hidden items-center lg:flex hidden">
            <p class="text-sm font-medium text-slate-900 capitalize">
              {{ userInfo.first_name + " - " + userInfo.admin_role.role }}
            </p>
          </div>
        </div>
      </div>
      <!-- Other header elements -->
    </div>

    <div
      @click="openNav = false"
      class="lg:hidden absolute w-[100dvw] h-[88dvh] bg-white transition-transform ease-in-out"
      :class="{ 'translate-x-[-100dvw]': !openNav }"
    >
      <nav class="mt-1">
        <span class="block dashNavSpan text-sm text-gray-800 mb-1 uppercase">
          Main Menu</span
        >
        <RouterLink :to="{ name: 'Overview' }" class="dashNav">
          <IconDashboard />
          Dashboard
        </RouterLink>
        <RouterLink
          v-if="admin_role != 9"
          :to="{ name: 'RequestList' }"
          class="dashNav"
        >
          <IconRequest />
          Requests
        </RouterLink>
        <RouterLink :to="{ name: 'Advert Category' }" class="dashNav">
          <IconApplication />
          New Application
        </RouterLink>
        <RouterLink :to="{ name: 'PendingTask' }" class="dashNav">
          <IconTask />
          Tasks
        </RouterLink>
        <RouterLink :to="{ name: 'Fund Wallet' }" class="dashNav text-gray-700">
          <IconPayment strokeCol="currentColor" />
          Fund Wallet
        </RouterLink>
        <!-- <a href="#" class="dashNav">
          <IconLocation />
          Sites
        </a>
        <a href="#" class="dashNav">
          <IconGroup />
          Agencies
        </a> -->

        <span
          class="block dashNavSpan text-sm text-gray-800 my-1 pt-2 uppercase border-t border-t-[#DEE7FF]"
          >Others</span
        >
        <RouterLink
          v-if="admin_role == 6"
          :to="{ name: 'Roles' }"
          class="dashNav"
        >
          <IconSettings />
          Admin Roles
        </RouterLink>
        <RouterLink :to="{ name: 'Clients' }" class="dashNav">
          <IconUser />
          Users
        </RouterLink>
        <RouterLink v-if="admin_role == 6" :to="{ name: 'PricingRules' }" class="dashNav">
          <IconRevenues />
          Pricing Rules
        </RouterLink>
        <RouterLink v-if="admin_role == 6" :to="{ name: 'EmailContent' }" class="dashNav">
          <IconNotification />
          Email Content
        </RouterLink>

        <div class="my-1 pt-1 border-t border-t-[#DEE7FF]">
          <span @click="userStore.logOut" href="#" class="dashNav select-none">
            <IconLogOut />
            Log Out
          </span>
        </div>
      </nav>
    </div>
  </header>
</template>
