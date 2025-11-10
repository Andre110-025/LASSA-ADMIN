<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PopUpOutdoorPermitRuleDelete from "./PopUpOutdoorPermitRuleDelete.vue";
import PopUpOutdoorRuleCreate from "./PopUpOutdoorRuleCreate.vue";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

// Search functionality
const searchQuery = ref("");
const selectedSignType = ref("");

const rules = ref([]);

// Options for dropdowns
const streetCategoryOptions = [
  "Rural Zone N",
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  "Local & International Airport N",
  // "Encroachment Zone N",
];

const calculationTypeOptions = ["daily", "weekly", "monthly"];

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getoutdoorpricing`);

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
      !editForm.value.designation ||
      !editForm.value.street_category ||
      !editForm.value.base_rate ||
      !editForm.value.calculation_type
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload - convert strings to numbers where needed
    const payload = {
      designation: editForm.value.designation,
      street_category: editForm.value.street_category,
      dimension_min: editForm.value.dimension_min
        ? parseFloat(editForm.value.dimension_min)
        : null,
      dimension_max: editForm.value.dimension_max
        ? parseFloat(editForm.value.dimension_max)
        : null,
      base_rate: parseFloat(editForm.value.base_rate),
      multiplier: parseFloat(editForm.value.multiplier) || 1,
      calculation_type: editForm.value.calculation_type,
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updateoutdoorpricing/${editForm.value.id}`,
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

const formatDimensions = (rule) => {
  if (rule.dimension_min && rule.dimension_max) {
    return `${rule.dimension_min} - ${rule.dimension_max}`;
  } else if (rule.dimension_min) {
    return `${rule.dimension_min}+`;
  } else if (rule.dimension_max) {
    return `≤ ${rule.dimension_max}`;
  }
  return "Any size";
};

const { open: openCreateModal, close: closeCreateModal } = useModal({
  component: PopUpOutdoorRuleCreate,
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
    component: PopUpOutdoorPermitRuleDelete,
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

// Get unique sign types for dropdown
const uniqueSignTypes = computed(() => {
  const types = [...new Set(rules.value.map(rule => rule.designation))];
  return types.sort();
});

// Filter rules based on search criteria
const filteredRules = computed(() => {
  let filtered = rules.value;

  // Filter by selected sign type
  if (selectedSignType.value) {
    filtered = filtered.filter(rule => rule.designation === selectedSignType.value);
  }

  // Filter by search query (searches across multiple fields)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(rule => 
      rule.designation.toLowerCase().includes(query) ||
      rule.street_category.toLowerCase().includes(query) ||
      rule.calculation_type.toLowerCase().includes(query)
    );
  }

  return filtered;
});


// Group rules by designation
const groupedRules = computed(() => {
  const grouped = {};
  filteredRules.value.forEach((rule) => {
    const key = rule.designation;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(rule);
  });
  return grouped;
});

// Clear all filters
const clearFilters = () => {
  searchQuery.value = "";
  selectedSignType.value = "";
};

// Check if filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() || selectedSignType.value;
});

onMounted(() => {
  getRules();
});
</script>

<template>
  <!-- Search and Filter Section -->
  <div class="mb-6 bg-white p-4 rounded-lg border">
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <!-- Search Input -->
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by sign type, street category, or duration..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
          />
          <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Sign Type Filter Dropdown -->
      <div class="min-w-0 md:min-w-48">
        <select
          v-model="selectedSignType"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Sign Types</option>
          <option
            v-for="signType in uniqueSignTypes"
            :key="signType"
            :value="signType"
          >
            {{ signType }}
          </option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <span
        v-if="searchQuery.trim()"
        class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
      >
        Search: "{{ searchQuery }}"
        <button @click="searchQuery = ''" class="ml-1 hover:text-blue-600">
          x
        </button>
      </span>
      <span
        v-if="selectedSignType"
        class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
      >
        Type: {{ selectedSignType }}
        <button
          @click="selectedSignType = ''"
          class="ml-1 hover:text-green-600"
        >
          x
        </button>
      </span>
    </div>
  </div>
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
      v-for="(groupRules, designation) in groupedRules"
      :key="designation"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">{{ designation }}</h5>
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
                Dimensions (m²)
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Base Rate
              </th>
              <!-- <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Multiplier
              </th> -->
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Calculation Type
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
                  {{ rule.street_category }}
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
                </td>
                <td class="px-4 py-4">
                  {{ formatDimensions(rule) }}
                  <div class="flex space-x-2" v-if="false">
                    <input
                      v-model="editForm.dimension_min"
                      type="number"
                      step="0.01"
                      placeholder="Min"
                      class="w-20 px-2 py-1 border rounded text-sm"
                    />
                    <span class="self-center">-</span>
                    <input
                      v-model="editForm.dimension_max"
                      type="number"
                      step="0.01"
                      placeholder="Max"
                      class="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.base_rate"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
                  />
                </td>
                <!-- <td class="px-4 py-4">
                  <input
                    v-model="editForm.multiplier"
                    type="number"
                    step="0.01"
                    class="w-20 px-2 py-1 border rounded text-sm"
                  />
                </td> -->
                <td class="px-4 py-4">
                  <select
                    v-model="editForm.calculation_type"
                    class="px-2 py-1 border rounded text-sm"
                    v-if="false"
                  >
                    <option value="">Select type</option>
                    <option
                      v-for="option in calculationTypeOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800':
                        rule.calculation_type === 'daily',
                      'bg-green-100 text-green-800':
                        rule.calculation_type === 'weekly',
                      'bg-purple-100 text-purple-800':
                        rule.calculation_type === 'monthly',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full capitalize"
                  >
                    {{ rule.calculation_type }}
                  </span>
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
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDimensions(rule) }}
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.base_rate) }}
                </td>
                <!-- <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ rule.multiplier }}
                </td> -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800':
                        rule.calculation_type === 'daily',
                      'bg-green-100 text-green-800':
                        rule.calculation_type === 'weekly',
                      'bg-purple-100 text-purple-800':
                        rule.calculation_type === 'monthly',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full capitalize"
                  >
                    {{ rule.calculation_type }}
                  </span>
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
