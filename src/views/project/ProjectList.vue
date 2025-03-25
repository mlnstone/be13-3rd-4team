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

    <div class="main-container">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="custom-table">
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

    <!-- <PageNav v-if="postList.value.content.length > 0" :current-page="page.value" -->
      <!-- :items-per-page="parseInt(size.value)" :total-pages="postList.value.totalPages" @set-page="setPage" /> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import PageNav from '@/components/common/PageNav.vue';
import SearchBar from '@/components/common/SearchBar.vue';

const router = useRouter();
const postList = ref({ content: [] });
const postSortOption = ref('LATEST');
const page = ref(1);
const size = ref(10);
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
      page: page.value - 1,
      size: size.value,
    };

    if (searchQuery.value && selectOption.value) {
      params.option = selectOption.value;
      params.keyword = searchQuery.value;
    }

    const response = await apiClient.get('/project', { params });
    postList.value = response.data;
  } catch (error) {
    console.error('오류 발생:', error);
    postList.value = { content: [] };
  }
};

const setPage = (newPage) => {
  page.value = newPage;
  fetchPostList();
};

const handleSearch = (searchParams) => {
  size.value = searchParams.size;
  postSortOption.value = searchParams.postSortOption;
  selectOption.value = searchParams.selectOption;
  searchQuery.value = searchParams.searchQuery;
  page.value = 1;
  fetchPostList();
};

const ditailePage = (no) => {
  router.push(`/project/${no}`);
};

onMounted(fetchPostList);
</script>

<style scoped>
.category-bar {
  display: flex;
  padding: 1rem;
  gap: 1rem;
}

.category-button {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
}

.table-row:hover {
  background-color: #e5e7eb;
}
</style>
