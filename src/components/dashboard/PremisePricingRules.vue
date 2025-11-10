<script setup>
import PremisePermitPricingRules from './PremisePermitPricingRules.vue';
import PremiseApplicationPricingRules from './PremiseApplicationPricingRules.vue';

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
        On-Premise Pricing Rules{{ ruleType ? ` (${ruleType})` : "" }}
      </h4>
      <p class="text-gray-600">Manage pricing rules for different sign types</p>
    </div>

    <PremisePermitPricingRules v-if="ruleType === 'Permit Fee'" />
    <PremiseApplicationPricingRules v-else-if="ruleType === 'Application Fee'" />
  </div>
</template>