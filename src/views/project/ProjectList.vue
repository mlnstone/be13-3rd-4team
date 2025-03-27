<template>
  <div class="project-wrapper">
    <!-- 상단 카테고리 -->
    <div class="category-bar">
      <router-link to="/teams">
        <button class="category-button" :class="{ active: isActive('/teams') }">팀</button>
      </router-link>
      <router-link to="/projects">
        <button class="category-button" :class="{ active: isActive('/projects') }">프로젝트</button>
      </router-link>
    </div>

    <!-- 검색 바 -->
    <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions"
      @search="handleSearch" />

    <!-- 프로젝트 카드 리스트 -->
    <div class="project-list">
      <div
        v-for="project in paginatedProjects"
        :key="project.no"
        class="project-card"
        @click="goToProjectDetail(project.no)"
      >
        <div class="project-tags">
          <span class="tag" :class="{closed: project.projectStatus === 'CLOSED' }">{{ statusLabels[project.projectStatus] }}</span>
        </div>

        <div class="project-meta">
          <span class="meta-author">{{ project.teamName }}</span>
          <span class="meta-dot">•</span>
          <span class="meta-views">조회 {{ project.view || 0 }}</span>
        </div>
        <div class="project-title">{{ project.name }}</div>
        <div class="project-desc">{{ project.content }}</div>
        <div class="tech-tags">
          <span class="tech-tag" v-for="tech in project.projectTeches" :key="tech">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- 페이징 -->
    <PageNav v-if="projectList && projectList.content && projectList.content.length > 0" :current-page="page"
      :items-per-page="parseInt(size)" :total-pages="projectList.totalPages" @set-page="setPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';
import PageNav from '@/components/common/PageNav.vue';
import SearchBar from '@/components/common/SearchBar.vue';

const router = useRouter();
const route = useRoute();

const page = ref(1);
const size = ref(10);
const projectList = ref({ content: [] });

const postSortOption = ref('LATEST');
const searchQuery = ref('');
const selectOption = ref('');

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

const paginatedProjects = computed(() => projectList.value.content || []);

const fetchProjectList = async () => {
  try {
    const params = {
      sortOption: postSortOption.value,
      page: page.value - 1,
      size: size.value
    };
    if (searchQuery.value && selectOption.value) {
      params.searchOption = selectOption.value;
      params.keyword = searchQuery.value;
    }

    const response = await apiClient.get('/project', { params });
    if (response.status === 200) {
      projectList.value = response.data;
    } else {
      alert('프로젝트 조회 실패');
    }
  } catch (err) {
    console.error('프로젝트 로딩 오류:', err);
  }
};

const statusLabels = {
  OPEN: '모집중',
  CLOSED: '마감',
  IN_PROGRESS: '진행중',
  COMPLETE: '완료',
};

const setPage = (newPage) => {
  page.value = newPage;
  fetchProjectList();
};

const handleSearch = (searchParams) => {
  size.value = searchParams.size;
  postSortOption.value = searchParams.postSortOption;
  selectOption.value = searchParams.selectOption;
  searchQuery.value = searchParams.searchQuery;
  page.value = 1;
  fetchProjectList();
};

const goToProjectDetail = (no) => {
  router.push(`/projects/${no}`);
};


const isActive = (path) => route.path === path;

onMounted(fetchProjectList);
</script>

<style scoped>
.project-wrapper {
  background-color: #f9f9f9;
  color: #333;
  padding: 1.5rem;
  min-height: 100vh;
}

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

/* 프로젝트 카드 리스트 */
.project-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
}

.project-card {
  background-color: #ffffff;
  color: #333;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
}

.project-meta {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.meta-dot {
  margin: 0 0.4rem;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
}

.project-desc {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.project-tags {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.project-tags .tag {
  display: inline-block;
  font-size: 0.75rem;
  background-color: #0077b6;
  color: #ffffff;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
}

.tag.closed {
  background-color: #ff4d4f;
}

.tech-tags {
  margin-bottom: 0.8rem;
}

.tech-tag {
  display: inline-block;
  background-color: #e9f3ff;
  color: #4c6ef5;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 0.75rem;
  margin-right: 0.3rem;
  margin-top: 0.3rem;
  transition: background-color 0.2s ease;
}

.tech-tag:hover {
  background-color: #4c6ef5;
  color: white;
}

</style>
