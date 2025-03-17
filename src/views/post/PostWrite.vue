<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Post" />
    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            게시글 작성
          </h2>

          <form @submit.prevent="register">
            <div class="grid grid-cols-1 gap-6 mt-4">
              <div>
                <label class="text-gray-700" for="username">제목</label>
                <input
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  v-model="title"
                />
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">내용</label>
                <input
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  v-model="content"
                />
              </div>

              <div>
                <label class="text-gray-700" for="password">게시글 타입</label>
                <input
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  v-model="boardType"
                />
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                type="submit"
                @click="submitPostData"
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/index";
import Breadcrumb from "@/partials/AppBreadcrumb.vue";
export default {
  name: "PostWrite",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      title: "",
      content: "",
      boardType: "FREE",
      postStatus: "ACTIVE",
    };
  },
  methods: {
    // 데이터를 보내는 메소드
    submitPostData() {
      // 데이터 파라미터
      const params = {
        title: this.title,
        content: this.content,
        boardType: this.boardType,
        postStatus: this.postStatus,
      };

      axios
        .post("/posts?boardType=FREE", params)
        .then((response) => {
          this.postData = response.data; // 응답 데이터를 postData에 저장
          this.$router.push("/post"); // '/posts' 페이지로 이동
        })
        .catch((error) => {
          console.error("데이터를 전송하는 중, 오류 발생 :", error); // 오류 처리
        });
    },
  },
};
</script>
