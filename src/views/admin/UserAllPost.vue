<template>
  <div class="user-post-list">
    <h2>{{ userName }} 님의 게시글 목록</h2>

    <label for="boardType">게시판 선택:</label>
    <select id="boardType" v-model="boardType">
      <option value="NOTICE">공지 게시판</option>
      <option value="FREE">자유 게시판</option>
      <option value="PROJECT_RECRUIT">프로젝트 모집 게시판</option>
    </select>

    <div v-if="posts.length === 0">게시글이 없습니다.</div>

    <table v-else>
      <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>게시판</th>
        <th>상태</th>
        <th>조회수</th>
        <th>북마크</th>
        <th>댓글</th>
        <th>작성일</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(post, index) in posts" :key="post.postNo">
        <td>{{ currentPage * 10 + index + 1 }}</td>
        <td>
          <router-link :to="`/posts/${post.postNo}`" class="post-title-link">
            {{ post.title }}
          </router-link>
        </td>
        <td>{{ post.boardType }}</td>
        <td>{{ post.postStatus }}</td>
        <td>{{ post.viewCount }}</td>
        <td>{{ post.bookmarkCount }}</td>
        <td>{{ post.commentCount }}</td>
        <td>{{ formatDate(post.createdAt) }}</td>
        <td>
          <button @click="deletePost(post.postNo)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 0">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
    </div>

    <button @click="goBack" class="back-btn">뒤로가기</button>

  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api';

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;

const posts = ref([]);
const userName = ref('');
const currentPage = ref(0);
const totalPages = ref(1);
const boardType = ref(localStorage.getItem("boardType") || 'FREE'); // 기본값 설정

const fetchUserName = async () => {
  try {
    const res = await apiClient.get(`/admin/user/${userNo}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });
    userName.value = res.data.username;
  } catch (error) {
    console.error('유저 정보를 불러오는 중 오류 발생:', error);
  }
};

const fetchPosts = async () => {
  try {
    await fetchUserName();
    const res = await apiClient.get(`/admin/user/${userNo}/posts`, {
      params: {
        boardType: boardType.value,
        page: currentPage.value,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });
    
    posts.value = res.data.content;
    totalPages.value = Math.max(1, res.data.totalPages);
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
  }
};

const deletePost = async (postNo) => {
  const confirmed = confirm("정말 이 게시글을 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    await apiClient.delete(`/posts/${postNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    fetchPosts();
  } catch (error) {
    console.error("게시글 삭제에 실패했습니다:", error);
    alert("게시글 삭제에 실패했습니다.");
  }
};


watch(boardType, (newVal) => {
  localStorage.setItem("boardType", newVal);
  posts.value = [];
  currentPage.value = 0; // ✅ 페이지를 0으로 초기화
  fetchPosts();
});

onMounted(() => {
  if (boardType.value) {
    fetchPosts();
  }
});

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchPosts(); // ✅ 올바르게 게시글을 가져오도록 수정
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;

    fetchPosts(); // ✅ 올바르게 게시글을 가져오도록 수정
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const goBack = () => {
  router.back();
};
</script>


<style scoped>.user-post-list {
  max-width: 960px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.user-post-list h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #343a40;
  text-align: center;
}

label {
  font-weight: bold;
  margin-right: 10px;
}

select {
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ced4da;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
}

tr:hover {
  background-color: #f1f3f5;
}

button {
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

td button {
  background-color: #dc3545;
  color: white;
  transition: background-color 0.2s;
}

td button:hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #4c6ef5;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #3b5bdb;
}

.pagination button:disabled {
  background-color: #ced4da;
  color: #495057;
  cursor: not-allowed;
}

.back-btn {
  display: block;
  margin: 1.5rem auto 0;
  padding: 0.75rem 2rem;
  background-color: #adb5bd;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #868e96;
}

.post-title-link {
  color: #212529;
  text-decoration: none;
}

.post-title-link:hover {
  text-decoration: underline;
  font-weight: bold;
}
</style>
