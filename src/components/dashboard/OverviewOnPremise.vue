<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import IncomeCard from "./cards/IncomeCard.vue";
import RevenueGraph from "./RevenueGraph.vue";
import PieChart from "./PieChart.vue";
import axios from "axios";
import { useHelpers } from "../../helper";
import { toast } from "vue3-toastify";

const { getRandomBrightColors, formatCurrencyNaira } = useHelpers();
const loading = ref(true);

const props = defineProps({
  date: Object,
  lga: String,
  accessRev: Boolean,
});

// Add this to your script setup section
const emit = defineEmits(["loadingChange"]);

// Watch the loading state
watch(loading, (newValue) => {
  emit("loadingChange", newValue);
});

const stats = reactive([
  {
    id: 1,
    title: "Total Applications",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "application",
  },
  {
    id: 2,
    title: "Application Fee",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "appFee",
  },
  {
    id: 3,
    title: "Total Permit Fee",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "revenue",
  },
]);

// Computed to removed revenue data from stats if accessRev is false
const filteredStats = computed(() => {
  return props.accessRev
    ? stats
    : stats.filter((item) => item.icon !== "revenue" && item.icon !== "appFee");
});

const revData = reactive({
  payment_breakdown_daily: [],
  payment_breakdown_monthly: [],
  payment_breakdown_weekly: [],
});

const pieData = reactive({
  property_type: {},
  product_type: {},
  total_property_type: 0,
  total_product_type: 0,
});

const getStats = async () => {
  try {
    loading.value = true;
    emit("loadingChange", true);

    const { data } = await axios.get(
      `onpremisepermitreport?start_date=${props.date.start_date}&end_date=${props.date.end_date}&lga=${props.lga}`
    );
    // console.log(response.data);
    // console.log(props.date);

    stats[0].amount = data.total_on_premise;
    stats[1].amount = formatCurrencyNaira(data.total_application_fee);
    stats[2].amount = formatCurrencyNaira(data.total_amount_paid);

    revData.payment_breakdown_daily = data.payment_breakdown_daily;
    revData.payment_breakdown_weekly = data.payment_breakdown_weekly;
    revData.payment_breakdown_monthly = data.payment_breakdown_monthly;
    // data.property_type
    pieData.property_type = {
      labels: Object.keys(data.property_type),
      datasets: [
        {
          label: "Property Type",
          data: Object.values(data.property_type),
          backgroundColor: ["#FF6384", "#36A2EB"],
          cutout: "80%",
        },
      ],
    };
    pieData.product_type = {
      labels: Object.keys(data.product_type),
      datasets: [
        {
          label: "Product Type",
          data: Object.values(data.product_type),
          backgroundColor: getRandomBrightColors(
            Object.keys(data.product_type).length
          ),
          cutout: "80%",
        },
      ],
    };
    pieData.total_property_type = Object.values(data.property_type).reduce(
      (sum, val) => sum + val,
      0
    );
    pieData.total_product_type = Object.values(data.product_type).reduce(
      (sum, val) => sum + val,
      0
    );
    loading.value = false;
  } catch (error) {
    console.error(error);
    toast.error("An Error Occured will fetching Data", {
      position: toast.POSITION.TOP_CENTER,
    });
    loading.value = false;
  }
};

let delayDate = null;
watch(
  () => props.date,
  async () => {
    if (delayDate) {
      clearTimeout(delayDate);
    }

    delayDate = setTimeout(() => {
      getStats();
      // Call the function or perform actions that should happen after the delay
    }, 1500); // Adjust the delay time in milliseconds as needed
  },
  { deep: true }
);

let delayLga = null;
watch(
  () => props.lga,
  async () => {
    if (delayLga) {
      clearTimeout(delayLga);
    }

    delayLga = setTimeout(() => {
      getStats();
      // Call the function or perform actions that should happen after the delay
    }, 1500); // Adjust the delay time in milliseconds as needed
  }
);

onMounted(() => {
  getStats();
});
</script>
<template>
  <IncomeCard :info="filteredStats" />

  <div v-if="props.accessRev" class="mt-6">
    <RevenueGraph :revData="revData" />
  </div>

  <div v-if="!loading" class="flex md:flex-row flex-col my-5 gap-4">
    <PieChart
      :statsHeading="'Property Type'"
      :DoughnutData="pieData.property_type"
      :appTotal="pieData.total_property_type"
    />
    <PieChart
      :statsHeading="'Product Type'"
      :DoughnutData="pieData.product_type"
      :appTotal="pieData.total_product_type"
    />
  </div>
</template>
