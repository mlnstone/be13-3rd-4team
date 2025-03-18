<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Post" />
    <div class="max-w-7xl w-full mx-auto p-4 bg-white">
      <!-- Author Section -->
      <div class="flex items-center space-x-4 mb-6">
        <img
          src="https://cdn.startupful.io/img/app_logo/no_img.png"
          alt="Author Avatar"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <h3 class="font-semibold">{{ post.userName }}</h3>
          <p class="text-gray-500 text-sm">
            {{ new Date(post.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- 제목 -->
        <h1 class="text-3xl font-bold text-black">
          {{ post.title }}
        </h1>

        <!-- 내용 -->
        <div class="prose max-w-none text-black">
          <p class="text-gray-500 leading-relaxed">
            {{ post.content }}
          </p>
        </div>
      </div>
      <!-- Tags 샘플로 남겨둠 -->
      <!-- <div class="mt-8 flex flex-wrap gap-2">
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#WebDevelopment</span
        >
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#Programming</span
        >
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#TechTrends</span
        >
      </div> -->
      <!-- 수정 삭제 -->
      <div>
        유저 정보 가져와서 userNo랑 비교하고 v-if문으로 렌더링
        <br />
        <button
          class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
          @click="goToEditPage"
        >
          수정
        </button>
        <button
          class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
          @click="confirmDelete(post.postNo)"
        >
          삭제
        </button>
      </div>
      <!-- 댓글 부분 -->
      <div>
        <br />
        <span>댓글 {{ post.commentCount }} 개</span>
        <br />
        이후는 알아서 작성하세요
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/partials/AppBreadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import axios from "@/api/index";
export default {
  name: "PostDiteil",
  components: {
    Breadcrumb,
  },
  setup() {
    // 초기 데이터 설정
    const route = useRoute(); // 현재 URL 정보 가져옴
    const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
    const postNo = route.params.postNo; // 경로에 포함된 번호를 가져옴
    const post = ref({}); // 반응형 데이터 선언
    const initParams = {
      page: 1,
      size: 10,
    };

    // 상세 정보 가져와서 post에 넣음
    axios.get(`/posts/${postNo}/with-comments`, initParams).then((response) => {
      post.value = response.data;
    });

    // 게시글 수정용 데이터
    const goToEditPage = () => {
      router.push({
        name: "PostWrite",
        query: {
          postNo: post.value.postNo,
          title: post.value.title,
          content: post.value.content,
          boardType: post.value.boardType,
        },
      });
    };

    // 메소드 반환
    return {
      post,
      goToEditPage,
    };
  },
  methods: {
    // 삭제 확인 창
    confirmDelete(postNo) {
      if (confirm("정말로 삭제하시겠습니까?")) {
        // 삭제 처리 로직 호출
        this.deletePostData(postNo);
      }
    },
    // 게시글 삭제
    deletePostData(postNo) {
      axios
        .delete(`/posts/${postNo}`)
        .then(() => {
          // 게시글을 삭제한 후 기존 페이지로 돌려보냄
          this.$router.push("/post");
        })
        .catch((error) => {
          console.error("게시글 삭제 실패", error);
        });
    },
  },
};
</script>
