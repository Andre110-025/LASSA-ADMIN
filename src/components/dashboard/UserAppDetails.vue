<script setup>
defineProps({
  user: Object,
  business_name: String
})
</script>

<template>
  <div class="flex flex-col w-full p-6 border-t-2 border-gray-300 mt-4">
    <h6 class="text-lg font-semibold pb-2 mb-3">User Details</h6>
    <!-- <img class="block w-14 h-14 bg-gray-500 rounded-full m-auto" src="" alt="" /> -->
    <div class="flex flex-col justify-between w-4/5 h-fit gap-4">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Business Name</p>
        <p class="text-sm" v-text="business_name"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Account Type</p>
        <p
          class="text-sm uppercase"
          v-text="user.user_type.replace('_', ' ')"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Account Name</p>
        <p class="text-sm" v-text="business_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Account Email</p>
        <p class="text-sm" v-text="user.email"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Account Phone</p>
        <p class="text-sm" v-text="user.phone_number"></p>
      </div>
    </div>
  </div>
</template>
