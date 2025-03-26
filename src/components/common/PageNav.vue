<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center" v-if="totalPages > 1">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" aria-label="Previous" @click="prevPage">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click="() => setPage(page)">
          {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" aria-label="Next" @click="nextPage">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';

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

  // 표시할 페이지 번호 계산
const visiblePages = computed(() => {
  const maxVisiblePages = 5; // 최대 표시 페이지 수
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage.value - halfVisible);
  let end = Math.min(props.totalPages, currentPage.value + halfVisible);

  // 페이지가 적을 때 시작과 끝 조정
  if (end - start < maxVisiblePages - 1) {
    if (start === 1) {
      end = Math.min(props.totalPages, maxVisiblePages);
    } else {
      start = Math.max(1, props.totalPages - maxVisiblePages + 1);
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
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
