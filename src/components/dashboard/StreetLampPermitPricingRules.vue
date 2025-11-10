<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PopUpStreetLampPermitRuleDelete from "./PopUpStreetLampPermitRuleDelete.vue";
import PopUpStreetLampRuleCreate from "./PopUpStreetLampRuleCreate.vue";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

// Options for dropdowns
const streetCategoryOptions = [
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  "Special N",
];

const typeOfSignOptions = ["FLEX", "BACKLIT", "LED"];

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getstreetlamppricing`);

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
      !editForm.value.type_of_sign ||
      !editForm.value.street_category ||
      !editForm.value.annual_permit_price ||
      !editForm.value.half_year_permit_price ||
      !editForm.value.monthly_permit_price ||
      !editForm.value.annual_admin_price ||
      !editForm.value.half_year_admin_price ||
      !editForm.value.monthly_admin_price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload - convert strings to numbers where needed
    const payload = {
      annual_permit_price: parseFloat(editForm.value.annual_permit_price),
      half_year_permit_price: parseFloat(editForm.value.half_year_permit_price),
      monthly_permit_price: parseFloat(editForm.value.monthly_permit_price),
      annual_admin_price: parseFloat(editForm.value.annual_admin_price),
      half_year_admin_price: parseFloat(editForm.value.half_year_admin_price),
      monthly_admin_price: parseFloat(editForm.value.monthly_admin_price),
      legal_percentage: parseFloat(editForm.value.legal_percentage) || 1.0,
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updatestreetlamppricing/${editForm.value.id}`,
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
  component: PopUpStreetLampRuleCreate,
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
    component: PopUpStreetLampPermitRuleDelete,
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

// Group rules by type of sign
const groupedRules = computed(() => {
  const grouped = {};
  rules.value.forEach((rule) => {
    const key = rule.type_of_sign;
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
      v-for="(groupRules, typeOfSign) in groupedRules"
      :key="typeOfSign"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">{{ typeOfSign }}</h5>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Street Category
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Annual Permit
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Half Year Permit
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monthly Permit
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Annual Admin
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Half Year Admin
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monthly Admin
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
                    v-model="editForm.street_category"
                    class="w-full px-2 py-1 border rounded text-sm"
                    v-if="false"
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
                  {{ rule.street_category }}
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.annual_permit_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Annual Permit"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.half_year_permit_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Half Year Permit"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.monthly_permit_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Monthly Permit"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.annual_admin_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Annual Admin"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.half_year_admin_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Half Year Admin"
                  />
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.monthly_admin_price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                    placeholder="Monthly Admin"
                  />
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
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ rule.street_category }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.annual_permit_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.half_year_permit_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.monthly_permit_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.annual_admin_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.half_year_admin_price) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.monthly_admin_price) }}
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
