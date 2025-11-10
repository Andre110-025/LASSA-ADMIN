<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  rule: {
    type: Object,
    required: true,
  },
});

const deleteLoading = ref(false);

const emit = defineEmits(["confirm"]);

const confirmDelete = async () => {
  try {
    deleteLoading.value = true;
    const { data, status } = await axios.get(
      `deleteonpremisepricing/${props.rule.id}`
    );

    if (data.success && status === 200) {
      // Remove the rule from the local array
      // const index = rules.value.findIndex((r) => r.id === props.rule.id);
      // if (index !== -1) {
      //   rules.value.splice(index, 1);
      // }

      toast.success("Rule deleted successfully");
      emit("confirm", true);
    }
  } catch (error) {
    console.error("Error deleting rule:", error);
    toast.error("Error deleting rule. Please try again.");
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex items-center justify-center"
    content-class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="flex items-center mb-4">
      <div
        class="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center"
      >
        <svg class="w-6 h-6 stroke-red-600" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
    </div>
    <h3 class="text-lg font-medium text-red-600 text-center mb-4">
      Delete Pricing Rule
    </h3>
    <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <p class="text-sm text-yellow-800">
        <strong>⚠️ Warning:</strong> Deleting this rule will affect the pricing
        structure for <strong>"{{ rule.sign_type }}"</strong> signs in
        <strong>"{{ rule.street_category }}"</strong> category.
      </p>
      <p class="text-sm text-yellow-800 mt-2">
        This action cannot be undone and may impact existing permit
        calculations.
      </p>
    </div>
    <div class="flex justify-end space-x-3">
      <button
        @click="$emit('confirm')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        Cancel
      </button>
      <button
        @click="confirmDelete"
        :disabled="deleteLoading"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
      >
        {{ deleteLoading ? "Deleting..." : "Delete Rule" }}
      </button>
    </div>
  </VueFinalModal>
</template>
