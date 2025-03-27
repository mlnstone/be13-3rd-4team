<template>
  <div class="team-wrapper">
    <!-- 상단 카테고리 바 -->
    <div class="category-bar-wrapper">
      <div class="category-bar">
        <router-link to="/teams">
          <button class="category-button" :class="{ active: isActive('/teams') }">팀</button>
        </router-link>
        <router-link to="/projects">
          <button class="category-button" :class="{ active: isActive('/projects') }">프로젝트</button>
        </router-link>
      </div>
      <div class="category-action">
        <router-link to="/teams/add">
          <button class="category-button" :class="{ active: isActive('/teams/write') }">팀 생성</button>
        </router-link>
      </div>
    </div>



    <!-- 검색 필터 -->
    <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions"
      @search="handleSearch" />

    <br>

    <!-- 팀 리스트 -->
    <div class="team-list">
      <div v-for="post in paginatedPosts" :key="post.no" class="team-item" @click="detailPage(post.no)">
        <div class="team-meta">
          <span class="meta-author">{{ post.team.teamName }}</span>
          <span class="meta-dot">•</span>
          <span class="meta-views">조회 {{ post.view || 0 }}</span>
        </div>
        <div class="team-title">{{ post.team.teamName }}</div>
        <div class="team-desc">{{ post.team.teamIntroduce }}</div>
        <div class="team-tags">
          <span class="tag" :class="{ closed: post.team.projectStatus === 'CLOSED' }">{{ getStatusText(post.team.projectStatus) }}</span>
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
import PageNav from '@/components/common/PageNav.vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import SearchBar from '@/components/common/SearchBar.vue';

const router = useRouter();
const route = useRoute();
const isActive = (path) => route.path.startsWith(path);

const postList = ref({ content: [] });
const page = ref(1);
const size = ref(10);
const searchQuery = ref('');
const selectOption = ref('');
const postSortOption = ref('LATEST');

const sizeOptions = ref([10, 20, 30]);
const postSortOptions = ref([
  { value: 'LATEST', label: '최신순' },
]);
const selectOptions = ref([
  { value: '', label: '전체' },
  { value: 'teamName', label: '제목' },
  { value: 'teamIntroduce', label: '설명' },
  { value: 'projectStatus', label: '상태' }
]);

const paginatedPosts = computed(() => postList.value.content || []);

const fetchPostList = async () => {
  try {
    const params = {
      page: page.value - 1,
      size: size.value
    };
    
    if (searchQuery.value && selectOption.value) {
      params[selectOption.value] = searchQuery.value;
    }

    const response = await apiClient.get('/team', { params });
    postList.value = response.data;
    console.log(postList.value)
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생', error);
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


const detailPage = (no) => {
  router.push(`/teams/${no}`);
};

const getStatusText = (status) => {
  switch (status) {
    case 'OPEN':
      return '모집중';
    case 'CLOSED':
      return '마감';
    default:
      return status; // 알 수 없는 상태는 그대로 표시
  }
};

onMounted(fetchPostList);
</script>

<style scoped>
.team-wrapper {
  background-color: #f9f9f9;
  color: #333;
  padding: 1.5rem;
  min-height: 100vh;
}

.category-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-bar {
  display: flex;
  gap: 10px; /* 버튼 간격 조절 */
}

.category-action {
  /* 필요 시 마진이나 패딩 조정 가능 */
}


/* 카테고리 바 */
.category-bar {
  display: flex;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  background-color: #f9f9f9;
}

.category-button {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button:hover {
  background-color: #e9f3f9;
  border-color: #0077b6;
  color: #0077b6;
}

.category-button.active {
  background-color: #0077b6;
  color: white;
  border: 1px solid #0077b6;
}

.page-size label {
  font-size: 0.85rem;
  margin-right: 0.5rem;
}

.page-size select {
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  border-radius: 0.3rem;
  border: 1px solid #ccc;
}

/* 팀 리스트 */
.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-item {
  background-color: #ffffff;
  padding: 1.2rem;
  border-radius: 0.6rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.team-item:hover {
  background-color: #eef6fb;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

/* 기타 */
.team-meta {
  font-size: 0.75rem;
  color: #888888;
  margin-bottom: 0.4rem;
}

.meta-dot {
  margin: 0 0.4rem;
}

.team-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 0.4rem;
}

.team-desc {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.team-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background-color: #0077b6;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  color: white;
}
.tag.closed {
  background-color: #e53935; /* 빨간색 배경 */
}
</style>
