<script setup>
defineProps({
  currentState: String,
  comments: String
})
</script>

<template>
  <span
    v-text="comments"
    class="text-sm text-green-500 block text-wrap w-full break-words"
    :class="{ 'text-red-500': currentState === 'disapproved' || currentState === 'declined' }"
  >
  </span>
</template>
