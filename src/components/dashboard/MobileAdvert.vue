<script setup>
import { ref, reactive, computed } from "vue";
// import { useUserStore } from "../../stores/user";
import IconSpinner from "../icons/IconSpinner.vue";
import { useHelpers } from "../../helper";
import IconUpload from "../icons/IconUpload.vue";
import VehicleType from "./VehicleType.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useModal } from "vue-final-modal";
import SelectUser from "./popups/SelectUser.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

const router = useRouter();

const { lagosLGAs } = useHelpers();

const loading = ref(false);

const selectedBiz = ref(null);

const mobileAdData = reactive({
  user_id: "",
  brand_name: "",
  lga: "",
  start_date: "",
  duration: "Annually",
  applicationForm: {
    vehicleInfo: null,
    vehicle_branding: [
      {
        vehicle_license: null,
        branding_details: "",
        vehicle_type: "",
        excel_file: null,
      },
    ],
  },
});

const rules = computed(() => ({
  user_id: { required },
  brand_name: { required },
  lga: { required },
  start_date: { required },
  duration: { required },
  account_number: { required },
  account_name: { required },
  receipt: { required },
  applicationForm: {
    vehicleInfo: {
      required,
      minLength: minLength(1),
    },
    vehicle_branding: {
      $each: helpers.forEach({
        vehicle_license: {
          minLength: (value, parentVals) => {
            // Apply minLength validation only if excel_file is not filled
            console.log('testing')
            return parentVals.excel_file ? false : minLength(1)(value);
          },
        },
        branding_details: { required },
        vehicle_type: { required },
        excel_file: {
          required: (value, parentVals) => {
            // Make excel_file required if vehicle_license is empty
            return parentVals.vehicle_license.length === 0;
          },
        },
      }),
    },
  },
}));

const v$ = useVuelidate(rules, mobileAdData);

const { open: openSelection, close: closeSelection } = useModal({
  component: SelectUser,
  attrs: {
    onConfirm(info) {
      selectedBiz.value = info.business_name;
      mobileAdData.user_id = info.id;
      closeSelection();
      console.log(info);
    },
  },
  slots: {},
});

const addNewVehicleType = () => {
  mobileAdData.applicationForm.vehicle_branding.push({
    vehicle_license: [],
    branding_details: null,
    vehicle_type: null,
    excel_file: null,
  });
};

const updateSignData = (index, updatedData) => {
  mobileAdData.applicationForm.vehicle_branding[index] = updatedData;
};

const removeSignData = (index) => {
  mobileAdData.applicationForm.vehicle_branding.splice(index, 1);
};

const submitMobileData = async () => {
  loading.value = true;
  try {
    const response = await axios.post("createmobileadsforuser", mobileAdData);
    // console.log(response);
    if (response.status === 200) {
      toast.success("Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      router.push({ name: "RequestList" });
    }
    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);

    loading.value = false;
  }
};

const names = ref([]);

function handleFileUpload(event) {
  const fileList = event.target.files;
  const promises = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const reader = new FileReader();

    promises.push(
      new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            name: file.name,
            base64: { image_montage: reader.result.split(",")[1] },
          });
        };
      })
    );

    reader.readAsDataURL(file);
  }

  Promise.all(promises).then((result) => {
    names.value = result.map((image) => image.name);
    mobileAdData.applicationForm.vehicleInfo = result.map(
      (image) => image.base64
    );
  });
}
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      MOBILE ADVERT APPLICATION <i class="text-red-600">(FIRST-PARTY)</i>
    </h5>

    <form @submit.prevent="submitMobileData" class="max-w-md mx-auto">
      <div class="inputHolder">
        <input
          type="text"
          placeholder="Click to select user"
          class="input placeholder:text-black"
          id="user_id"
          autocomplete="off"
          readonly
          v-model="selectedBiz"
          required
          @click="openSelection"
        />
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="text"
            placeholder=" "
            class="input peer"
            id="brandName"
            autocomplete="off"
            v-model="mobileAdData.brand_name"
            required
          />
          <label for="brandName" class="inputLabel">Name of Brand</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <select
            placeholder=" "
            class="input peer"
            id="signLga"
            v-model="mobileAdData.lga"
            required
          >
            <option
              v-for="(item, index) in lagosLGAs"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>

          <label for="signLga" class="inputLabel">LGA</label>
        </div>
      </div>

      <!-- PhotoMontage -->

      <div class="inputHolder">
        <label for="multipleMontage" v-show="!names.length">
          <span class="block text-sm text-start mb-2.5">
            Upload Vehicle Montages
          </span>
          <div
            class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md"
          >
            <IconUpload class="w-6 h-6" />
            <span class="text-sm mt-2.5"> Click to Select Images </span>
          </div>
        </label>
        <input
          id="multipleMontage"
          type="file"
          accept=".jpg, .jpeg, .png"
          class="hidden"
          name="multipleMontage"
          multiple="true"
          @change="handleFileUpload"
        />
        <div v-show="names.length" class="w-full">
          <span class="block text-sm text-start mb-2.5"> Selected Images </span>
          <ul class="list-disc pl-5">
            <li
              class="text-sm text-start"
              v-for="(name, index) in names"
              :key="index"
              v-text="name"
            ></li>
          </ul>
          <!-- <button
            type="button"
            class="absolute bg-slate-200 rounded-md bottom-5 right-10 w-10 h-10 flex justify-center items-center"
            @click="removeImg"
          >
            <IconDelete />
          </button> -->
        </div>
      </div>

      <h5 class="font-medium px-5 my-5">Vehicle Information</h5>

      <!-- <pre v-text="v$.applicationForm.vehicleInfo.$invalid"></pre>
      <pre v-text="v$.applicationForm.vehicle_branding.$invalid"></pre> -->

      <transition-group tag="ul" name="signs">
        <VehicleType
          v-for="(item, index) in mobileAdData.applicationForm.vehicle_branding"
          :key="index"
          :length="mobileAdData.applicationForm.vehicle_branding.length"
          @updateSignData="updateSignData(index, $event)"
          @deleteSignData="removeSignData(index)"
          :index="index"
        />
      </transition-group>

      <div class="flex justify-between items-center px-5">
        <span class="text-sm font-semibold"
          >Click the plus button to add more sign</span
        >
        <button
          @click="addNewVehicleType"
          type="button"
          class="p-2 border-2 border-mainColor leading-none h-9 w-9"
        >
          +
        </button>
      </div>

      <div class="mt-5 px-5 text-xs text-justify">
        <p>
          By Submitting the form, I declare that I am the duly authorized agent
          or owner of the business/company that has submitted this application
          to erect a sign. I verify that all information provided above are true
          and accurate and understand that false or misleading information
          provided by me in the course of this application will result in the
          automatic disqualification and attract a penalty which I undertake to
          pay. I also undertake to obtain the Agency’s approval before I
          implement any changes to any sign approved by the Agency. I agree to
          notify the Agency of any change in my mailing address, status and/or
          telephone number.
        </p>
      </div>

      <div class="my-5 px-5">
        <button
          :disabled="loading"
          type="submit"
          class="blueBtn w-full mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Submit</span
          >
        </button>
      </div>
    </form>
  </div>
</template>
