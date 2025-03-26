<template>
  <div>
    <div class="category-bar">
      <button class="category-button" @click="teamPage()">팀 페이지로</button>
      <button class="category-button" @click="writePage()">스케줄 추가</button>
      <button class="category-button" @click="memberPage()">팀원 목록</button>
    </div>

    <SearchBar :size-options="sizeOptions" :searchFalse="true" @search="handleSearch" />

    <div class="main-container">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead class="table-header">
              <tr>
                <th class="header-cell">번호</th>
                <th class="header-cell">일정명</th>
                <th class="header-cell">작성자</th>
                <th class="header-cell">상태</th>
                <th class="header-cell">시작시간</th>
                <th class="header-cell">마감시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in paginatedPosts" :key="post.scheduleNo" @click="detailePage(post.scheduleNo)"
                class="table-row">
                <td class="body-cell">{{ post.scheduleNo }}</td>
                <td class="body-cell">{{ post.title }}</td>
                <td class="body-cell">{{ post.createdBy }}</td>
                <td class="body-cell">{{ getStatusText(post.status) }}</td>
                <td class="body-cell">{{ formatDate(post.startDate)}}</td>
                <td class="body-cell">{{ formatDate(post.endDate)}}</td>
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
import dayjs from "dayjs";

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

const memberPage = () => {
  router.push({
    name: 'TeamMembers',
    params: { teamNo }
  });
};

const teamPage = () => {
  router.push({
    name: 'teams/no',
    params: { no: teamNo }
  });
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return '시작 전';
    case 'IN_PROGRESS':
      return '진행 중';
    case 'COMPLETED':
      return '완료됨';
    default:
      return status; // 알 수 없는 상태는 그대로 표시
  }
};

onMounted(fetchPostList);

watch(() => route.path, fetchPostList);

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD');
};
</script>

<style scoped>
.category-bar {

  display: flex;
  padding: 1rem;
  gap: 1rem;
  overflow-x: auto;
}

.category-button {
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-transform: capitalize;
  color: white;
  background-color: #0077b6;
  /* 적용된 색상 */
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.category-button:hover {
  background-color: #005fa3;
  /* 조금 더 어두운 음영 */
}

.select-box {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #0077b6;
  /* 테두리에 색상 적용 */
  border-radius: 0.375rem;
  background-color: white;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.5rem;
  border: 1px solid #0077b6;
  /* 테두리에 색상 적용 */
  border-radius: 0.375rem;
}

.main-container {
  margin-top: 1rem;
}

.table-container {
  margin-top: 1.5rem;
}

.table-wrapper {
  margin: 1.5rem 0;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 0.375rem;
  /* rounded-md */
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  /* shadow */
}

.custom-table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.table-header {
  border-bottom: 1px solid #0077b6;
  /* 테두리에 색상 적용 */
}

.width-350 {
  width: 350px;
  text-align: left;
}

.width-80 {
  width: 80px;
}

.header-cell {
  padding: 0.75rem 1.25rem;
  /* px-5 py-3 */
  font-size: 0.875rem;
  /* text-sm */
  font-weight: 500;
  /* font-medium */
  text-transform: uppercase;
  color: white;
  background-color: #0077b6;
  /* 적용된 색상 */
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.table-row:hover {
  background-color: #e0f3ff;
  /* 연한 파랑 음영 */
}

.body-cell {
  padding: 1rem 1.5rem;
  /* px-6 py-4 */
  font-size: 1.125rem;
  /* text-lg */
  color: #353535;
  /* 텍스트에 색상 적용 */
  border-bottom: 1px solid #0077b6;
  /* 테두리에 색상 적용 */
}

.body-cell:first-child {
  font-weight: 500;
  /* 강조를 위해 font 추가 */
  color: #353535;
  /* 어두운 음영 */
}

.body-cell:hover {
  color: #353535;
  /* 텍스트에 어두운 음영 적용 */
}
</style>
