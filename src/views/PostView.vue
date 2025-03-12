<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Post" />
    <button
      @click="fetchPostData"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      새로고침
    </button>
    <div class="flex px-4 py-4 space-x-4 overflow-x-auto bg-white rounded-md">
      <button
        @click="changeBoardType('NOTICE')"
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        공지
      </button>
      <button
        @click="changeBoardType('PROJECT_RECRUIT')"
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        프로젝트
      </button>
      <button
        @click="changeBoardType('FREE')"
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        자유
      </button>
    </div>
    <AppTable :posts="postData.content" />
  </div>
</template>

<script>
import Breadcrumb from "../partials/AppBreadcrumb.vue";
import AppTable from "../components/AppTable.vue";
import axios from "axios";
export default {
  name: "PostView",
  components: {
    AppTable,
    Breadcrumb,
  },
  data() {
    return {
      postData: [], // 초기 데이터 정의
      boardType: "FREE",
      postSortOption: "LATEST",
      page: 0,
      size: 10,
    };
  },
  mounted() {
    // 컴포넌트가 마운트 될 때 실행되는 라이프사이클 훅
    this.fetchPostData(); // 데이터 가져오는 메소드 호출
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.fetchPostData(); // 라우트가 변경될 때 데이터 가져오기
      }
    },
  },
  methods: {
    fetchPostData() {
      // 데이터를 가져오는 메소드 정의
      axios
        .get("/posts", {
          // 백엔드에서 데이터를 가져옴
          params: {
            boardType: this.boardType,
            postSortOption: this.postSortOption,
            page: this.page,
            size: this.size,
          },
        })
        .then((response) => {
          console.log("응답 데이터:", response.data); // 응답 데이터 로그 추가
          this.postData = response.data; // 응답 데이터를 postData에 저장
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중, 오류 발생 :", error); // 오류 처리
        });
    },
    changeBoardType(type) {
      this.boardType = type;
      this.fetchPostData();
    },
  },
};
</script>
