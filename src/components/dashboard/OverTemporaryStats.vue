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
  accessRev: Boolean,
});

// Add this to your script setup section
const emit = defineEmits(['loadingChange']);

// Watch the loading state
watch(loading, (newValue) => {
  emit('loadingChange', newValue);
});

const stats = reactive([
  {
    id: 1,
    title: "Temporary Applications",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "application",
  },
  {
    id: 2,
    title: "Total Signs",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "appFee",
  },
  {
    id: 3,
    title: "Total Revenue",
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
    : stats.filter((item) => item.icon !== "revenue");
});

const revData = reactive({
  payment_breakdown_daily: [],
  payment_breakdown_monthly: [],
  payment_breakdown_weekly: [],
});

const pieData = reactive({
  branding_Type: {},
  product_type: {},
  total_branding_apps: 0,
  total_product_type: 0,
});

const getStats = async () => {
  try {
    loading.value = true;
    emit('loadingChange', true);
    const { data } = await axios.get(
      `temporaryadsreport?start_date=${props.date.start_date}&end_date=${props.date.end_date}`
    );
    // console.log(response.data);
    // console.log(props.date);

    stats[0].amount = data.total_temporary_mobile_ads;
    stats[1].amount = data.total_sign_types;
    stats[2].amount = formatCurrencyNaira(data.total_amount_paid);

    revData.payment_breakdown_daily = data.payment_breakdown_daily;
    revData.payment_breakdown_weekly = data.payment_breakdown_weekly;
    revData.payment_breakdown_monthly = data.payment_breakdown_monthly;

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
      :statsHeading="'Product Type'"
      :DoughnutData="pieData.product_type"
      :appTotal="pieData.total_product_type"
    />
  </div>
</template>
