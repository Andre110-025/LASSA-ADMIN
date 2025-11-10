<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, reactive } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

// Options for dropdowns
const pricingTypeOptions = ["daily", "weekly", "monthly", "fixed"];

const durationOptions = ["Monthly", "Quarterly", "Biannual", "Annually"];

const emit = defineEmits(["confirm"]);

const createLoading = ref(false);

const createForm = reactive({
  type_sign: null,
  pricing_type: null,
  base_price: null,
  size_threshold: null,
  price_per_unit_size: null,
  size_range_min: null,
  size_range_max: null,
  duration: null,
  party_type: null, // first_party, third_party, both_party, blanket
  is_special_calculation: false,
});

const createRules = async () => {
  try {
    createLoading.value = true;

    // Validate all items
    if (
      !createForm.type_sign ||
      !createForm.pricing_type ||
      (!createForm.base_price && !createForm.price_per_unit_size)
    ) {
      toast.error(
        "Please fill in all required fields: Type Sign, Pricing Type, and either Base Price or Price Per Unit Size."
      );
      return;
    }

    const { data, status } = await axios.post(
      "createtemporaryadspricing",
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
        for="type_sign"
          >
        Type Sign*
          </label>
          <input
        v-model="createForm.type_sign"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="type_sign"
        placeholder="e.g., Billboard"
        :class="{
          'border-red-500': !createForm.type_sign && createLoading,
        }"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="pricing_type"
          >
        Pricing Type*
          </label>
          <select
        v-model="createForm.pricing_type"
        id="pricing_type"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{
          'border-red-500': !createForm.pricing_type && createLoading,
        }"
          >
        <option value="" disabled>Select Pricing Type</option>
        <option
          v-for="option in pricingTypeOptions"
          :key="option"
          :value="option"
        >
          {{ option.charAt(0).toUpperCase() + option.slice(1) }}
        </option>
          </select>
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="base_price"
          >
        Base Price
          </label>
          <input
        v-model.number="createForm.base_price"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="base_price"
        placeholder="e.g., 1000"
        :class="{
          'border-red-500':
            !createForm.base_price &&
            !createForm.price_per_unit_size &&
            createLoading,
        }"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="price_per_unit_size"
          >
        Price Per Unit Size
          </label>
          <input
        v-model.number="createForm.price_per_unit_size"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="price_per_unit_size"
        placeholder="e.g., 500"
        :class="{
          'border-red-500':
            !createForm.base_price &&
            !createForm.price_per_unit_size &&
            createLoading,
        }"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="size_threshold"
          >
        Size Threshold
          </label>
          <input
        v-model.number="createForm.size_threshold"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="size_threshold"
        placeholder="e.g., 10"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="size_range_min"
          >
        Size Range Min
          </label>
          <input
        v-model.number="createForm.size_range_min"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="size_range_min"
        placeholder="e.g., 1"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="size_range_max"
          >
        Size Range Max
          </label>
          <input
        v-model.number="createForm.size_range_max"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="size_range_max"
        placeholder="e.g., 20"
          />
        </div>

        <div>
          <label
        class="block text-sm font-medium text-gray-700 mb-1"
        for="duration"
          >
        Duration
          </label>
          <select
        v-model="createForm.duration"
        id="duration"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        <option value="" disabled>Select Duration</option>
        <option
          v-for="option in durationOptions"
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
        for="party_type"
          >
        Party Type
          </label>
          <select
        v-model="createForm.party_type"
        id="party_type"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        <option value="" disabled>Select Party Type</option>
        <option value="first_party">First Party</option>
        <option value="third_party">Third Party</option>
        <option value="both_party">Both Party</option>
        <option value="blanket">Blanket</option>
          </select>
        </div>

        <div class="flex items-center mt-6">
          <input
        v-model="createForm.is_special_calculation"
        type="checkbox"
        id="is_special_calculation"
        class="mr-2"
          />
          <label
        for="is_special_calculation"
        class="text-sm font-medium text-gray-700"
          >
        Special Calculation
          </label>
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
