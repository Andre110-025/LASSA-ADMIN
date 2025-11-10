<script setup>
import { useHelpers } from "../../helper";
const { formatCurrency } = useHelpers();
import IconAppStatus from "../icons/IconAppStatus.vue";
import CommentBox from "./buttons/CommentBox.vue";

defineProps({
  upDownGradeData: Object,
  adsPrice: {
    default: null,
  },
  legalFee: {
    default: null,
  },
});
</script>

<template>
  <div class="flex flex-col p-6 gap-4">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Upgrade/Downgrade Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request ID</p>
      <p class="text-sm" v-text="upDownGradeData.application_id"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request Type</p>
      <p class="text-sm" v-text="upDownGradeData.type_charges"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Sign Type</p>
      <p class="text-sm" v-text="upDownGradeData.request_outdoor_signage"></p>
    </div>

    <div
      v-if="upDownGradeData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Signage Cost</p>
      <p class="text-sm" v-text="formatCurrency(adsPrice)"></p>
    </div>

    <div
      v-if="upDownGradeData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Legal Cost</p>
      <p class="text-sm" v-text="formatCurrency(legalFee)"></p>
    </div>

    <div
      v-if="upDownGradeData.installation_date"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Installation Date</p>
      <p class="text-sm" v-text="upDownGradeData.installation_date"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Site Inspection Status</p>
      <p class="text-sm">
        <IconAppStatus :status="upDownGradeData.site_inspection_status" />
      </p>
    </div>

    <div
      class="flex xs:flex-row align-middle"
      v-if="upDownGradeData.hod_recommendation"
    >
      <p class="w-2/5 text-sm font-semibold">HOD Recommendation</p>
      <p class="text-sm">
        <IconAppStatus :status="upDownGradeData.hod_recommendation" />
      </p>
    </div>

    <CommentBox
      v-if="upDownGradeData.hod_comment"
      :comments="upDownGradeData.hod_comment"
      :currentState="upDownGradeData.hod_recommendation"
    />

    <div
      class="flex xs:flex-row align-middle"
      v-if="upDownGradeData.md_approval"
    >
      <p class="w-2/5 text-sm font-semibold">MD Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="upDownGradeData.md_approval" />
      </p>
    </div>

    <CommentBox
      v-if="upDownGradeData.md_comment"
      :comments="upDownGradeData.md_comment"
      :currentState="upDownGradeData.md_approval"
    />

    <div
      class="flex xs:flex-row align-middle"
      v-if="upDownGradeData.hod_billngs"
    >
      <p class="w-2/5 text-sm font-semibold">HOD BIlling Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="upDownGradeData.hod_billngs" />
      </p>
    </div>

    <div
      class="flex xs:flex-row align-middle"
      v-if="upDownGradeData.hod_registry"
    >
      <p class="w-2/5 text-sm font-semibold">HOD Registry Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="upDownGradeData.hod_registry" />
      </p>
    </div>

    <div class="flex flex-col gap-2" v-if="upDownGradeData?.second_assessment">
      <p class="w-2/5 text-sm font-semibold">HOD Assessment</p>
      <embed
        :src="upDownGradeData?.second_assessment"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>

    <div class="flex flex-col gap-2" v-if="upDownGradeData?.first_assesment">
      <p class="w-2/5 text-sm font-semibold">RM Assessment</p>
      <embed
        :src="upDownGradeData?.first_assesment"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>
  </div>
</template>
