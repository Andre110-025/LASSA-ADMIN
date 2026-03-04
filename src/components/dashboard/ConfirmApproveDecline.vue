<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref } from "vue";

const props = defineProps({
  item: Object,
  status: String,
  onConfirm: Function,
});
const emit = defineEmits(["confirm"]);

const comment = ref("");

const submit = () => {
  props.onConfirm(comment.value);
};
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="relative m-auto flex flex-col bg-white border rounded-xl shadow-2xl p-6 w-[90%] max-w-[450px] space-y-4"
    overlay-class="bg-black/50 backdrop-blur-sm"
    :clickToClose="true"
  >
    <div class="flex flex-col items-center text-center">
      <div
        :class="
          status === 'approved'
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        "
        class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
      >
        <span class="text-xl font-bold">{{
          status === "approved" ? "✓" : "✕"
        }}</span>
      </div>

      <h2 class="text-xl font-bold text-gray-800">
        Confirm {{ status === "approved" ? "Approval" : "Decline" }}
      </h2>

      <p class="text-sm text-gray-500 mt-1">
        Are you sure? This action cannot be undone.
      </p>

      <div class="w-full mt-6">
        <label
          class="block text-left text-xs font-semibold text-gray-400 uppercase mb-1 ml-1"
        >
          Add a comment
        </label>
        <textarea
          v-model="comment"
          rows="4"
          placeholder="Reason for this action..."
          class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full mt-6">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
        >
          Cancel
        </button>

        <button
          @click="submit"
          :class="
            status === 'approved'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-red-600 hover:bg-red-700'
          "
          class="flex-1 px-4 py-2.5 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all order-1 sm:order-2 active:scale-95"
        >
          Confirm {{ status === "approved" ? "Approve" : "Decline" }}
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
