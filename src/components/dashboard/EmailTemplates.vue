<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NoList from "./NoList.vue";
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const updateLoading = ref(false);
const editingContent = ref(null);
const editForm = ref({});

const contents = ref([]);

const getContents = async () => {
  try {
    isLoading.value = true;
    const { data, status } = await axios.get(`getemailcontent`);

    if (data.success && status === 200) {
      contents.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching email contents:", error);
    toast.error("Error fetching email contents. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const startEdit = (content) => {
  editingContent.value = content.id;
  editForm.value = { ...content };
};

const cancelEdit = () => {
  editingContent.value = null;
  editForm.value = {};
};

const saveEdit = async () => {
  try {
    updateLoading.value = true;

    // Validate form
    if (!editForm.value.content || !editForm.value.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload
    const payload = {
      content: editForm.value.content.trim()
    };

    // Make API call to update content
    const { data, status } = await axios.post(
      `updateemailcontent/${editForm.value.id}`,
      payload
    );

    if (data.success && status === 200) {
      // Update the content in the local array
      const index = contents.value.findIndex(c => c.id === editForm.value.id);
      if (index !== -1) {
        contents.value[index] = { ...contents.value[index], content: editForm.value.content };
      }

      editingContent.value = null;
      editForm.value = {};
      toast.success("Content updated successfully");
    }
  } catch (error) {
    console.error("Error updating content:", error);
    toast.error("Error updating content. Please try again.");
  } finally {
    updateLoading.value = false;
  }
};

// Helper function to format the key for display
const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to get content type based on key
const getContentType = (key) => {
  if (key.includes('subject')) return 'Subject';
  if (key.includes('content')) return 'Content';
  if (key === 'salutation') return 'Salutation';
  return 'Template';
};

onMounted(() => {
  getContents();
});
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Email Templates</h1>
      <p class="text-gray-600 mt-1">Manage your email notification templates</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Loading templates...</span>
    </div>

    <!-- No Content -->
    <div v-else-if="contents.length === 0" class="text-center py-12">
      <NoList />
    </div>

    <!-- Content List -->
    <div v-else class="space-y-4">
      <div
        v-for="content in contents"
        :key="content.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ getContentType(content.key) }}
                </span>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ formatKey(content.key) }}
                </h3>
              </div>
              <!-- <p class="text-sm text-gray-500">Key: {{ content.key }}</p> -->
            </div>
            
            <!-- Edit Button -->
            <button
              v-if="editingContent !== content.id"
              @click="startEdit(content)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>

          <!-- Content Display/Edit -->
          <div v-if="editingContent !== content.id" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Content:</label>
              <div class="bg-gray-50 rounded-md p-3 border">
                <p class="text-gray-800 whitespace-pre-wrap">{{ content.content }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Edit Content: <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="editForm.content"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                :class="{ 'border-red-300': !editForm.content?.trim() }"
                placeholder="Enter email content..."
              ></textarea>
              <p v-if="!editForm.content?.trim()" class="mt-1 text-sm text-red-600">
                Content is required
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 pt-2">
              <button
                @click="saveEdit"
                :disabled="updateLoading || !editForm.content?.trim()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div v-if="updateLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ updateLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              
              <button
                @click="cancelEdit"
                :disabled="updateLoading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>

          <!-- Metadata -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center text-xs text-gray-500 space-x-4">
              <!-- <span>ID: {{ content.id }}</span> -->
              <span v-if="content.created_at">Created: {{ new Date(content.created_at).toLocaleDateString() }}</span>
              <span v-if="content.updated_at">Updated: {{ new Date(content.updated_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="!isLoading && contents.length > 0" class="mt-8 text-center text-sm text-gray-500">
      Showing {{ contents.length }} email template{{ contents.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>