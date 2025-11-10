<script setup>
import { ref, onMounted } from "vue";
import IconRevenue from "../../icons/IconRevenue.vue";
import IconLicense from "../../icons/IconLicense.vue";
import IconList from "../../icons/IconList.vue";
import IconAppFee from "../../icons/IconAppFee.vue";

const props = defineProps({
  info: Array,
});

const bgColor = ref("");

function getRandomDarkPrimaryColor(id) {
  // Array of dark primary colors
  const darkPrimaryColors = [
    "rgb(139, 0, 0)", // Dark Red
    "rgb(0, 0, 139)", // Dark Blue
    "rgb(0, 100, 0)", // Dark Green
    "rgb(85, 26, 139)", // Dark Purple (secondary but commonly used)
    "rgb(184, 134, 11)", // Dark Gold/Yellow
  ];

  // Select a random color from the array
  // const randomIndex = Math.floor(Math.random() * darkPrimaryColors.length);
  return darkPrimaryColors[id - 1];
}

const iconComponents = {
  revenue: IconRevenue,
  application: IconList,
  license: IconLicense,
  appFee: IconAppFee,
};

onMounted(() => {
  bgColor.value = getRandomDarkPrimaryColor();
});
</script>

<template>
  <div
    class="w-full flex flex-row relative gap-5 overflow-x-auto select-none"
  >
    <div
      class="h-auto flex flex-row w-1/3 rounded-lg gap-2 bg-white p-4 min-w-[200px]"
      v-for="(item, index) in info" :key="index"
    >
      <div class="grow">
        <p class="opacity-60 text-sm">{{ item.title }}</p>
        <p
          v-if="false"
          class="text-[.5rem] text-green-600 p-1 bg-green-100 w-fit rounded-lg"
        >
          {{ item.percentageChange }}%
        </p>
        <p v-if="false" class="text-[.6rem] text-gray-500">
          Total Income This {{ item.period }}
        </p>
        <p class="text-lg text-gray-700">{{ item.amount }}</p>
      </div>
      <div
        class="px-2 py-1 bg-gray-100 h-8 w-8 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: getRandomDarkPrimaryColor(item.id) }"
      >
        <component
          :is="iconComponents[item.icon]"
          class="w-6 h-6 text-white"
        />
      </div>
    </div>
  </div>
</template>
