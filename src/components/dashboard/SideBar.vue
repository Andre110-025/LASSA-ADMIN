<script setup>
import IconDashboard from "../icons/IconDashboard.vue";
import IconRequest from "../icons/IconRequest.vue";
import IconRevenues from "../icons/IconRevenues.vue";
import IconLocation from "../icons/IconLocation.vue";
import IconGroup from "../icons/IconGroup.vue";
import IconSettings from "../icons/IconSettings.vue";
import IconScanQR from "../icons/IconScanQR.vue";
import IconNotification from "../icons/IconNotification.vue";
import IconLogOut from "../icons/IconLogOut.vue";
import IconTask from "../icons/IconTask.vue";
import IconUser from "../icons/IconUser.vue";
import IconPayment from "../icons/IconPayment.vue";
import IconApplication from "../icons/IconApplication.vue";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();
const admin_role = useUserStore().userDetails.userInfo.admin_role_id;
</script>

<template>
  <aside
    class="bg-white text-mainColor fixed top-20 left-0 bottom-0 w-64 overflow-y-auto z-50 border-t border-t-[#DEE7FF]"
  >
    <!-- Your sidebar content here -->
    <nav class="mt-5">
      <span class="block dashNavSpan text-sm text-gray-800 mb-2.5 uppercase"
        >Main Menu</span
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
        class="block dashNavSpan text-sm text-gray-800 my-2.5 pt-4 uppercase border-t border-t-[#DEE7FF]"
        >Others</span
      >
      <RouterLink
        v-if="admin_role == 6 || admin_role == 7"
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

      <div class="my-2.5 pt-4 border-t border-t-[#DEE7FF]">
        <span @click="userStore.logOut" class="dashNav select-none">
          <IconLogOut />
          Log Out
        </span>
      </div>
    </nav>
  </aside>
</template>
