<template>
  <div class="comments-container">
    <h2>{{ userName }}님의 댓글</h2>

    <div v-if="comments.length === 0">작성한 댓글이 없습니다.</div>

    <table v-else class="comments-table" >
      <thead>
      <tr>
        <th>댓글 번호</th>
        <th>내용</th>
        <th>게시글 번호</th>
        <th>좋아요 수</th>
        <th>작성일</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(comment, index) in comments" :key="comment.commentNo">
        <td>{{ currentPage * 10 + index + 1 }}</td>
        <td>{{ comment.content }}</td>
        <td>{{ comment.postNo }}</td>
        <td>{{ comment.likeCount }}</td>
        <td>{{ formatDate(comment.createdAt) }}</td>
        <td>
          <button @click="deleteComment(comment.commentNo)">삭제</button>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from "@/api";

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;

const comments = ref([]);
const userName = ref('');
const currentPage = ref(0);
const totalPages = ref(1);

const fetchUserName = async () => {
  try {
    const res = await apiClient.get(`/admin/user/${userNo}`, { // ✅ 올바른 경로로 수정
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    userName.value = res.data.username;
  } catch (error) {
    console.error('유저 정보를 불러오는 중 오류 발생:', error);
  }
};

const fetchComments = async () => {
  try {
    await fetchUserName(); // ✅ 먼저 유저 정보를 가져옴

    const res = await apiClient.get(`/admin/user/${userNo}/comments?page=${currentPage.value}&size=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    comments.value = res.data.content;
    totalPages.value = res.data.totalPages;



  } catch (error) {
    console.error("댓글을 불러오는 데 실패했습니다:", error);
  }
};

const deleteComment = async (commentNo) => {
  const confirmed = confirm("정말 이 댓글을 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    await apiClient.delete(`/comments/${commentNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    // 삭제 후 댓글 목록 다시 불러오기
    fetchComments();
  } catch (error) {
    console.error("댓글 삭제에 실패했습니다:", error);
    alert("댓글 삭제에 실패했습니다.");
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchComments();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchComments();
  }
};

const goBack = () => {
  router.back();
};

onMounted(fetchComments);
</script>

<style scoped>
.comments-container {
  max-width: 960px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.comments-container h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #343a40;
  text-align: center;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.comments-table th,
.comments-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.comments-table th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
}

.comments-table tr:hover {
  background-color: #f1f3f5;
}

.comments-table button {
  padding: 6px 12px;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.comments-table button:hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #4c6ef5;
  color: white;
  font-weight: 500;
  cursor: pointer;
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
  margin: 0 auto;
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
</style>
