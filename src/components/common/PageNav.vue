<template>
  <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
    <div class="flex mr-4 rounded">
      <a href="#" @click="prevPage"
        class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white">
        <span>Previous</span>
      </a>
      <a v-for="page in totalPages" :key="page" @click="() => setPage(page)"
        :class="page === currentPage.value ? 'bg-indigo-500 text-white' : 'text-indigo-700'"
        class="px-3 py-2 leading-tight bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white">
        <span>{{ page }}</span>
      </a>
      <a href="#" @click="nextPage"
        class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white">
        <span>Next</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  itemsPerPage: { type: Number, default: 10 },
  totalPages: { type: Number, required: true }
});

const emit = defineEmits(['set-page']);

const currentPage = ref(props.currentPage);

const setPage = (page) => {
  currentPage.value = page;
  emit('set-page', page);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    setPage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < props.totalPages) {
    setPage(currentPage.value + 1);
  }
};
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.bg-white {
  background-color: white;
}

.border-t {
  border-top-width: 1px;
}

.rounded {
  border-radius: 0.25rem;
}

.hover\:bg-indigo-500:hover {
  background-color: #818cf8;
}

.hover\:text-white:hover {
  color: white;
}

.bg-indigo-500 {
  background-color: #818cf8;
}

.text-white {
  color: white;
}

.text-indigo-700 {
  color: #4f46e5;
}
</style>
