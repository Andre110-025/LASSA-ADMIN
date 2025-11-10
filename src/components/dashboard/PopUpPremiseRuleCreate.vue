<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

// Options for dropdowns
const streetCategoryOptions = [
  "Rural Zone N",
  "Normal Zone N",
  "High Street N",
  "Restrictive Zone N",
];

const durationOptions = [
  "daily",
  "weekly",
  // "monthly", "fixed"
];

const emit = defineEmits(["confirm"]);

const createLoading = ref(false);
const createForm = ref({
  items: [
    {
      street_category: "",
      sign_type: "",
      min_square_meter: "",
      max_square_meter: "",
      price_per_sqm: "",
      is_bank_other_price: false,
      duration: "daily",
    },
  ],
});

const addNewItem = () => {
  createForm.value.items.push({
    street_category: "",
    sign_type: "",
    min_square_meter: "",
    max_square_meter: "",
    price_per_sqm: "",
    is_bank_other_price: false,
    duration: "daily",
  });
};

const removeItem = (index) => {
  if (createForm.value.items.length > 1) {
    createForm.value.items.splice(index, 1);
  }
};


const createRules = async () => {
  try {
    createLoading.value = true;

    // Validate all items
    for (let i = 0; i < createForm.value.items.length; i++) {
      const item = createForm.value.items[i];
      if (!item.street_category || !item.sign_type || !item.price_per_sqm) {
        toast.error(`Please fill in all required fields for item ${i + 1}`);
        return;
      }
    }

    const { data, status } = await axios.post(
      "createonpremisepricing",
      createForm.value
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
      <div
        v-for="(item, index) in createForm.items"
        :key="index"
        class="border rounded-lg p-4"
      >
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium text-gray-800">Rule {{ index + 1 }}</h4>
          <button
            v-if="createForm.items.length > 1"
            @click="removeItem(index)"
            class="text-red-600 hover:text-red-800"
          >
            <svg
              class="w-4 h-4 stroke-red-600 hover:stroke-red-800"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'street_category_' + index"
              >Street Category*</label
            >
            <select
              v-model="item.street_category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :id="'street_category_' + index"
            >
              <option value="">Select category</option>
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
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'sign_type_' + index"
              >Sign Type*</label
            >
            <input
              v-model="item.sign_type"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Roof Signs"
              :id="'sign_type_' + index"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'duration_' + index"
              >Duration</label
            >
            <select
              v-model="item.duration"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :id="'duration_' + index"
            >
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
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'min_square_meter_' + index"
              >Min Square Meter</label
            >
            <input
              v-model="item.min_square_meter"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :id="'min_square_meter_' + index"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'max_square_meter_' + index"
              >Max Square Meter</label
            >
            <input
              v-model="item.max_square_meter"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :id="'max_square_meter_' + index"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" :for="'price_per_sqm_' + index"
              >Price per SQM*</label
            >
            <input
              v-model="item.price_per_sqm"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :id="'price_per_sqm_' + index"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="item.is_bank_other_price"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :id="'is_bank_other_price_' + index"
            />
            <label class="ml-2 text-sm text-gray-700" :for="'is_bank_other_price_' + index">Bank/Other Price</label>
          </div>
        </div>
      </div>

      <button
        @click="addNewItem"
        class="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-800"
      >
        + Add Another Rule
      </button>
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
