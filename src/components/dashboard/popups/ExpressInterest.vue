<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { ref, reactive, onMounted } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import DocumentLoader from "../DocumentLoader.vue";
import IconConfirmationPopup from "../../icons/IconConfirmationPopup.vue"
import IconDeclinePopup from "../../icons/IconDeclinePopup.vue"

const props = defineProps({
  type: String,
  advertType: String,
  id: String,
  streets: Array,
});
const emit = defineEmits(["confirm"]);

const loading = ref(false);

const streetCat = [
  "Normal Zone N",
  "Restrictive Zone N",
  "High Street N",
  "SPECIAL (N)",
];

const getEndPoint = () => {
  if (props.type === "decline") {
    if (props.advertType === "streetLamp")
      return "declinedexpresionintereststreetlamp";
  } else if (props.type === "approve") {
    if (props.advertType === "streetLamp")
      return "approveExpressionInterestStreetLamp";
  }
};

const adminData = reactive({
  comments: null,
  action: false,
  reports_from_branchmanger: null,
  report_file: null,
  // streetInfo: {
  //   streetdetails: []
  // }
});

async function declineApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${getEndPoint()}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Application Successfully Declined", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
}

async function approveApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${getEndPoint()}/${props.id}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      toast.success("Interest Successfully Approved", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
}

onMounted(() => {
  if (props.type === "approve") {
    console.log("approve");
    adminData.streetInfo = {
      streetdetails: props.streets.map((item) => ({
        id: item.id,
        site_address: item.site_address,
        number_poles: item.number_poles,
        street_category: item.street_category,
      })),
    };
  }
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-full sm:max-h-[31.25rem] max-w-[21.25rem] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <IconDeclinePopup v-if="type === 'decline'" />

        <IconConfirmationPopup v-if="type === 'approve'" />
        <p class="text-center mt-5">
          Are you sure you want<br />to {{ type }} Expression of Interest?
        </p>
      </div>

      <form class="py-2.5">
        <div>
          <ul v-if="props.type === 'approve'">
            <li
              v-for="(item, index) in adminData.streetInfo?.streetdetails"
              :key="index"
            >
              <h6
                class="font-medium text-sm px-5 my-5 flex items-center justify-between"
              >
                <span>Street {{ index + 1 }}</span>
              </h6>
              <div class="inputHolder">
                <input
                  type="text"
                  placeholder=" "
                  class="input peer"
                  :id="'site_address_1' + index"
                  autocomplete="off"
                  v-model="
                    adminData.streetInfo.streetdetails[index].site_address
                  "
                  required
                  disabled
                />
                <label :for="'site_address_1' + index" class="inputLabel"
                  >Street Name</label
                >
              </div>
              <div class="flex flex-col sm:flex-row mt-5">
                <div class="inputHolder my-0 grow">
                  <select
                    placeholder=" "
                    class="input peer"
                    id="street_category"
                    v-model="adminData.streetInfo.streetdetails[index].street_category"
                    required
                  >
                    <option
                      v-for="(item, index) in streetCat"
                      :key="index"
                      :value="item"
                      v-text="item"
                    ></option>
                  </select>

                  <label for="street_category" class="inputLabel">Category</label>
                </div>

                <div class="inputHolder mb-0 sm:my-0 grow">
                  <input
                    type="number"
                    placeholder=" "
                    class="input peer"
                    :id="'number_poles_site_1' + index"
                    autocomplete="off"
                    v-model="
                      adminData.streetInfo.streetdetails[index].number_poles
                    "
                    required
                  />
                  <label
                    :for="'number_poles_site_1' + index"
                    class="inputLabel"
                    >Number of Pole(s)</label
                  >
                </div>
              </div>
            </li>
          </ul>

          <div class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="clientComment"
              >Comment to Client</label
            >
            <textarea
              name="clientComment"
              id="clientComment"
              cols="3"
              class="input resize-none"
              required
              v-model="adminData.comments"
            ></textarea>
          </div>

          <div class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="reportComment"
              >Officer Comment</label
            >
            <textarea
              name="declineComment"
              id="declineComment"
              cols="3"
              class="input resize-none"
              required
              v-model="adminData.reports_from_branchmanger"
            ></textarea>
          </div>

          <DocumentLoader
            :label="'reportDoc'"
            @updateEncode="(base64Content) => (adminData.report_file = base64Content)"
          >
            Upload Report Document(optional)
          </DocumentLoader>
        </div>

        <div class="flex items-center px-4">
          <button
            v-if="type === 'decline'"
            :disabled="loading"
            type="submit"
            class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
            @click="declineApp()"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Decline Interest
            </span>
          </button>

          <button
            v-if="type === 'approve'"
            :disabled="loading"
            type="submit"
            @click="approveApp()"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Approve Interest
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
