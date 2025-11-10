<script setup>
import { ref, watch, computed, defineEmits } from "vue";
import { onClickOutside } from "@vueuse/core";
import IconCalender from "../../icons/IconCalender.vue";

// const props = defineProps({
//   date: Object,
// });

const emit = defineEmits(["updateRange"]);

const target = ref(null);
const showOptions = ref(false);

// Define options with meaningful labels and corresponding day values
const options = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 14 Days", value: 14 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 3 Months", value: 90 },
  { label: "Last 6 Months", value: 180 },
];

const selection = ref(null); // Default to "Last 7 Days"

// Emit selected range when user selects an option
function select(option) {
  selection.value = option;
  showOptions.value = false;
  emit("updateRange", option.value);
}

onClickOutside(target, () => (showOptions.value = false));
</script>

<template>
  <div class="relative select-none w-40 cursor-pointer">
    <!-- Dropdown Button -->
    <div
      class="flex justify-between bg-blue-100 rounded-md px-4 py-1 text-[.75rem] gap-2 my-auto"
      @click="showOptions = !showOptions"
      ref="target"
    >
      <p class="my-auto">{{ selection?.label || "Custom" }}</p>
      <div
        class="before:content-[''] before:border-l-[1px] before:border-l-mainColor before:absolute relative before:left-0 before:h-full before:translate-x-[-.45rem]"
      >
        <IconCalender class="h-4 my-auto relative" />
      </div>
    </div>

    <!-- Dropdown Options -->
    <div v-if="showOptions" class="absolute pt-10 top-0 z-50 w-full">
      <div class="bg-white shadow-lg text-xs flex flex-col w-full h-fit">
        <button
          v-for="option in options"
          :key="option.value"
          class="text-left py-2 px-4 hover:bg-blue-100 w-full"
          @click="select(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
