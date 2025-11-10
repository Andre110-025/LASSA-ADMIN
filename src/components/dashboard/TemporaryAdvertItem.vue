<script setup>
import { reactive, ref, watch } from "vue";
import IconDelete from "../icons/IconDelete.vue";
import IconSpinner from "../icons/IconSpinner.vue"
import PhotoLoader from "./PhotoLoader.vue";
import DocumentLoader from "./DocumentLoader.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  item: Object,
  index: Number,
  editable: Boolean,
});

const emit = defineEmits(['getUpdate']);

const edit = ref(false);
const loading = ref(false);

const classifications = ["movable signs", "other temporary signs"];

const signType = [
  "moveable sign",
  "gazebos",
  "water advertisement",
  "posters",
  "flags",
  "branded t-shirt",
  "feather sign",
  "cart/trolley/stand",
  "banners",
  "inflatable",
  "wall drape",
  "other",
];

const singleTypeData = reactive({
  classificationSign: props.item.class_signs,
  typeSign: props.item.type_sign,
  size: props.item.size_ads,
  dimension: props.item.dimension_ads,
  photo: props.item.photo_montage,
  transitSign: props.item.transit_sign,
  vehicleLicense: props.item.vehicle_license, //file
  wearableSign: props.item.wearable_sign,
  amountWearable: props.item.number_wearable,
  moveableAnimation: props.item.moveable_animation,
  trafficStatement: props.item.traffic_statement, //file
});

const checkType = () => {
  if (singleTypeData.classificationSign !== "movable signs") {
    singleTypeData.transitSign = false;
    singleTypeData.vehicleLicense = null;
    singleTypeData.moveableAnimation = false;
    singleTypeData.trafficStatement = null;
  }
};

const submitTemporaryEdit = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(`edittemporarydetails/${props.item.first_party_temporary_ads_id}/${props.item.id}`, singleTypeData);
    console.log(data);
    if (data.success) {

      edit.value = false;
      toast.success("Update has been saved", {
        position: toast.POSITION.TOP_CENTER,
      });
      emit('getUpdate');
    }
    loading.value = false;
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.status == 500) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.data.errors.length) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Application Could not be Scored", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <li class="">
    <h6 class="font-medium text-sm mb-5">
      Temporary Advert Type {{ props.index + 1 }}
    </h6>

    <div class="flex flex-col gap-4" v-if="!edit">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm capitalize" v-text="item.type_sign"></p>
      </div>

      <div v-if="item.class_signs" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Classification</p>
        <p class="text-sm capitalize" v-text="item.class_signs"></p>
      </div>

      <div v-if="item.size_ads" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Size</p>
        <p class="text-sm" v-text="item.size_ads"></p>
      </div>

      <div v-if="item.dimension_ads" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Dimension(Square Meter)</p>
        <p class="text-sm" v-text="item.dimension_ads"></p>
      </div>

      <div v-if="item.number_of_days" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Days</p>
        <p class="text-sm" v-text="item.number_of_days"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of sign/Wearable</p>
        <p class="text-sm" v-text="item.number_wearable"></p>
      </div>

      <div v-if="item.days_in_duration" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Selected Days</p>
        <p class="text-sm" v-text="item.days_in_duration"></p>
      </div>

      <div v-if="item.days_in_duration" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Vehicle License Plate</p>
        <p class="text-sm" v-text="item.license_number"></p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
      </div>

      <div class="flex flex-col gap-2" v-if="item.vehicle_license">
        <p class="w-2/5 text-sm font-semibold">Vehicle License</p>
        <img :src="item.vehicle_license" alt="" class="w-full bg-gray-600" />
      </div>

      <div class="flex flex-col gap-2" v-if="item.traffic_statement">
        <p class="w-2/5 text-sm font-semibold">Traffic Statement</p>
        <embed
          :src="item.traffic_statement"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <!-- <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="edit = true"
        v-if="editable"
      >
        Edit Application
      </button> -->
    </div>

    <form v-else @submit.prevent="submitTemporaryEdit">
      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer capitalize"
          :id="'typeSign' + index"
          v-model="singleTypeData.typeSign"
          required
        >
          <option
            v-for="(item, index) in signType"
            class="capitalize"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label :for="'typeSign' + index" class="inputLabel">Type of Sign</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer capitalize"
          :id="'classificationSign' + index"
          v-model="singleTypeData.classificationSign"
          required
          @change="checkType()"
        >
          <option
            v-for="(item, index) in classifications"
            class="capitalize"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label :for="'classificationSign' + index" class="inputLabel"
          >Classification of Sign</label
        >
      </div>

      <div class="inputHolder">
        <input
          placeholder=" "
          class="input peer"
          :id="'size' + props.index"
          v-model="singleTypeData.size"
          required
        />
        <label :for="'size' + props.index" class="inputLabel"
          >Sign Size (Square meter)</label
        >
      </div>

      <div class="inputHolder">
        <input
          placeholder=" "
          class="input peer"
          :id="'dimension' + props.index"
          v-model="singleTypeData.dimension"
          required
        />
        <label :for="'dimension' + props.index" class="inputLabel"
          >Sign Dimension (l x b in meter)</label
        >
      </div>

      <PhotoLoader
        :label="'Photomontage' + index"
        @update:photoEncode="
          (base64Content) => (singleTypeData.photo = base64Content)
        "
      >
        Upload Photomontage
      </PhotoLoader>

      <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
        <label :for="'wearableSign' + props.index"
          >Are you Using Branded Clothes/Wears</label
        >
        <input
          type="checkbox"
          :id="'wearableSign' + props.index"
          v-model="singleTypeData.wearableSign"
        />
      </div>

      <div class="inputHolder">
        <input
          placeholder=" "
          class="input peer"
          :id="'amountWearable' + props.index"
          type="number"
          step="1"
          v-model="singleTypeData.amountWearable"
          required
        />
        <label :for="'amountWearable' + props.index" class="inputLabel"
          >Amount of Wearables</label
        >
      </div>

      <div v-if="singleTypeData.classificationSign === 'movable signs'">
        <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
          <label :for="'transitSign' + props.index"
            >Are you Using Branded Vehicle</label
          >
          <input
            type="checkbox"
            :id="'transitSign' + props.index"
            v-model="singleTypeData.transitSign"
          />
        </div>

        <PhotoLoader
          :label="'vehicleLicense' + index"
          @update:photoEncode="
            (base64Content) =>
              (temporaryData.temporaryDetails.temporaryInfo[
                index
              ].vehicleLicense = base64Content)
          "
          v-if="singleTypeData.transitSign"
        >
          Upload license Image
        </PhotoLoader>

        <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
          <label :for="'transitSign' + props.index"
            >SIgn has movable part animation</label
          >
          <input
            type="checkbox"
            :id="'vehicleLicense' + props.index"
            v-model="singleTypeData.moveableAnimation"
          />
        </div>

        <DocumentLoader
          v-if="singleTypeData.moveableAnimation"
          :label="'trafficStatement' + index"
          @update:fileEncode="
            (base64Content) =>
              (temporaryData.temporaryDetails.temporaryInfo[
                index
              ].trafficStatement = base64Content)
          "
        >
          Upload Traffic Statement
        </DocumentLoader>
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
  </li>
</template>
