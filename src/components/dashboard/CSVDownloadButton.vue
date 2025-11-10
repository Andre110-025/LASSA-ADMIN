<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import axios from "axios";

// Define props
const props = defineProps({
  productType: {
    type: String,
    required: true,
    validator: (value) =>
      [
        "On Premise",
        "Street Lamp Pole",
        "Mobile First Party",
        "Mobile Third Party",
        "Outdoor Site",
        "Temporary Advert",
        "Small Format",
      ].includes(value),
  },
  payload: {
    type: Object,
    required: true,
    default: () => ({
      start_date: "",
      end_date: "",
      lga: "",
    }),
  },
  buttonText: {
    type: String,
    default: "Export CSV",
  },
  buttonClass: {
    type: String,
    default:
      "flex flex-row gap-2 rounded-md px-5 py-2.5 text-sm border-gray-400 text-black bg-gray-100 transition justify-center items-center",
  },
});

// Reactive data
const anchorLink = ref(null);
const downloadLink = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Computed endpoint URL
const endpointUrl = computed(() => {
  // write a switch case to return the correct endpoint based on productType and pass the payload as query parameters
  //   mobiledownloadcsv
  // onpremisedownloadcsv
  // streetLampdownloadcsv
  // smallformatdownloadcsv
  // temporarydownloadcsv
  // thirdpartymobiledownloadcsv
  // outdoordownloadcsv
  
  switch (props.productType) {
    case "On Premise":
      return "onpremisedownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}&lga=${props.payload.lga}`;
    case "Street Lamp Pole":
      return "streetLampdownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}`;
    case "Mobile First Party":
      return "mobiledownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}`;
    case "Mobile Third Party":
      return "thirdpartymobiledownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}`;
    case "Outdoor Site":
      return "outdoordownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}&lga=${props.payload.lga}`;
    case "Temporary Advert":
      return "temporarydownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}`;
    case "Small Format":
      return "smallformatdownloadcsv" + `?start_date=${props.payload.start_date}&end_date=${props.payload.end_date}`;
    default:
      throw new Error("Invalid product type");
  }
});

// Computed filename
const fileName = computed(() => {
  const startDate = props.payload.start_date?.replace(/\//g, "-") || "unknown";
  const endDate = props.payload.end_date?.replace(/\//g, "-") || "unknown";
  const lga = props.payload.lga || null;
  return `${props.productType}${lga?"_"+lga:''}_${startDate}_to_${endDate}.csv`;
});

// Function to download CSV
const downloadCSV = async () => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    error.value = null;

    const { data } = await axios.get(endpointUrl.value, {
      responseType: "blob",
    });

    // Create a blob from the CSV data
    const blob = new Blob([data], {
      type: "text/csv",
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Clean up previous URL if exists
    if (downloadLink.value) {
      window.URL.revokeObjectURL(downloadLink.value);
    }

    // Set the download link
    downloadLink.value = url;

    // Update anchor link attributes
    if (anchorLink.value) {
      anchorLink.value.href = url;
      anchorLink.value.download = fileName.value;
      // Trigger download
      anchorLink.value.click();
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Error downloading CSV file";
    console.error("Error downloading CSV:", err);
  } finally {
    isLoading.value = false;
  }
};

// Reset function
const resetDownload = () => {
  if (downloadLink.value) {
    window.URL.revokeObjectURL(downloadLink.value);
    downloadLink.value = null;
  }
  error.value = null;
  isLoading.value = false;

  if (anchorLink.value) {
    anchorLink.value.removeAttribute("href");
    anchorLink.value.removeAttribute("download");
  }
};

// Watch for payload changes and reset
watch(
  () => props.payload,
  () => {
    resetDownload();
  },
  { deep: true }
);

// Watch for product type changes and reset
watch(
  () => props.productType,
  () => {
    resetDownload();
  }
);

// Cleanup on unmount
onUnmounted(() => {
  resetDownload();
});
</script>

<template>
  <div class="relative">
    <button
      :class="buttonClass"
      @click="downloadCSV"
      :disabled="isLoading"
      type="button"
    >
      <!-- Loading spinner -->
      <div
        v-if="isLoading"
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"
      ></div>

      <!-- Export icon (you can replace with your IconExport component) -->
      <svg
        v-else
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>

      <span class="h-fit max-md:hidden p-0 m-0">
        {{ isLoading ? "Downloading..." : buttonText }}
      </span>
    </button>

    <!-- Hidden anchor for download -->
    <a ref="anchorLink" style="display: none" aria-hidden="true"></a>

    <!-- Error message -->
    <div
      v-if="error"
      class="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm z-10"
    >
      {{ error }}
    </div>
  </div>
</template>
