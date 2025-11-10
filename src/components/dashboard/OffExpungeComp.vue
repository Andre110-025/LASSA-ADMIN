<script setup>
import { useHelpers } from "../../helper";
import IconAppStatus from "../icons/IconAppStatus.vue";
import CommentBox from "./buttons/CommentBox.vue";

defineProps({
  offExpungeData: Object,
});
</script>

<template>
  <div class="flex flex-col p-6 gap-4">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Off-Charge / Expunge Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request Type</p>
      <p class="text-sm" v-text="offExpungeData.type_charges"></p>
    </div>

    <div v-if="offExpungeData.type_charges !== 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Start Date</p>
      <p class="text-sm" v-text="offExpungeData.off_charge_start"></p>
    </div>

    <div v-if="offExpungeData.type_charges !== 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">End Date</p>
      <p class="text-sm" v-text="offExpungeData.off_charge_end"></p>
    </div>

    <div v-if="offExpungeData.type_charges === 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Expunge Date</p>
      <p class="text-sm" v-text="offExpungeData.expunge_date"></p>
    </div>

    <div
      class="flex xs:flex-row align-middle"
      v-if="offExpungeData.rm_recommedation"
    >
      <p class="w-2/5 text-sm font-semibold">RM Recommendatiom</p>
      <p class="text-sm">
        <IconAppStatus :status="offExpungeData.rm_recommedation" />
      </p>
    </div>

    <CommentBox v-if="offExpungeData.rm_comment" :comments="offExpungeData.rm_comment" :current-state="offExpungeData.rm_recommedation" />

    <div
      class="flex xs:flex-row align-middle"
      v-if="offExpungeData.complaince_confirm_status"
    >
      <p class="w-2/5 text-sm font-semibold">Compliance Status</p>
      <p class="text-sm">
        <IconAppStatus :status="offExpungeData.complaince_confirm_status" />
      </p>
    </div>

    <div
      class="flex xs:flex-row align-middle"
      v-if="offExpungeData.hod_recommedation"
    >
      <p class="w-2/5 text-sm font-semibold">HOD Status</p>
      <p class="text-sm">
        <IconAppStatus :status="offExpungeData.hod_recommedation" />
      </p>
    </div>

    <CommentBox v-if="offExpungeData.hod_comment" :comments="offExpungeData.hod_comment" :current-state="offExpungeData.hod_recommedation" />

    <div
      class="flex xs:flex-row align-middle"
      v-if="offExpungeData.md_approval"
    >
      <p class="w-2/5 text-sm font-semibold">MD Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="offExpungeData.md_approval" />
      </p>
    </div>

    <CommentBox v-if="offExpungeData.md_comment" :comments="offExpungeData.md_comment" :current-state="offExpungeData.md_approval" />

    <div
      class="flex flex-col gap-2"
      v-if="
        offExpungeData?.letter_offcharge
      "
    >
      <p class="w-2/5 text-sm font-semibold">Off-Charge Letter</p>
      <embed
        :src="offExpungeData?.letter_offcharge"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>

    
    <div class="flex flex-col gap-2" v-if="offExpungeData?.off_charge_picture">
      <p class="w-2/5 text-sm font-semibold">Off-Charge Image</p>
      <img
        :src="offExpungeData?.off_charge_picture"
        alt=""
        class="w-full bg-gray-600"
      />
    </div>

    <div
      class="flex flex-col gap-2"
      v-if="
        offExpungeData?.compliance_report
      "
    >
      <p class="w-2/5 text-sm font-semibold">Compliance Report</p>
      <embed
        :src="offExpungeData?.compliance_report"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>

    <div
      class="flex flex-col gap-2"
      v-if="
        offExpungeData?.site_submission &&
        offExpungeData.complaince_confirm_status !== 'disapproved' &&
        !offExpungeData.md_approval
      "
    >
      <p class="w-2/5 text-sm font-semibold">RM Submission</p>
      <embed
        :src="offExpungeData?.site_submission"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>
  </div>
</template>
