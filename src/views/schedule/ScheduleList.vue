<template>
  <div>
    <div class="category-bar">
      <button class="category-button" @click="writePage()">스케줄 추가</button>
    </div>

    <SearchBar :size-options="sizeOptions" :searchFalse="true" @search="handleSearch" />

    <div class="main-container">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead class="table-header">
              <tr>
                <th>번호</th>
                <th>일정명</th>
                <th>담당자</th>
                <th>상태</th>
                <th>시작시간</th>
                <th>마감시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in paginatedPosts" :key="post.scheduleNo" @click="detailePage(post.scheduleNo)"
                class="table-row">
                <td>{{ post.scheduleNo }}</td>
                <td>{{ post.title }}</td>
                <td>{{ post.createdBy }}</td>
                <td>{{ post.status }}</td>
                <td>{{ new Date(post.startDate).toLocaleDateString() }}</td>
                <td>{{ new Date(post.endDate).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 페이징 -->
    <PageNav v-if="postList && postList.content && postList.content.length > 0" :current-page="page"
      :items-per-page="parseInt(size)" :total-pages="postList.totalPages" @set-page="setPage" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';
import SearchBar from '@/components/common/SearchBar.vue';
import PageNav from '@/components/common/PageNav.vue';
import ScheduleWrite from './ScheduleWrite.vue';

// 초기 페이지 설정
const page = ref(1);
const size = ref(10);

const postList = ref({ content: [] });
const scheduleSortOption = ref("");

const sizeOptions = ref([10, 20, 30]);
const paginatedPosts = computed(() => postList.value.content || []);

const route = useRoute();
const router = useRouter();
const teamNo = route.params.teamNo;
const authStore = useAuthStore();

const fetchPostList = async () => {
  try {
    const response = await apiClient.get(`/schedules/team/${teamNo}`, {
      params: {
        scheduleSortOption: scheduleSortOption.value,
        page: page.value - 1,
        size: size.value
      },
    });

    if (response.status === 200) {
      postList.value = response.data;
    }
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
    postList.value = { content: [] };
    page.value = 1;
  }
};

const setPage = (newPage) => {
  page.value = newPage;
  fetchPostList();
};

const handleSearch = (searchParams) => {
  scheduleSortOption.value = searchParams.scheduleSortOption;
  size.value = searchParams.size;
  page.value = 1;
  fetchPostList();
};

const detailePage = (scheduleNo) => {
  router.push({
    name: 'ScheduleDetail',
    params: { teamNo, scheduleNo }
  });
};

const writePage = () => {
  router.push({
    name: 'ScheduleWrite',
    params: { teamNo }
  });
};

onMounted(fetchPostList);

watch(() => route.path, fetchPostList);
</script>

<style scoped>
.category-bar {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  overflow-x: auto;
}

.category-button {
  padding: 0.5rem 1rem;
  font-weight: 500;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #e5e7eb;
}
</style>
