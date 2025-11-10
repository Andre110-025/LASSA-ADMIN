<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { ref, reactive, computed } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useVuelidate } from "@vuelidate/core";
import { requiredIf, helpers } from "@vuelidate/validators";
import { useUserStore } from "../../../stores/user";
import DocumentLoader from "../DocumentLoader.vue";

// const { formatCurrency } = useHelpers();
const { userDetails } = useUserStore();

const props = defineProps({
  type: String,
  id: String,
  endPoint: String,
  extraId: Number
});
const emit = defineEmits(["confirm"]);

const loading = ref(false);

const adminData = reactive({
  comment: null,
  reports_from_branchmanger: null,
  siteSubmission: null,
});

const rules = computed(() => ({
  // comment: {
  //   required: helpers.withMessage("Email/phone number is required", required),
  // },
  comment: {
    requiredIfAction: helpers.withMessage(
      "Comment is required",
      requiredIf(props.type === "decline")
    ),
  },
  reports_from_branchmanger: {
    requiredIfAction: helpers.withMessage(
      "Comment is required",
      requiredIf(props.type === "approve")
    ),
  },
}));

const v$ = useVuelidate(rules, adminData);

async function declineApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${props.endPoint}/${props.id}/${props.extraId}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      if (userDetails.userInfo.admin_role_id == 6) {
        toast.success("Application Successfully Disapproved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Application Successfully Returned", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
      emit("confirm", true);
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loading.value = false;
  }
}

async function approveApp() {
  loading.value = true;

  try {
    const response = await axios.post(
      `${props.endPoint}/${props.id}/${props.extraId}`,
      adminData
    );

    // console.log(response);

    if (response.status === 200) {
      if (userDetails.userInfo.admin_role_id == 6) {
        toast.success("Application Successfully Approved", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("recommendation Submitted", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
  }
}
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-fit max-h-dvh max-w-[21.25rem] overflow-y-auto"
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
        <p class="text-center font-semibold mt-5">Enter comment to submit</p>
      </div>

      <form class="py-2.5">
        <div>
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
              v-model="adminData.comment"
              :class="{
                'border-red-600': v$.comment.$error,
              }"
              @blur="v$.comment.$touch"
            ></textarea>
          </div>
          <div class="inputHolder">
            <label class="text-start mb-2.5 text-sm" for="reportComment"
              >Officer Comment</label
            >
            <textarea
              name="reportComment"
              id="reportComment"
              cols="3"
              class="input resize-none"
              required
              v-model="adminData.reports_from_branchmanger"
              :class="{
                'border-red-600': v$.reports_from_branchmanger.$error,
              }"
              @blur="v$.reports_from_branchmanger.$touch"
            ></textarea>
          </div>

          <DocumentLoader
            :label="'reportDoc'"
            @updateEncode="
              (base64Content) => (adminData.siteSubmission = base64Content)
            "
            v-if="endPoint === 'rmapprovedrequest'"
          >
            Upload Report Document(optional)
          </DocumentLoader>
        </div>

        <div class="flex items-center px-4">
          <button
            v-if="type === 'decline'"
            :disabled="v$.$invalid || loading"
            type="submit"
            class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
            @click="declineApp()"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Submit
            </span>
          </button>

          <button
            v-if="type === 'approve'"
            :disabled="v$.$invalid || loading"
            type="submit"
            @click="approveApp()"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Submit
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>