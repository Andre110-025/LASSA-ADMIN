<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
// import OverViewChart from "./OverViewChart.vue";
// import { useModal } from "vue-final-modal";
// import NoList from "./NoList.vue";
import IncomeCard from "./cards/IncomeCard.vue";
import RevenueGraph from "./RevenueGraph.vue";
import PieChart from "./PieChart.vue";
// import OvNewRequestList from "./OvNewRequestList.vue";
// import OvQRScanner from "./OvQRScanner.vue";
// import OvBrandListFirstNThirdParty from "./OvBrandListFirstNThirdParty.vue"
import axios from "axios";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";

const { formatCurrencyNaira } = useHelpers();

const loading = ref(true);

const props = defineProps({
  date: Object,
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
    title: "Mobile Applications",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "application",
  },
  {
    id: 2,
    title: "Vehicle Licenses",
    percentageChange: "+1.20",
    period: "Month",
    amount: 0,
    icon: "license",
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
  vehicle_Type: {},
  total_branding_apps: 0,
  total_vehicle_licenses: 0,
});

const getStats = async () => {
  try {
    loading.value = true;
    emit("loadingChange", true);
    const { data } = await axios.get(
      `mobilepermitreport?start_date=${props.date.start_date}&end_date=${props.date.end_date}`
    );
    // console.log(response.data);
    // console.log(props.date);

    stats[0].amount = data.total_mobile_ads;
    stats[1].amount = data.total_vehicle_licenses;
    stats[2].amount = formatCurrencyNaira(data.total_amount_paid);

    revData.payment_breakdown_daily = data.payment_breakdown_daily;
    revData.payment_breakdown_weekly = data.payment_breakdown_weekly;
    revData.payment_breakdown_monthly = data.payment_breakdown_monthly;
    // data.branding_type
    pieData.branding_Type = {
      labels: Object.keys(data.branding_type),
      datasets: [
        {
          label: "Branding Type",
          data: Object.values(data.branding_type),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          cutout: "80%",
        },
      ],
    };
    pieData.vehicle_Type = {
      labels: Object.keys(data.vehicle_type),
      datasets: [
        {
          label: "Vehicle Type",
          data: Object.values(data.vehicle_type),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#D2691E",
            "#8A2BE2",
            "#00FF7F",
            "#4682B4",
            "#DC143C",
            "#FFD700",
          ],
          cutout: "80%",
        },
      ],
    };
    pieData.total_branding_apps = Object.values(data.branding_type).reduce(
      (sum, val) => sum + val,
      0
    );
    pieData.total_vehicle_licenses = Object.values(data.vehicle_type).reduce(
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
      :statsHeading="'Branding Type'"
      :DoughnutData="pieData.branding_Type"
      :appTotal="pieData.total_branding_apps"
    />
    <PieChart
      :statsHeading="'Vehicle Type'"
      :DoughnutData="pieData.vehicle_Type"
      :appTotal="pieData.total_vehicle_licenses"
    />
  </div>

  <!-- <div class="bg-white p-5 my-5 rounded-xl">
    <h4 class="font-medium mb-5">My Signs</h4>

    <NoList @perform-action="openKyc" />
  </div> -->
</template>
