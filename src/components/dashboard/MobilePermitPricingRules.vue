<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PopUpMobilePermitRuleDelete from "./PopUpMobilePermitRuleDelete.vue";
import PopUpMobileRuleCreate from "./PopUpMobileRuleCreate.vue";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getmobileadspricing`);

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
      !editForm.value.vehicle_type ||
      !editForm.value.branding_type ||
      !editForm.value.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload to match expected format
    const payload = {
      vehicle_type: editForm.value.vehicle_type,
      branding_type: editForm.value.branding_type,
      price: parseFloat(editForm.value.price),
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updatemobileadspricing/${editForm.value.id}`,
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
  component: PopUpMobileRuleCreate,
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
    component: PopUpMobilePermitRuleDelete,
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

// Group rules by branding_type
const groupedRules = computed(() => {
  const grouped = {};
  rules.value.forEach((rule) => {
    const key = rule.branding_type;
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
      v-for="(groupRules, brandingType) in groupedRules"
      :key="brandingType"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h5 class="font-semibold text-gray-800">{{ brandingType }}</h5>
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
                Branding Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
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
                  <span
                    class="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded"
                  >
                    {{ rule.vehicle_type }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span
                    class="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded"
                  >
                    {{ rule.branding_type }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <input
                    v-model="editForm.price"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 border rounded text-sm"
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
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800': rule.vehicle_type === 'Car',
                      'bg-green-100 text-green-800':
                        rule.vehicle_type === 'Truck',
                      'bg-purple-100 text-purple-800':
                        rule.vehicle_type === 'Bus',
                      'bg-orange-100 text-orange-800':
                        rule.vehicle_type === 'Motorcycle',
                      'bg-red-100 text-red-800':
                        rule.vehicle_type === 'Trailer',
                      'bg-yellow-100 text-yellow-800':
                        rule.vehicle_type === 'SUV',
                      'bg-indigo-100 text-indigo-800':
                        rule.vehicle_type === 'Pickup',
                      'bg-pink-100 text-pink-800':
                        rule.vehicle_type === 'Tricycle',
                      'bg-gray-100 text-gray-800': ![
                        'Car',
                        'Truck',
                        'Bus',
                        'Motorcycle',
                        'Trailer',
                        'SUV',
                        'Pickup',
                        'Tricycle',
                      ].includes(rule.vehicle_type),
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ rule.vehicle_type }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-emerald-100 text-emerald-800':
                        rule.branding_type === 'Full Branding',
                      'bg-amber-100 text-amber-800':
                        rule.branding_type === 'Partial Branding',
                      'bg-cyan-100 text-cyan-800':
                        rule.branding_type === 'Wrap Around Branding',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ rule.branding_type }}
                  </span>
                </td>
                <td
                  class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                >
                  {{ formatCurrency(rule.price) }}
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
