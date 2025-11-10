<script setup>
import { ref, reactive } from "vue";
import { useHelpers } from "./../../helper";
import IconSpinner from "./../icons/IconSpinner.vue";
import SignType from "./SignType.vue";
// import PayAdvertDialog from "./popups/PayAdvertApplication.vue";
import { useModal } from "vue-final-modal";
import axios from "axios";
import { toast } from "vue3-toastify";
import SelectUser from "./popups/SelectUser.vue"

const appInfo = ref(null);
const selectedBiz = ref(null);

const { lagosLGAs } = useHelpers();

const loading = ref(false);

// const applicationPurposes = [
//   "Application for New Sign",
//   "Redesigning of unapproved sign",
//   "Change of sign/size",
//   "Additional sign",
//   "Relocation of sign/business",
// ];

const addNewSign = () => {
  outDoorData.onpremiseform.onpremiseinfo.push({
    type_of_sign: null,
    number_of_sign: null,
    length_in_meter: null,
    width_in_meter: null,
    product_on_sign: null,
    photo_montage: null,
  });
};

const propertyTypes = ["Single Business Unit", "Multi-tenanted Business"];

const outDoorData = reactive({
  user_id: null,
  purpose: "Application for New Sign",
  sign_address: null,
  lga: null,
  property_type: null,
  name_of_owner: null,
  phone_number: null,
  email: null,
  onpremiseform: {
    onpremiseinfo: [
      {
        type_of_sign: null,
        number_of_sign: 1,
        length_in_meter: null,
        width_in_meter: null,
        product_on_sign: null,
        photo_montage: null,
      },
    ],
  },
});

const { open: openSelection, close: closeSelection } = useModal({
  component: SelectUser,
  attrs: {
    onConfirm(info) {
      selectedBiz.value = info.business_name
      outDoorData.user_id = info.id;
      closeSelection();
      console.log(info);
    }
  },
  slots: {},
});

const updateSignData = (index, updatedData) => {
  outDoorData.onpremiseform.onpremiseinfo[index] = updatedData;
};

const removeSignData = (index) => {
  outDoorData.onpremiseform.onpremiseinfo.splice(index, 1);
};

const submitPremiseData = async () => {
  loading.value = true;
  try {
    const response = await axios.post("createonpremiseforuser", outDoorData);
    // console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application Saved", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
  } catch (error) {

    if (error.response.data.errors?.length >= 1) {
      toast.error('Ensure Required Field is Filled', {
        position: toast.POSITION.TOP_CENTER,
      });
    }else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      OUTDOOR ADVERTISING STRUCTURE APPLICATION
      <i class="text-red-600">(FIRST PARTY)</i>
    </h5>

    <form @submit.prevent="submitPremiseData" class="max-w-md mx-auto">
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
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="signAddress"
          v-model="outDoorData.sign_address"
          required
        />
        <label for="signAddress" class="inputLabel">Sign Address</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="signLga"
          v-model="outDoorData.lga"
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

      <!-- Property Details -->
      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="propertyType"
          v-model="outDoorData.property_type"
          required
        >
          <option
            v-for="(item, index) in propertyTypes"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label for="propertyType" class="inputLabel">Property Type</label>
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="propertyOwner"
          v-model="outDoorData.name_of_owner"
        />
        <label for="propertyOwner" class="inputLabel"
          >Name of Property Owner</label
        >
      </div>

      <div class="inputHolder">
        <input
          type="tel"
          placeholder=" "
          class="input peer"
          id="propertyOwnerPhone"
          v-model="outDoorData.phone_number"
          required
        />
        <label for="propertyOwnerPhone" class="inputLabel"
          >Property Owner Phone</label
        >
      </div>

      <div class="inputHolder">
        <input
          type="email"
          placeholder=" "
          class="input peer"
          id="propertyOwnerMail"
          v-model="outDoorData.email"
        />
        <label for="propertyOwnerMail" class="inputLabel"
          >Property Owner Email(optional)</label
        >
      </div>

      <!-- Signage -->

      <transition-group tag="ul" name="signs">
        <SignType
          v-for="(item, index) in outDoorData.onpremiseform.onpremiseinfo"
          :key="index"
          :signData="item"
          :length="outDoorData.onpremiseform.onpremiseinfo.length"
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
          @click="addNewSign"
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
          @click="submitPremiseData"
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
