<template>
  <div
    class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center"
  >
    <div
      class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
    ></div>

    <div
      class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
    >
      <div
        class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close"
      >
        <svg
          class="text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
          />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>
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
