<script setup>
import { VueFinalModal } from "vue-final-modal";
import { useUserStore } from "../../../stores/user";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import FormAccountScore from "../FormAccountScore.vue";
import FormLegalScore from "../FormLegalScore.vue";
import FormRegistryScore from "../FormRegistryScore.vue";

const { userDetails } = useUserStore();
defineProps({
  id: String,
});

const emit = defineEmits(["confirm"]);
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
        <p class="text-center mt-5">Score Application</p>
      </div>

      <FormAccountScore v-if="userDetails.userInfo.admin_role_id == 8" :id="id" @completed="emit('confirm', true)" />
      <FormLegalScore v-if="userDetails.userInfo.admin_role_id == 9" :id="id" @completed="emit('confirm', true)" />
      <FormRegistryScore v-if="userDetails.userInfo.admin_role_id  == 2 || userDetails.userInfo.admin_role_id  == 3" :id="id" @completed="emit('confirm', true)" />
    </div>
  </VueFinalModal>
</template>
