<template>
    <div>
        <h2>쪽지 상세 보기</h2>

        <!-- <p>{{ currentRoute.fullPath }}</p>
        <p>{{ currentRoute.path }}</p>
        <p>{{ currentRoute.params }}</p>
        <p>{{ currentRoute.params.no }}</p>
        <p>{{ currentRoute.query }}</p>
        <p>{{ currentRoute.query.name }}</p>
        <p>{{ parseInt(currentRoute.query.age) }}</p> -->



        <!-- <button @click="(e) => router.push('/')">홈으로</button> -->
        <!-- <button @click="(e) => router.push({name: 'home'})">홈으로</button> -->
        <!-- <button @click="(e) => router.replace({name: 'home'})">홈으로</button> -->
        <!-- <button @click="(e) => router.back()">뒤로가기</button> -->
        <!-- <button @click="(e) => router.forward()">앞으로가기</button> -->

        <MessageForm :initFormData="initFormData" />
    </div>
</template>

<script setup>
    import {reactive, onMounted} from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import MessageForm from '@/components/forms/MessageForm.vue';
    import apiClient from '@/api';

    const currentRoute = useRoute(); 
    const router = useRouter();
    const initFormData = reactive ({});

    const fetchMessage = async (no) => {
        try {
            const response = await apiClient.get(`/messages/${no}`);

            Object.assign(initFormData, response.data);
        } catch (error) {
            if (error.response.status === 404) {
                alert(error.response.message);

                router.push({name: 'messages'});
            } else {
                alert('에러가 발생했습니다.');
            }
        }
    };

    onMounted(() => {
        fetchMessage(currentRoute.params.no);
    });
</script>

<style scoped>

</style>
=======
  <div>
    <div class="max-w-7xl w-full mx-auto p-4 bg-white">
     
      <div class="flex items-center space-x-4 mb-6">
        <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
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

      <!-- 북마크 버튼 -->
      <div class="bookmark-section">

        {{ post.bookmarkCount }}
        <button
            @click="toggleBookmark"
        :class="{ 'bookmarked': post.bookmarked }"
        :disabled="post.postStatus === 'INACTIVE'"
        class="bookmark-btn"
        >

          북마크
        </button>

      </div>


      <!-- 수정 삭제 -->
      <div>
        <br />
        <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="goToEditPage">수정</button>
        <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none" @click="confirmDelete(post.postNo)">삭제</button>
      </div>
      <!-- 댓글 부분 -->
      <div  v-if="post.boardType === 'FREE'">
        <br />
        <span>댓글 {{ post.commentCount }} 개</span>
        <br />

        <CommentCreate
            v-if="post.postNo"
            :postNo="Number(post.postNo)"
            @commentAdded="handleCommentAdded"
        />

        <CommentList
            v-if="post.postNo"
            ref="commentList"
            :postNo="Number(post.postNo)"
            :postStatus="post.postStatus"
            @commentUpdated="fetchPostDetail"
            @commentDeleted="handleCommentDeleted"
        />

      </div>
    </div>
  </div>
</template>
<script>
import CommentCreate from "@/views/post/comment/CommentCreate.vue";
import CommentList from "@/views/post/comment/CommentList.vue";
import {useRoute, useRouter} from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import {nextTick, onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "PostDetail",
  components: { CommentCreate, CommentList }, // 컴포넌트 등록
  setup() {
    // 초기 데이터 설정
    const route = useRoute(); // 현재 URL 정보 가져옴
    const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
    const postNo = Number(route.params.postNo); // 경로에 포함된 번호를 가져옴
    const post = ref({}); // 반응형 데이터 선언
    const commentList = ref(null);
    const authStore = useAuthStore();


    const initParams = {
      page: 1,
      size: 10,
    };

    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8087/posts/${postNo}/with-comments`,  {params: initParams});
        console.log(response.data);
        post.value = response.data;

        // 사용자 상태를 로컬 스토리지에서 복원
        const bookmarkState = localStorage.getItem(`bookmark_${postNo}`);
        if (bookmarkState !== null) {
          post.value.bookmarked = bookmarkState === "true";
        }
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    //상세 정보 가져와서 post에 넣음
    axios.get(`http://localhost:8087/posts/${postNo}/with-comments`, initParams).then((response) => {
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


    // 북마크 추가/취소 기능 (추가 기능)
    const toggleBookmark = async () => {
      if (post.value.postStatus === "INACTIVE") {
        alert("비활성화된 게시글은 북마크 추가가 불가능합니다.");
        return;
      }
      const previousState = post.value.bookmarked;  // 기존 상태 저장
      post.value.bookmarked = !previousState;        // 즉시 변경
      post.value.bookmarkCount += previousState ? -1 : 1;  // 북마크 개수 즉시 반영

      try {
        const response = await axios.post(`http://localhost:8087/posts/${postNo}/bookmark`, {}, {
          headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
          }
        });


        if (response.data !== "북마크가 추가되었습니다.") {
          post.value.bookmarked = false;  // 서버 응답이 불일치할 경우 상태 복구
        }

        // 사용자 상태를 로컬 스토리지에 저장
        localStorage.setItem(`bookmark_${postNo}`, post.value.bookmarked.toString());

      } catch (error) {
        post.value.bookmarked = previousState;  // 오류 시 복구
        post.value.bookmarkCount += previousState ? 1 : -1;
        alert("북마크 처리에 실패했습니다.");
      }
    };


    const handleCommentAdded = (newComment) => {
      post.value.commentCount += 1;

      if (commentList.value) {
        commentList.value.pageInfo.totalCount += 1; 
        commentList.value.comments.unshift(newComment);
        if (commentList.value.pageInfo.totalCount % commentList.value.pageInfo.listLimit === 1) {
          commentList.value.pageInfo.currentPage = Math.ceil(commentList.value.pageInfo.totalCount / commentList.value.pageInfo.listLimit);
        }
      } else {
        console.warn('commentList가 null입니다.');
      }
    };


    onMounted(async () => {
      await fetchPostDetail();
      await nextTick();  // DOM 업데이트 후 접근
      console.log('commentList 상태 확인:', commentList.value);
    });

    // 메소드 반환
    return {
      post,
      goToEditPage,
      fetchPostDetail,
       commentList,
      handleCommentAdded,
      toggleBookmark,
      authStore,
    };
  },
  mounted() {
    const authStore = this.authStore;
    const userInfo = this.authStore.getUserInfo();

    if (!userInfo) {
      console.warn("사용자 정보가 없습니다. 로그인 여부를 확인하세요.");
      return;
    }

    this.currentUsername = authStore.getUsernameFromToken();

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
    async deletePostData(postNo) {
      const authStore = this.authStore;
      const token = this.authStore.getUserInfo().accessToken;
      const url = `http://localhost:8087/posts/${postNo}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = await axios.delete(url, config);
        alert("삭제 됐습니다.");
        // 게시글을 삭제한 후 기존 페이지로 돌려보냄
        this.$router.push("/post");
      } catch (error) {
        alert(error.response.data.message);
      }
    },

    handleCommentDeleted() {
      if (this.post.commentCount > 0) {
        this.post.commentCount -= 1; // 댓글 삭제 시 댓글 수 즉시 감소
      }
    }
  },
};
</script>

<style scoped>
/* Author Section */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.w-12,
.h-12 {
  width: 3rem;
  height: 3rem;
}

.rounded-full {
  border-radius: 9999px;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-500 {
  color: #6b7280;
}

.text-sm {
  font-size: 0.875rem;
}

/* Main Content */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.text-black {
  color: #000;
}

.prose p {
  color: #6b7280;
  line-height: 1.625;
}

.max-w-none {
  max-width: none;
}

/* 수정 삭제 버튼 */
.mt-4 {
  margin-top: 1rem;
}

.px-3,
.py-1 {
  padding: 0.25rem 0.75rem;
}

.text-white {
  color: #fff;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.rounded-md {
  border-radius: 0.375rem;
}

.hover\:bg-indigo-500:hover {
  background-color: #4338ca;
}

.focus\:outline-none:focus {
  outline: none;
}

.text-gray-700 {
  color: #374151;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db;
}


/* 북마크 버튼 스타일 추가 */
.bookmark-section {
  margin-top: 1rem;
  text-align: right;
}

.bookmark-btn {
  background-color: #e5e7eb;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.bookmark-btn.bookmarked {
  color: #fff;
  background-color: #e6d44b;
}
</style>
