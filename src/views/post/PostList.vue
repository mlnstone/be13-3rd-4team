<template>
  <div>
    <!-- 분류바 -->
    <div class="category-bar">
      <button @click="changeBoardType('NOTICE')" class="category-button">공지</button>
      <button @click="changeBoardType('PROJECT_RECRUIT')" class="category-button">프로젝트</button>
      <button @click="changeBoardType('FREE')" class="category-button">자유</button>
      <router-link to="/post/write">
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
              <tr v-for="(post, i) in paginatedPosts" :key="i" @click="detailPage(post.postNo)" class="table-row">
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
      v-if="postList && postList.content && postList.content.length > 0 && postList.totalElements > parseInt(size)"
      :pageInfo="{
       currentPage: pageInfo.currentPage,
        itemsPerPage: parseInt(pageInfo.listLimit),
          pageLimit: pageInfo.totalPages,
           totalCount: pageInfo.totalCount
    }"
      @change-page="setPage"
    />
  </div>
</template>

<script>
import Pagination from "@/components/common/Pagination.vue";
import SearchBar from "@/components/common/SearchBar.vue";
import axios from "axios";
export default {
  name: "PostView",
  components: {
    Pagination,
    SearchBar,
  },
  data() {
    return {
      size: 10,
      postList: [], // 초기 데이터 정의
      boardType: "FREE", // 페이지 분류
      postSortOption: "LATEST", // 정렬 순서

      pageInfo: {   
        currentPage: parseInt(this.$route.query.page) || 1,
        totalCount: 0,
        pageLimit: 10,
        listLimit: 10
      },
      searchQuery: "", // 검색어
      selectOption: "", // 검색 옵션

      // 검색창 데이터---------------
      // 항목 개수
      sizeOptions: [10, 20, 30],
      // 정렬 옵션
      postSortOptions: [
        {value: "LATEST", label: "최신순"},
        {value: "BOOKMARK", label: "북마크"},
        {value: "VIEW", label: "조회수"},
        {value: "COMMENT", label: "댓글"},
      ],
      // 검색 옵션
      selectOptions: [
        {value: "", label: "전체"},
        {value: "TITLE", label: "제목"},
        {value: "CONTENT", label: "내용"},
        {value: "USERNAME", label: "유저이름"},
      ],
    };
  },
  computed: {
    paginatedPosts() {
      return this.postList.content || []; // 추가
    },
  },
  mounted() {
    // 컴포넌트가 마운트 될 때 실행되는 라이프사이클 훅
    this.fetchPostList(); // 데이터 가져오는 메소드 호출
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.fetchPostList(); // 라우트가 변경될 때 데이터 가져오기
      }
    },
  },
  methods: {
    // 데이터를 가져오는 메소드
    async fetchPostList() {
      // 기본 요청 파라미터
      const params = {
        boardType: this.boardType,
        postSortOption: this.postSortOption,
        page: this.pageInfo.currentPage - 1, // 현재 페이지 번호 -1 서버에서는 0부터 시작
        size: this.size
      };

      // 검색 조건이 있을 경우 파라미터에 추가
      if (this.searchQuery && this.selectOption) {
        params.option = this.selectOption;
        params.keyword = this.searchQuery;
      }

      await axios
        .get("http://localhost:8087/posts", {params})
        .then((response) => {
         

          if (response.status === 200) {
            this.postList = response.data;
            this.pageInfo.totalCount = response.data.totalElements || 0;
            this.pageInfo.totalPages = Math.ceil(this.pageInfo.totalCount / this.size);
           
          } else {
            alert("데이터 조회 실패");
          }
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중, 오류 발생함 초기화"); // 오류 처리
          // 오류 발생 시 postList 초기화 및 페이지 번호 초기화
          this.postList = {content: []};
          this.pageInfo.totalCount = 0;  
          this.pageInfo.currentPage = 1;
        });
    },
    // 분류별로 데이터를 가져오는 메소드
    changeBoardType(type) {
      this.boardType = type;
      this.page = 1; // 페이지 초기화
      this.searchQuery = ""; // 검색 초기화
      this.fetchPostList(); // 데이터 재 호출
    },
    // 페이징 시 값 변경 메소드
    setPage({ page, totalPages }) {
      totalPages = this.pageInfo.totalPages || 1;
      console.log(`🔄 [setPage] 페이지 변경 요청: page=${page}, totalPages=${totalPages}`); 
      if (page >= 1 && page <= totalPages) {
        this.pageInfo.currentPage = page;
        this.fetchPostList();  
      }
    },
 
    // 검색 컴포넌트에서 전달된 검색 조건 처리
    handleSearch(searchParams) {
      this.size = searchParams.size;
      this.postSortOption = searchParams.postSortOption;
      this.selectOption = searchParams.selectOption;
      this.searchQuery = searchParams.searchQuery;
      this.page = 1; // 검색 시 페이지 초기화
      this.fetchPostList();
    },
    detailPage(no) {
      this.$router.push({ name: 'postDetail', params: { postNo: no } });
    },
  },
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
