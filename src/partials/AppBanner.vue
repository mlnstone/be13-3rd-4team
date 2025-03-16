<template>
  <div
    v-show="open"
    class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60"
  ></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const open = ref(true);
</script>
