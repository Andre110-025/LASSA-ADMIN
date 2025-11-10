<script setup>
import StreetLampAppPricingRule from './StreetLampAppPricingRule.vue';
import StreetLampPermitPricingRules from './StreetLampPermitPricingRules.vue';

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
        Street Lamp Pricing Rules{{ ruleType ? ` (${ruleType})` : "" }}
      </h4>
      <p class="text-gray-600">Manage pricing rules for different sign types</p>
    </div>
    <StreetLampAppPricingRule v-if="ruleType === 'Application Fee'" />
    <StreetLampPermitPricingRules v-else-if="ruleType === 'Permit Fee'" />
  </div>
</template>