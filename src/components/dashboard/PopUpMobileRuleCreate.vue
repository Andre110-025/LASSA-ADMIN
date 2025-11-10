<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, reactive } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

// Options for dropdowns
const branding_type = [
  "Full Branding",
  "Partial Branding",
  "Wrap Around Branding",
];

const emit = defineEmits(["confirm"]);

const createLoading = ref(false);

const createForm = reactive({
  vehicle_type: null,
  branding_type: null,
  price: null,
});

const createRules = async () => {
  try {
    createLoading.value = true;

    // Validate all items
    if (
      !createForm.vehicle_type ||
      !createForm.branding_type ||
      !createForm.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data, status } = await axios.post(
      "createmobileadspricing",
      createForm
    );

    if (data.success && status === 200) {
      toast.success("Rules created successfully");
      emit("confirm", true);
    }
  } catch (error) {
    console.error("Error creating rules:", error);
    toast.error("Error creating rules. Please try again.");
  } finally {
    createLoading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex items-center justify-center"
    content-class="bg-white rounded-lg flex flex-col p-6 max-w-4xl w-full mx-4 max-h-[90vh]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">
        Create New Pricing Rules
      </h3>
      <button
        @click="$emit('confirm')"
        class="text-gray-500 hover:text-gray-700"
      >
        <svg
          class="w-6 h-6 stroke-red-600 hover:stroke-red-800"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="space-y-4 flex-1 overflow-y-auto">
      <div class="grid grid-cols-2 md:grid-cols-3 py-1 px-1 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="vehicle_type"
          >
            Vehicle Type*
          </label>
          <input
            v-model="createForm.vehicle_type"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="vehicle_type"
            placeholder="e.g., Side Branding"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="branding_type"
          >
            Branding Type*
          </label>
          <select
            v-model="createForm.branding_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="branding_type"
          >
            <option value="">Select vehicle type</option>
            <option
              v-for="option in branding_type"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="price"
          >
            Price*
          </label>
          <input
            v-model="createForm.price"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="price"
            placeholder="e.g., 1000"
          />
        </div>
      </div>
      <!-- <button
        @click="addNewItem"
        class="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-800"
      >
        + Add Another Rule
      </button> -->
    </div>

    <div class="flex justify-end space-x-3 mt-6">
      <button
        @click="$emit('confirm')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        Cancel
      </button>
      <button
        @click="createRules"
        :disabled="createLoading"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
      >
        {{ createLoading ? "Creating..." : "Create Rules" }}
      </button>
    </div>
  </VueFinalModal>
</template>
