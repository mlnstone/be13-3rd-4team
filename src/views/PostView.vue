<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Post" />
    <AppTable :data="postData" />
  </div>
</template>

<script>
import Breadcrumb from "../partials/AppBreadcrumb.vue";
import axios from "axios";
import AppTable from "../components/AppTable.vue";
export default {
  name: "PostView",
  components: {
    AppTable,
    Breadcrumb,
  },
  data() {
    return {
      postData: {}, // 초기 데이터 정의
    };
  },
  mounted() {
    // 컴포넌트가 마운트 될 때 실행되는 라이프사이클 훅
    this.fetchPostData(); // 데이터 가져오는 메소드 호출
  },
  methods: {
    fetchPostData() {
      // 데이터를 가져오는 메소드 정의
      axios
        .get("/posts") // 백엔드에서 데이터를 가져옴
        .then((response) => {
          this.postData = response.data; // 응답 데이터를 postData에 저장
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중, 오류 발생 :", error); // 오류 처리
        });
    },
  },
};
</script>
