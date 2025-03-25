<template>
  <div>
    <div class="category-bar">
      <router-link to="/teams">
        <button class="category-button">팀</button>
      </router-link>
      <router-link to="/projects">
        <button class="category-button">프로젝트</button>
      </router-link>
      <router-link to="/projects/write">
        <button class="category-button">팀 생성</button>
      </router-link>
    </div>

    <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions"
      @search="handleSearch" />

    <!-- 테이블 -->
    <div class="main-container">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="custom-table">
            <!-- 제목 -->
            <thead class="table-header">
              <tr>
                <th>번호</th>
                <th>프로젝트</th>
                <th>팀</th>
                <th>간단 소개</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in paginatedPosts" :key="post.no" @click="ditailePage(post.no)" class="table-row">
                <td>{{ post.no }}</td>
                <td>{{ post.name }}</td>
                <td>{{ post.teamName }}</td>
                <td>{{ post.content }}</td>
                <td>{{ post.projectStatus }}</td>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import PageNav from "@/components/common/PageNav.vue";
import SearchBar from '@/components/common/SearchBar.vue';

const route = useRoute();
const router = useRouter();

// 초기 페이지 설정
const page = ref(1);
const size = ref(10);

const postList = ref({ content: [] });
const postSortOption = ref('LATEST');
const searchQuery = ref("");
const selectOption = ref("");

const sizeOptions = ref([10, 20, 30]);
const postSortOptions = ref([
  { value: 'LATEST', label: '최신순' },
  { value: 'VIEW', label: '조회수' }
]);
const selectOptions = ref([
  { value: '', label: '전체' },
  { value: 'NAME', label: '프로젝트 명' },
  { value: 'CONTENT', label: '간단 소개' },
  { value: 'PROJECT_TECHS', label: '기술명' }
]);

const paginatedPosts = computed(() => postList.value.content || []);

const fetchPostList = async () => {
  try {
    const params = {
      projectSortOption: postSortOption.value,
      page: page.value - 1, // 현재 페이지 번호 -1 (0 기반 인덱스)
      size: size.value,
    };

    if (searchQuery.value && selectOption.value) {
      params.option = selectOption.value;
      params.keyword = searchQuery.value;
    }

    const response = await apiClient.get('/project', { params });
    if (response.status === 200) {
          postList.value = response.data;
      } else {
          alert('데이터 조회 실패');
      }
  } catch (error) {
    console.error('오류 발생:', error);
    postList.value = { content: [] };
    page.value = 1;
  }
};

const setPage = (pages) => {
      page.value = pages; // 부모 컴포넌트에서 페이지 업데이트
      fetchPostList();
  };

const handleSearch = (searchParams) => {
  size.value = searchParams.size;
  postSortOption.value = searchParams.postSortOption;
  selectOption.value = searchParams.selectOption;
  searchQuery.value = searchParams.searchQuery;
  page.value = 1; // 검색 시 페이지 초기화
  fetchPostList();
};

const ditailePage = (projectNo) => {
  router.push(`/projects/${projectNo}`);
};

onMounted(() => {
  fetchPostList();
});
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
  text-transform: capitalize;
  color: white;
  background-color: #4f46e5;
  /* indigo-600 */
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.category-button:hover {
  background-color: #4338ca;
  /* indigo-500 */
}

.select-box {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e0;
  /* gray-400 */
  border-radius: 0.375rem;
  background-color: white;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.5rem;
  border: 1px solid #cbd5e0;
  /* gray-400 */
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
  border-bottom: 1px solid #e5e7eb;
  /* border-b */
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
  color: #f3f4f6;
  /* text-gray-100 */
  background-color: #4f46e5;
  /* indigo-800 */
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.table-row:hover {
  background-color: #e5e7eb;
  /* hover:bg-gray-200 */
}

.body-cell {
  padding: 1rem 1.5rem;
  /* px-6 py-4 */
  font-size: 1.125rem;
  /* text-lg */
  color: #6b7280;
  /* text-gray-500 */
  border-bottom: 1px solid #e5e7eb;
  /* border-b */
}

.body-cell:first-child {
  font-weight: 500;
  /* 강조를 위해 font 추가 */
}

.body-cell:hover {
  color: #374151;
  /* text-gray-700 */
}
</style>