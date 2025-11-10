<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, reactive } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

// Options for dropdowns
const streetCategoryOptions = [
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  "Special N",
];

const emit = defineEmits(["confirm"]);

const createLoading = ref(false);

const createForm = reactive({
  street_category: null,
  type_of_sign: null,
  annual_permit_price: null,
  half_year_permit_price: null,
  monthly_permit_price: null,
  annual_admin_price: null,
  half_year_admin_price: null,
  monthly_admin_price: null,
  legal_percentage: 1.0,
});

const createRules = async () => {
  try {
    createLoading.value = true;

    // Validate all items
    if (
      !createForm.type_of_sign ||
      !createForm.street_category ||
      !createForm.annual_permit_price ||
      !createForm.half_year_permit_price ||
      !createForm.monthly_permit_price ||
      !createForm.annual_admin_price ||
      !createForm.half_year_admin_price ||
      !createForm.monthly_admin_price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data, status } = await axios.post(
      "createstreetlamppricing",
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
        for="type_of_sign"
          >
        Type of Sign*
          </label>
          <input
        v-model="createForm.type_of_sign"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="type_of_sign"
        placeholder="e.g., Billboard"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="street_category"
          >
        Street Category*
          </label>
          <select
        v-model="createForm.street_category"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="street_category"
          >
        <option value="">Select street category</option>
        <option
          v-for="option in streetCategoryOptions"
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
        for="annual_permit_price"
          >
        Annual Permit Price*
          </label>
          <input
        v-model="createForm.annual_permit_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="annual_permit_price"
        placeholder="e.g., 10000"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="half_year_permit_price"
          >
        Half-Year Permit Price*
          </label>
          <input
        v-model="createForm.half_year_permit_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="half_year_permit_price"
        placeholder="e.g., 5000"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="monthly_permit_price"
          >
        Monthly Permit Price*
          </label>
          <input
        v-model="createForm.monthly_permit_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="monthly_permit_price"
        placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="annual_admin_price"
          >
        Annual Admin Price*
          </label>
          <input
        v-model="createForm.annual_admin_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="annual_admin_price"
        placeholder="e.g., 2000"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="half_year_admin_price"
          >
        Half-Year Admin Price*
          </label>
          <input
        v-model="createForm.half_year_admin_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="half_year_admin_price"
        placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="monthly_admin_price"
          >
        Monthly Admin Price*
          </label>
          <input
        v-model="createForm.monthly_admin_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="monthly_admin_price"
        placeholder="e.g., 200"
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
