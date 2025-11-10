<script setup>
import { ref } from "vue";
import FilterButton from "./buttons/request/FilterButton.vue";
// import DetailPopup from "./popups/DetailPopup.vue";
// import { useModal } from "vue-final-modal";
import PremiseAppDataTable from "./PremiseAppDataTable.vue";
import MobileDataTable from "./MobileDataTable.vue";
import StreetLampDataTable from "./StreetLampDataTable.vue";
import ThirdPartyAppTable from "./ThirdPartyAppTable.vue";
import OutDoorSiteAppTable from "./OutDoorSiteAppTable.vue";
import SmallFormatTable from "./SmallFormatTable.vue";
import TemporaryTable from "./TemporaryTable.vue";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "./../../helper";

const userStore = useUserStore();
const { getCat } = useHelpers();

const advertTypes = getCat(userStore.userDetails.userInfo.admin_role_id, userStore.userDetails.userInfo.department);

const advertType = ref(advertTypes[0]);

function updateCat(n) {
  advertType.value = n;
}

// const { open: openDetailPopup, close: closeDetailPopup } = useModal({
//   component: DetailPopup,
//   attrs: {
//     onConfirm() {
//       closeDetailPopup();
//     },
//   },
//   slots: {},
// });
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <div class="flex sm:flex-row flex-col gap-4 justify-between">
      <h4 class="text-2xl text-gray-700">{{ advertType }} Pending Task</h4>
      <FilterButton
        v-if="advertTypes.length > 1"
        :options="advertTypes"
        @change-cat="updateCat"
      />
    </div>
  </div>

  <div class="mt-4 p-5 bg-white rounded-lg">
    <PremiseAppDataTable v-if="advertType === 'On Premise'" :task="true" />
    <StreetLampDataTable
      v-if="advertType === 'Street Lamp Pole'"
      :task="true"
    />
    <MobileDataTable
      v-else-if="
        advertType === 'Mobile First Party' ||
        advertType === 'Mobile Third Party'
      "
      :task="true"
      :mobileType="advertType"
    />
    <ThirdPartyAppTable
      v-else-if="advertType === 'Third Party Application'"
      :task="true"
    />
    <OutDoorSiteAppTable
      v-else-if="advertType === 'Outdoor Site'"
      :task="true"
    />
    <SmallFormatTable
      v-else-if="advertType === 'Small Format'"
      :task="true"
    />
    <TemporaryTable
      v-else-if="advertType === 'Temporary Advert'"
      :task="true"
    />
  </div>
</template>
