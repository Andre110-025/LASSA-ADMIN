<script setup>
import OutdoorPermitPricingRules from './OutdoorPermitPricingRules.vue';
import OutdoorApplicationPricingRules from './OutdoorApplicationPricingRules.vue';

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
        Outdoor Site Pricing Rules{{ ruleType ? ` (${ruleType})` : "" }}
      </h4>
      <p class="text-gray-600">Manage pricing rules for different sign types</p>
    </div>

    <OutdoorPermitPricingRules v-if="ruleType === 'Permit Fee'" />
    <OutdoorApplicationPricingRules v-else-if="ruleType === 'Application Fee'" />
  </div>
</template>