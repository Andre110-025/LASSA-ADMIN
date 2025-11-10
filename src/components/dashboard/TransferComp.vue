<script setup>
import IconAppStatus from "../icons/IconAppStatus.vue";
import CommentBox from "./buttons/CommentBox.vue";

defineProps({
  transferData: Object,
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
        Site Transfer Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request ID</p>
      <p class="text-sm" v-text="transferData.application_id"></p>
    </div>

    <div v-if="false" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Arrears Payer</p>
      <p
        class="text-sm"
        v-text="transferData.transfer_outstanding ? 'New User' : 'Old User'"
      ></p>
    </div>

    <div
      v-if="transferData.rm_recommendation"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">RM Recommendation</p>
      <p class="text-sm">
        <IconAppStatus :status="transferData.rm_recommendation" />
      </p>
    </div>

    <CommentBox
      v-if="transferData.rm_comment"
      :comments="transferData.rm_comment"
      :currentState="transferData.rm_recommendation"
    />

    <div
      v-if="transferData.hod_recommendation"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">HOD Recommendation</p>
      <p class="text-sm">
        <IconAppStatus :status="transferData.hod_recommendation" />
      </p>
    </div>

    <CommentBox
      v-if="transferData.hod_comment"
      :comments="transferData.hod_comment"
      :currentState="transferData.hod_recommendation"
    />

    <div v-if="transferData.md_approval" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">MD Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="transferData.md_approval" />
      </p>
    </div>

    <CommentBox
      v-if="transferData.md_comment"
      :comments="transferData.md_comment"
      :currentState="transferData.md_approval"
    />

    <div class="flex flex-col gap-2">
      <p class="w-2/5 text-sm font-semibold">Transfer Letter</p>
      <embed
        :src="transferData.letter_transfer"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>
    <!-- <div
      v-if="transferData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Signage Cost</p>
      <p
        class="text-sm"
        v-text="
          formatCurrency(adsPrice)
        "
      ></p>
    </div>

    <div
      v-if="transferData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Legal Cost</p>
      <p
        class="text-sm"
        v-text="
          formatCurrency(legalFee)
        "
      ></p>
    </div> -->
  </div>
</template>
