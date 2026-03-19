<script setup>
import { ref, onMounted } from "vue";

const itemData = ref(null);
const payments = ref([]);
const loading = ref(true);

onMounted(() => {
  const payments_raw = sessionStorage.getItem("lgaPaymentHistory");
  const businessName = sessionStorage.getItem("lgaBusinessName");

  // console.log("payments_raw:", payments_raw); // 👈 debug

  if (payments_raw) {
    payments.value = JSON.parse(payments_raw);
    itemData.value = { business_name: businessName };
    sessionStorage.removeItem("lgaPaymentHistory");
    sessionStorage.removeItem("lgaBusinessName");
  }

  loading.value = false;
});
</script>

<template>
  <div class="p-5">
    <div v-if="loading">Loading transaction history...</div>

    <div v-else-if="payments.length" class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
      <p class="mb-4 text-gray-600">Business: {{ itemData?.business_name }}</p>
      
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 border">Reference</th>
            <th class="p-3 border">Purpose</th>
            <th class="p-3 border">Amount</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pay in payments" :key="pay.id" class="border-b">
            <td class="p-3 border text-sm">{{ pay.reference_id }}</td>
            <td class="p-3 border text-sm">{{ pay.application_purpose }}</td>
            <td class="p-3 border text-sm">₦{{ pay.amount_paid.toLocaleString() }}</td>
            <td class="p-3 border text-sm">
              <span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                {{ pay.status }}
              </span>
            </td>
            <td class="p-3 border text-sm">{{ new Date(pay.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-500">
      No transaction history found for this record.
    </div>
  </div>
</template>