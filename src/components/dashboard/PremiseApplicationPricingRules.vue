<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

// Options for dropdowns
const propertyTypeOptions = ["Single Business Unit", "Multi-tenanted Business"];

const signTypeOptions = [
  "Led Sign",
  "Led Screens At Filling Stations",
  "Street Directional Sign",
  "Street Light Pole Directional Sign",
  "Regular Sign",
];

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(
      `getonpremiseapplicationpricingpules`
    );

    if (data.success && status === 200) {
      rules.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching rules:", error);
  } finally {
    isLoading.value = false;
  }
};

const startEdit = (rule) => {
  editingRule.value = rule.id;
  editForm.value = {
    ...rule,
    // Handle combination_rules properly for editing
    combination_rules: rule.combination_rules || {},
  };
};

const cancelEdit = () => {
  editingRule.value = null;
  editForm.value = {};
};

const saveEdit = async () => {
  try {
    updateLoading.value = true;

    // Validate form
    if (
      !editForm.value.property_type ||
      !editForm.value.sign_type ||
      !editForm.value.base_price ||
      !editForm.value.additional_sign_price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = editForm.value;

    // Make API call to update rule
    const { data, status } = await axios.post("updateonpremiseapplicationpricing", payload);

    if (data.success && status === 200) {
      // Update the rule in the local array
      const index = rules.value.findIndex((r) => r.id === editForm.value.id);
      if (index !== -1) {
        rules.value[index] = { ...editForm.value };
      }

      editingRule.value = null;
      editForm.value = {};
      toast.success("Rule updated successfully");
    }
  } catch (error) {
    console.error("Error updating rule:", error);
    toast.error("Error updating rule. Please try again.");
  } finally {
    updateLoading.value = false;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Group rules by property type
const groupedRules = computed(() => {
  const grouped = {};
  rules.value.forEach((rule) => {
    const key = rule.property_type;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(rule);
  });
  return grouped;
});

// Helper function to format combination rules display
const formatCombinationRules = (combinationRules) => {
  if (!combinationRules || Object.keys(combinationRules).length === 0) {
    return "None";
  }

  const rules = [];
  if (combinationRules.led_and_street_directional) {
    rules.push(
      `LED + Street Directional: ${formatCurrency(
        combinationRules.led_and_street_directional
      )}`
    );
  }
  if (combinationRules.led_and_street_light) {
    rules.push(
      `LED + Street Light: ${formatCurrency(
        combinationRules.led_and_street_light
      )}`
    );
  }
  if (combinationRules.street_and_light_pole) {
    rules.push(
      `Street + Light Pole: ${formatCurrency(
        combinationRules.street_and_light_pole
      )}`
    );
  }
  if (combinationRules.all_three) {
    rules.push(`All Three: ${formatCurrency(combinationRules.all_three)}`);
  }

  return rules.join(", ");
};

onMounted(() => {
  getRules();
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="flex justify-center items-center py-12">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
    ></div>
    <span class="ml-2 text-gray-600">Loading...</span>
  </div>

  <!-- No Rules State -->
  <div v-else-if="rules.length === 0" class="text-center py-12">
    <NoList />
  </div>

  <!-- Rules List -->
  <div v-else class="space-y-6">
    <div
      v-for="(groupRules, propertyType) in groupedRules"
      :key="propertyType"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">{{ propertyType }}</h5>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sign Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                App Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Base Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Additional Sign Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Combination Rules
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="rule in groupRules"
              :key="rule.id"
              class="hover:bg-gray-50"
            >
              <!-- Editing Mode -->
              <template v-if="editingRule === rule.id">
                <td class="px-4 py-4">
                  <select
                    v-model="editForm.sign_type"
                    class="w-full px-2 py-1 border rounded text-sm"
                    v-if="false"
                  >
                    <option value="">Select sign type</option>
                    <option
                      v-for="option in signTypeOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <div class="font-medium">{{ rule.sign_type }}</div>
                </td>
                <td class="px-4 py-4">
                  <div class="font-medium">{{ rule.app_type }}</div>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.base_price"
                    type="number"
                    step="0.01"
                    placeholder="Base Price"
                    class="w-32 px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.additional_sign_price"
                    type="number"
                    step="0.01"
                    placeholder="Additional Price"
                    class="w-32 px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-4">
                  <div class="space-y-2 max-w-xs">
                    <div
                      class="flex items-center space-x-2"
                      v-if="
                        'led_and_street_directional' in
                        editForm.combination_rules
                      "
                    >
                      <label class="text-xs text-gray-600 min-w-0 flex-shrink-0"
                        >LED + Street:</label
                      >
                      <input
                        v-model="
                          editForm.combination_rules.led_and_street_directional
                        "
                        type="number"
                        step="0.01"
                        class="w-20 px-1 py-1 border rounded text-xs"
                      />
                    </div>
                    <div
                      class="flex items-center space-x-2"
                      v-if="
                        'led_and_street_light' in editForm.combination_rules
                      "
                    >
                      <label class="text-xs text-gray-600 min-w-0 flex-shrink-0"
                        >LED + Light:</label
                      >
                      <input
                        v-model="
                          editForm.combination_rules.led_and_street_light
                        "
                        type="number"
                        step="0.01"
                        class="w-20 px-1 py-1 border rounded text-xs"
                      />
                    </div>
                    <div
                      class="flex items-center space-x-2"
                      v-if="
                        'street_and_light_pole' in editForm.combination_rules
                      "
                    >
                      <label class="text-xs text-gray-600 min-w-0 flex-shrink-0"
                        >Street + Pole:</label
                      >
                      <input
                        v-model="
                          editForm.combination_rules.street_and_light_pole
                        "
                        type="number"
                        step="0.01"
                        class="w-20 px-1 py-1 border rounded text-xs"
                      />
                    </div>
                    <div
                      class="flex items-center space-x-2"
                      v-if="'all_three' in editForm.combination_rules"
                    >
                      <label class="text-xs text-gray-600 min-w-0 flex-shrink-0"
                        >All Three:</label
                      >
                      <input
                        v-model="editForm.combination_rules.all_three"
                        type="number"
                        step="0.01"
                        class="w-20 px-1 py-1 border rounded text-xs"
                      />
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-col space-y-2">
                    <button
                      @click="saveEdit"
                      :disabled="updateLoading"
                      class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {{ updateLoading ? "Saving..." : "Save" }}
                    </button>
                    <button
                      @click="cancelEdit"
                      class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </template>

              <!-- View Mode -->
              <template v-else>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="font-medium">{{ rule.sign_type }}</div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="font-medium">{{ rule.app_type }}</div>
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.base_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.additional_sign_price) }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="max-w-xs">
                    <div class="text-xs text-gray-600 space-y-1">
                      {{ formatCombinationRules(rule.combination_rules) }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="startEdit(rule)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
