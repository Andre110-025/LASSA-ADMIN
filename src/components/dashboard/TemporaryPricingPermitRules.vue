<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PopUpTemporaryPermitRuleDelete from "./PopUpTemporaryPermitRuleDelete.vue";
import PopUpTemporaryRuleCreate from "./PopUpTemporaryRuleCreate.vue";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

// Options for dropdowns
const pricingTypeOptions = ["daily", "weekly", "monthly", "fixed"];

const durationOptions = ["Monthly", "Quarterly", "Biannual", "Annually"];

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`gettemporarypricing`);

    if (data.success && status === 200) {
      rules.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching rules:", error);
    toast.error("Error fetching rules. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const startEdit = (rule) => {
  editingRule.value = rule.id;
  editForm.value = { ...rule };
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
      !editForm.value.type_sign ||
      !editForm.value.pricing_type ||
      !editForm.value.base_price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload to match expected format
    const payload = {
      type_sign: editForm.value.type_sign,
      pricing_type: editForm.value.pricing_type,
      base_price: parseFloat(editForm.value.base_price),
      size_threshold: editForm.value.size_threshold
        ? parseFloat(editForm.value.size_threshold)
        : null,
      price_per_unit_size: editForm.value.price_per_unit_size
        ? parseFloat(editForm.value.price_per_unit_size)
        : null,
      duration: editForm.value.duration || null,
      is_special_calculation: editForm.value.is_special_calculation || false,
      size_range_min: editForm.value.size_range_min
        ? parseFloat(editForm.value.size_range_min)
        : null,
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updatetemporaryadspricing/${editForm.value.id}`,
      payload
    );

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

const { open: openCreateModal, close: closeCreateModal } = useModal({
  component: PopUpTemporaryRuleCreate,
  attrs: {
    onConfirm(bol) {
      if (bol) {
        getRules(); // Refresh the rules list
      }
      closeCreateModal();
    },
  },
});

const deleteRule = async (rule) => {
  const { open, close } = useModal({
    component: PopUpTemporaryPermitRuleDelete,
    attrs: {
      rule: rule,
      onConfirm(bol) {
        if (bol) {
          getRules();
        }
        close();
      },
    },
  });

  open();
};

// Group rules by type_sign
const groupedRules = computed(() => {
  const grouped = {};
  rules.value.forEach((rule) => {
    const key = rule.type_sign;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(rule);
  });
  return grouped;
});

onMounted(() => {
  getRules();
});
</script>

<template>
  <!-- Create New Rules Button -->
  <div class="mb-6 flex justify-end">
    <button
      @click="openCreateModal()"
      class="bg-white group border-mainColor border hover:bg-mainColor px-4 py-2 rounded-md flex items-center space-x-2"
    >
      <svg
        class="w-4 h-4 stroke-mainColor group-hover:stroke-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span class="group-hover:text-white">Create New Rules</span>
    </button>
  </div>
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
      v-for="(groupRules, typeSign) in groupedRules"
      :key="typeSign"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">{{ typeSign }}</h5>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pricing Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Base Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Size Range (m²)
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Size Threshold
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price Per Unit Size
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duration
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Special Calculation
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
                  <!-- <select
                    v-model="editForm.pricing_type"
                    class="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Select type</option>
                    <option
                      v-for="option in pricingTypeOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select> -->
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800':
                        rule.pricing_type === 'daily',
                      'bg-green-100 text-green-800':
                        rule.pricing_type === 'weekly',
                      'bg-purple-100 text-purple-800':
                        rule.pricing_type === 'monthly',
                      'bg-orange-100 text-orange-800':
                        rule.pricing_type === 'fixed',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full capitalize"
                  >
                    {{ rule.pricing_type }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.base_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td class="px-4 py-4">
                  <div v-if="false" class="flex space-x-2">
                    <input
                      v-model="editForm.size_range_min"
                      type="number"
                      step="0.01"
                      placeholder="Min"
                      class="w-20 px-2 py-1 border rounded text-sm"
                    />
                    <span class="self-center">-</span>
                    <input
                      v-model="editForm.size_range_max"
                      type="number"
                      step="0.01"
                      placeholder="Max"
                      class="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  {{ rule.size_range_min
                  }}{{
                    rule.size_range_max ? ` - ${rule.size_range_max}` : "+"
                  }}
                </td>
                <td class="px-4 py-4">
                  {{ rule.size_threshold || "N/A" }}
                  <input
                    v-model="editForm.size_threshold"
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    class="w-24 px-2 py-1 border rounded text-sm"
                    v-if="false"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.price_per_unit_size"
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    v-if="editForm.price_per_unit_size"
                  />
                  <span v-else>
                    {{
                      rule.price_per_unit_size
                        ? formatCurrency(rule.price_per_unit_size)
                        : "N/A"
                    }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <select
                    v-model="editForm.duration"
                    class="px-2 py-1 border rounded text-sm"
                    v-if="false"
                  >
                    <option value="">Select duration</option>
                    <option
                      v-for="option in durationOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  {{ rule.duration || "N/A" }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    v-if="rule.is_special_calculation"
                    class="text-green-600 font-semibold"
                  >
                    Yes
                  </span>
                  <span v-else class="text-red-500">No</span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex space-x-2">
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
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800':
                        rule.pricing_type === 'daily',
                      'bg-green-100 text-green-800':
                        rule.pricing_type === 'weekly',
                      'bg-purple-100 text-purple-800':
                        rule.pricing_type === 'monthly',
                      'bg-orange-100 text-orange-800':
                        rule.pricing_type === 'fixed',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full capitalize"
                  >
                    {{ rule.pricing_type }}
                  </span>
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.base_price) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ rule.size_range_min
                  }}{{
                    rule.size_range_max ? ` - ${rule.size_range_max}` : "+"
                  }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ rule.size_threshold || "N/A" }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{
                    rule.price_per_unit_size
                      ? formatCurrency(rule.price_per_unit_size)
                      : "N/A"
                  }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ rule.duration || "N/A" }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    v-if="rule.is_special_calculation"
                    class="text-green-600 font-semibold"
                  >
                    Yes
                  </span>
                  <span v-else class="text-red-500">No</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="startEdit(rule)"
                      class="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteRule(rule)"
                      class="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
