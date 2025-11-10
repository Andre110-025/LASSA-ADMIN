<script setup>
import MobilePermitPricingRules from './MobilePermitPricingRules.vue';
import MobileApplicationPricingRules from './MobileApplicationPricingRules.vue';

defineProps({
  ruleType: {
    type: String,
  },
});
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-sm">
    <div class="mb-6">
      <h4 class="text-2xl font-bold text-gray-800 mb-2">
        Mobile Advert Pricing Rules{{ ruleType ? ` (${ruleType})` : "" }}
      </h4>
      <p class="text-gray-600">Manage pricing rules for different sign types</p>
    </div>

    <MobilePermitPricingRules v-if="ruleType === 'Permit Fee'" />
    <MobileApplicationPricingRules v-else-if="ruleType === 'Application Fee'" />
  </div>
</template>