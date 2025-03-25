<template>
  <div>
      <!-- 분류바 -->
      <div class="category-bar">
          <button @click="changeBoardType('NOTICE')" class="category-button">공지</button>
          <button @click="changeBoardType('PROJECT_RECRUIT')" class="category-button">프로젝트</button>
          <button @click="changeBoardType('FREE')" class="category-button">자유</button>
          <router-link to="/posts/add">
          <button class="category-button">글 작성</button>
          </router-link>
      </div>
  
      <!-- 검색바 -->
      <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions" @search="handleSearch" />
  
      <!-- 테이블 -->
      <div class="main-container">
          <div class="table-container">
          <div class="table-wrapper">
              <table class="custom-table">
              <!-- 제목 -->
              <thead class="table-header">
                  <tr>
                  <th class="header-cell width-80">번호</th>
                  <th class="header-cell width-350">제목</th>
                  <th class="header-cell">글쓴이</th>
                  <th class="header-cell">작성일</th>
                  </tr>
              </thead>
              <!-- 내용 -->
              <tbody>
                  <tr v-for="post in paginatedPosts" :key="post.postNo" @click="detailPage(post.postNo)" class="table-row">
                  <td class="body-cell">{{ post.postNo }}</td>
                  <td class="body-cell">{{ post.title }}</td>
                  <td class="body-cell">{{ post.userName }}</td>
                  <td class="body-cell">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>
      </div>
  
      <!-- 페이징 -->
      <Pagination
          v-if="postList?.content?.length > 0 && postList.totalElements > parseInt(size)"
          :pageInfo="pageInfo"
          @change-page="setPage"
      />
      </div>
  </template>
  
<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/api';
  import Pagination from '@/components/common/Pagination.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  
  const route = useRoute();
  const router = useRouter();
  
  const size = ref(10);
  const postList = ref([]);
  const boardType = ref('FREE');
  const postSortOption = ref('LATEST');
  const searchQuery = ref('');
  const selectOption = ref('');
  const pageInfo = ref({
      currentPage: parseInt(route.query.page) || 1,
      totalCount: 0,
      pageLimit: 10,
      listLimit: 10,
  });
  
  const sizeOptions = ref([10, 20, 30]);
  const postSortOptions = ref([
      { value: 'LATEST', label: '최신순' },
      { value: 'BOOKMARK', label: '북마크' },
      { value: 'VIEW', label: '조회수' },
      { value: 'COMMENT', label: '댓글' },
  ]);
  const selectOptions = ref([
      { value: '', label: '전체' },
      { value: 'TITLE', label: '제목' },
      { value: 'CONTENT', label: '내용' },
      { value: 'USERNAME', label: '유저이름' },
  ]);
  
  const paginatedPosts = computed(() => postList.value.content || []);
  
  const fetchPostList = async () => {
      const params = {
          boardType: boardType.value,
          postSortOption: postSortOption.value,
          page: pageInfo.value.currentPage - 1,
          size: size.value,
      };
  
      if (searchQuery.value && selectOption.value) {
          params.option = selectOption.value;
          params.keyword = searchQuery.value;
      }
  
      try {
          const response = await apiClient.get('/posts', { params });
      if (response.status === 200) {
          postList.value = response.data;
          pageInfo.value.totalCount = response.data.totalElements || 0;
          pageInfo.value.totalPages = Math.ceil(pageInfo.value.totalCount / size.value);
      } else {
          alert('데이터 조회 실패');
      }
      } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생', error);
      postList.value = { content: [] };
      pageInfo.value.totalCount = 0;
      pageInfo.value.currentPage = 1;
      }
  };
  
  const changeBoardType = (type) => {
      boardType.value = type;
      searchQuery.value = '';
      fetchPostList();
  };
  
  const setPage = ({ page }) => {
      if (page >= 1 && page <= pageInfo.value.totalPages) {
      pageInfo.value.currentPage = page;
      fetchPostList();
      }
  };
  
  const handleSearch = (searchParams) => {
      size.value = searchParams.size;
      postSortOption.value = searchParams.postSortOption;
      selectOption.value = searchParams.selectOption;
      searchQuery.value = searchParams.searchQuery;
      fetchPostList();
  };
  
  const detailPage = (no) => {
      router.push({ name: 'postDetail', params: { postNo: no } });
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
      text-transform: capitalize;
      color: white;
      background-color: #4f46e5; /* indigo-600 */
      border-radius: 0.375rem;
      transition: background-color 0.2s ease;
  }
  
  .category-button:hover {
      background-color: #4338ca; /* indigo-500 */
  }
  
  .select-box {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e0; /* gray-400 */
      border-radius: 0.375rem;
      background-color: white;
  }
  
  .search-input {
      width: 100%;
      padding: 0.5rem 2rem 0.5rem 2.5rem;
      border: 1px solid #cbd5e0; /* gray-400 */
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
      border-radius: 0.375rem; /* rounded-md */
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1); /* shadow */
  }
  
  .custom-table {
      width: 100%;
      text-align: left;
      border-collapse: collapse;
  }
  
  .table-header {
      border-bottom: 1px solid #e5e7eb; /* border-b */
  }
  
  .width-350 {
      width: 350px;
      text-align: left;
  }
  
  .width-80 {
      width: 80px;
  }
  
  .header-cell {
      padding: 0.75rem 1.25rem; /* px-5 py-3 */
      font-size: 0.875rem; /* text-sm */
      font-weight: 500; /* font-medium */
      text-transform: uppercase;
      color: #f3f4f6; /* text-gray-100 */
      background-color: #4f46e5; /* indigo-800 */
  }
  
  .table-row {
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
  }
  
  .table-row:hover {
      background-color: #e5e7eb; /* hover:bg-gray-200 */
  }
  
  .body-cell {
      padding: 1rem 1.5rem; /* px-6 py-4 */
      font-size: 1.125rem; /* text-lg */
      color: #6b7280; /* text-gray-500 */
      border-bottom: 1px solid #e5e7eb; /* border-b */
  }
  
  .body-cell:first-child {
      font-weight: 500; /* 강조를 위해 font 추가 */
  }
  
  .body-cell:hover {
      color: #374151; /* text-gray-700 */
  }
</style>