<script setup>
import SmallFormatAppPricingRules from './SmallFormatAppPricingRules.vue';

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
        Small Format Pricing Rules{{ ruleType ? ` (${ruleType})` : "" }}
      </h4>
      <p class="text-gray-600">Manage pricing rules for different sign types</p>
    </div>
    <SmallFormatAppPricingRules v-if="ruleType === 'Application Fee'" />
  </div>
</template>