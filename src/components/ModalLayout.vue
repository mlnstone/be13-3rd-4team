<template>
  <div class="px-6 py-4 text-left modal-content">
    <div class="flex items-center justify-between pb-3">
      <p class="text-2xl font-bold">{{ title }}</p>
    </div>
    <slot></slot>
    <div class="flex justify-end pt-2">
      <button
        @click="close"
        class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Modal Title",
    },
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    close() {
      this.open = false;
      this.$emit("close");
    },
  },
};
</script>
