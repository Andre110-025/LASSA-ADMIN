<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PopUpMobilePavPermitRuleDelete from "./PopUpMobilePavPermitRuleDelete.vue";
import PopUpMobilePavRuleCreate from "./PopUpMobilePavRuleCreate.vue";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getthirdpartymobileadspricing`);

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

    // Validate form - at least one price field should be filled
    const hasPrice =
      editForm.value.annual_price ||
      editForm.value.monthly_price ||
      editForm.value.quarterly_price ||
      editForm.value.biannual_price;

    if (!hasPrice) {
      toast.error("Please fill in at least one price field");
      return;
    }

    // Prepare payload to match expected format
    const payload = {
      vehicle_type: editForm.value.vehicle_type,
      annual_price: editForm.value.annual_price
        ? parseFloat(editForm.value.annual_price)
        : null,
      monthly_price: editForm.value.monthly_price
        ? parseFloat(editForm.value.monthly_price)
        : null,
      quarterly_price: editForm.value.quarterly_price
        ? parseFloat(editForm.value.quarterly_price)
        : null,
      biannual_price: editForm.value.biannual_price
        ? parseFloat(editForm.value.biannual_price)
        : null,
      daily_calculation_basis: editForm.value.daily_calculation_basis || false,
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updatethirdpartymobileadspricing/${editForm.value.id}`,
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
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const hasEditablePrice = (rule) => {
  return (
    rule.annual_price ||
    rule.monthly_price ||
    rule.quarterly_price ||
    rule.biannual_price
  );
};

const { open: openCreateModal, close: closeCreateModal } = useModal({
  component: PopUpMobilePavRuleCreate,
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
    component: PopUpMobilePavPermitRuleDelete,
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
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">
          Mobile PAV Permit Pricing Rules
        </h5>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vehicle Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Annual Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monthly Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quarterly Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Biannual Price
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Daily Calculation
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="rule in rules" :key="rule.id" class="hover:bg-gray-50">
              <!-- Editing Mode -->
              <template v-if="editingRule === rule.id">
                <td class="px-4 py-4">
                  <span class="text-sm text-gray-900 font-medium">
                    {{ rule.vehicle_type }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-if="rule.annual_price"
                    v-model="editForm.annual_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Annual price"
                  />
                  <span v-else class="text-sm text-gray-500">N/A</span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-if="rule.monthly_price"
                    v-model="editForm.monthly_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Monthly price"
                  />
                  <span v-else class="text-sm text-gray-500">N/A</span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-if="rule.quarterly_price"
                    v-model="editForm.quarterly_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Quarterly price"
                  />
                  <span v-else class="text-sm text-gray-500">N/A</span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-if="rule.biannual_price"
                    v-model="editForm.biannual_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Biannual price"
                  />
                  <span v-else class="text-sm text-gray-500">N/A</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    v-if="rule.daily_calculation_basis"
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
                <td class="px-4 py-4 text-sm text-gray-900 font-medium">
                  {{ rule.vehicle_type }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.annual_price) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(rule.monthly_price) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(rule.quarterly_price) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(rule.biannual_price) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    v-if="rule.daily_calculation_basis"
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
                      :disabled="!hasEditablePrice(rule)"
                      :class="
                        hasEditablePrice(rule)
                          ? 'text-blue-600 hover:text-blue-900'
                          : 'text-gray-400 cursor-not-allowed'
                      "
                      class="text-sm"
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
