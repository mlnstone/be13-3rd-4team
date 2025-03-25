<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" @click="prevPage">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="page in totalPages" :key="page" @click="() => setPage(page)">
        <a class="page-link" :class="{ active: currentPage.valueOf === page }" href="#">
          {{ page }}
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" @click="nextPage">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
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
