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
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;

const comments = ref([]);
const userName = ref('');
const currentPage = ref(0);
const totalPages = ref(1);

const fetchUserName = async () => {
  try {
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, { // ✅ 올바른 경로로 수정
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

    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}/comments?page=${currentPage.value}&size=10`, {
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
    await axios.delete(`http://localhost:8087/comments/${commentNo}`, {
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
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.comments-table th,
.comments-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
  background-color: #fff;
}

.comments-table th {
  background-color: #f0f0f0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.back-btn {
  display: block;
  margin: 1rem auto;
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #545b62;
}
</style>
