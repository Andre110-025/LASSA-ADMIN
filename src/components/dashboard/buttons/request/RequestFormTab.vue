<script setup></script>

<template>
  <div
    class="flex flex-col xs:gap-14 2xs:flex-row xs:mt-6 mt-3 gap-4 text-sm xs"
  >
    <div>
      <input
        type="radio"
        name="requestTabRadio"
        class="logInput checked:border-b-2 peer"
        id="tab1"
        checked
      />
      <label
        for="tab1"
        class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-inherit"
      >
        Pre-scrutiny forms
      </label>
    </div>

    <div>
      <input
        type="radio"
        name="requestTabRadio"
        class="logInput peer"
        id="tab2"
      />
      <label
        for="tab2"
        class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-inherit"
      >
        Annexure 2 forms
      </label>
    </div>
  </div>
</template>
