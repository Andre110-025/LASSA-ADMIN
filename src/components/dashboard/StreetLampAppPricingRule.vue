<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingRule = ref(null);
const editForm = ref({});

const rules = ref([]);

const getRules = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getstreetlampapplicationpricing`);

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
  editForm.value = {
    ...rule,
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
    if (!editForm.value.app_price) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Convert to numbers and validate
    const appPrice = parseFloat(editForm.value.app_price);

    if (isNaN(appPrice)) {
      toast.error("Please enter valid numeric values");
      return;
    }

    if (appPrice < 0) {
      toast.error("Values cannot be negative");
      return;
    }

    // Prepare payload to match the expected format
    const payload = {
      app_price: appPrice,
      type_of_sign: editForm.value.type_of_sign,
    };

    // Make API call to update rule
    const { data, status } = await axios.post(
      `updatestreetlampapplicationpricing/${editForm.value.id}`,
      payload
    );

    if (data.success && status === 200) {
      // Update the rule in the local array
      const index = rules.value.findIndex((r) => r.id === editForm.value.id);
      if (index !== -1) {
        rules.value[index] = {
          ...editForm.value,
          app_price: appPrice,
        };
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
  <div v-else class="overflow-x-auto">
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
            Application Price
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
            <td class="px-4 py-4 text-sm text-gray-900">
              <div class="font-medium">{{ rule.type_of_sign }}</div>
            </td>
            <td class="px-4 py-4">
              <input
                v-model="editForm.app_price"
                type="number"
                step="0.01"
                placeholder="Application Price"
                class="w-32 px-2 py-1 border rounded text-sm"
              />
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
              <div class="font-medium">{{ rule.type_of_sign }}</div>
            </td>
            <td
              class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
            >
              {{ formatCurrency(rule.app_price) }}
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
</template>
