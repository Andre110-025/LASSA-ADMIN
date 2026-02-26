<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import { useHelpers } from "../../helper";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const { timeFormat, formatCurrency } = useHelpers();
const items = ref([]);

const payments = router.options.history.state.payments;
console.log(payments);

const getData = async () => {
  loading.value = true;
  items.value = [];

  try {
    const response = await axios.get("end-point");
    if (response.status === 200) {
      items.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
    <div class="container mx-auto p-2.5">
        <div class="bg-white p-5 mb-5 rounded-xl">
            <h4 class="text-xl mb-5">Transaction History</h4>
        </div>

        <div class="mt-4 p-5 bg-white rounded-lg">
            <div class="w-full" v-if="payments.length && !loading">
                <table class="w-full">
                    <thead>
                        <tr
                            class="border-b-[.0938rem] border-gray-900 bg-slate-50 *:whitespace-nowrap"
                        >
                            <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                                Payment Purpose
                            </th>
                            <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                                Reference Id
                            </th>
                            <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                                Amount
                            </th>
                            <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                                Status
                            </th>
                            <th scope="col" class="text-sm text-gray-700 text-left p-2.5">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                       <tr v-for="(item, index) in payments" :key="index" class="even:bg-slate-50">
                          <td class="p-2.5 text-xs xs:text-sm">{{ item.application_purpose }}</td>
                          <td class="p-2.5 text-xs xs:text-sm">{{ item.reference_id }}</td>
                          <td class="p-2.5 text-xs xs:text-sm">{{ formatCurrency(item.amount_paid) }}</td>
                          <td class="p-2.5 text-xs xs:text-sm">{{ item.status }}</td>
                          <td class="p-2.5 text-xs xs:text-sm">{{ timeFormat(item.created_at) }}</td>
                       </tr>
                    </tbody>
                </table>
            </div>

            <GetData v-else-if="loading"> Getting History </GetData>

            <!-- <NoList :showBtn="false" v-else>
                <template #description> No History </template>
            </NoList> -->
            <p v-else>No History</p>
        </div>
    </div>
</template>