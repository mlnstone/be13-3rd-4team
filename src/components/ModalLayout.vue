<template>
  <div
    class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center"
  >
    <div
      class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
    ></div>

    <div
      class="z-50 mx-auto bg-white rounded shadow-lg modal-container md:max-w-md"
    >
      <div
        class="w-full max-w-sm overflow-hidden bg-white border rounded-md shadow-md"
      >
        <form>
          <div
            class="flex items-center justify-between px-5 py-3 text-gray-700 border-b"
          >
            <h3 class="text-sm">{{ title }}</h3>
            <button @click="close">
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="px-5 py-6 text-gray-700 bg-gray-200 border-b">
            <slot ref="tes2"></slot>
          </div>

          <div class="flex items-center justify-between px-5 py-3">
            <button
              class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
              @click="close"
            >
              Cancel
            </button>
            <button
              class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              @click="test"
            >
              Save
            </button>
          </div>
        </form>
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
    test() {
      this.$refs.tes2.test();
    },
  },
};
</script>
