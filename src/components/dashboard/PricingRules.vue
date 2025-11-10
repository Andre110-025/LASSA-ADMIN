<script setup>
import { ref, computed } from "vue";
import FilterButton from "./buttons/request/FilterButton.vue";
import { useHelpers } from "../../helper";
import { useUserStore } from "../../stores/user";
import PremisePricingRules from "./PremisePricingRules.vue";
import OutdoorSitePricingRules from "./OutdoorSitePricingRules.vue";
import TemporaryPricingRules from "./TemporaryPricingRules.vue";
import SmallFormatPricingRules from "./SmallFormatPricingRules.vue";
import StreetLampPricingRules from "./StreetLampPricingRules.vue";
import PractitionerPricingRules from "./PractitionerPricingRules.vue";
import MobilePricingRules from "./MobilePricingRules.vue";
import MobilePavPricingRules from "./MobilePavPricingRules.vue";

const { getCat } = useHelpers();
const userStore = useUserStore();

const advertTypes = [
  "On Premise",
  "Street Lamp Pole",
  "Mobile First Party",
  "Mobile Third Party",
  "Third Party Application",
  "Outdoor Site",
  "Temporary Advert",
  "Small Format",
];
//const advertTypes = getCat(
//  userStore.userDetails.userInfo.admin_role_id,
//  userStore.userDetails.userInfo.department
//);

const advertType = ref(advertTypes[0]);

const getRuleType = computed(() => {
  // returns 'Application Fee' or 'Permit Fee' based on advertType

  if (advertType.value === "Small Format") {
    return ["Application Fee"];
  } else if (advertType.value === "Third Party Application") {
    return [];
  } else return ["Permit Fee", "Application Fee"];
});

const ruleType = ref(getRuleType.value[0]);

function updateCat(n) {
  advertType.value = n;
  ruleType.value = getRuleType.value[0];
}

function updateRule(n) {
  ruleType.value = n;
}
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <h4 class="text-2xl text-gray-700">Pricing Rules</h4>
    <div class="mt-5 flex gap-2.5 justify-end flex-wrap">
      <FilterButton
        v-if="getRuleType?.length > 1"
        :options="getRuleType"
        @change-cat="updateRule"
      />

      <FilterButton
        v-if="advertTypes.length > 1"
        :options="advertTypes"
        @change-cat="updateCat"
      />
    </div>
  </div>

  <div class="mt-4 p-5 bg-white rounded-lg">
    <PremisePricingRules
      v-if="advertType === 'On Premise'"
      :ruleType="ruleType"
    />
    <OutdoorSitePricingRules
      v-else-if="advertType === 'Outdoor Site'"
      :ruleType="ruleType"
    />
    <TemporaryPricingRules
      v-else-if="advertType === 'Temporary Advert'"
      :ruleType="ruleType"
    />
    <SmallFormatPricingRules
      v-else-if="advertType === 'Small Format'"
      :ruleType="ruleType"
    />
    <StreetLampPricingRules
      v-else-if="advertType === 'Street Lamp Pole'"
      :ruleType="ruleType"
    />
    <PractitionerPricingRules
      v-else-if="advertType === 'Third Party Application'"
    />
    <MobilePricingRules
      v-else-if="advertType === 'Mobile First Party'"
      :ruleType="ruleType"
    />
    <MobilePavPricingRules
      v-else-if="advertType === 'Mobile Third Party'"
      :ruleType="ruleType"
    />
  </div>
</template>
