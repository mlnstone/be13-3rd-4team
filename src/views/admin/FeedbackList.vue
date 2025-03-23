<template>
  <div class="feedback-list-container">
    <h2>전체 피드백 목록</h2>

    <table>
      <thead>
      <tr>
        <th>번호</th>
        <th>내용</th>
        <th>타입</th>
        <th>작성자</th>
        <th>프로젝트</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in feedbacks" :key="item.feedbackNo">
        <td>{{ currentPage * 10 + index + 1 }}</td>
        <td>{{ item.content }}</td>
        <td>{{ item.feedbackType }}</td>
        <td>{{ item.userName }}</td>
        <td>
          {{ item.projectName }}
        </td>
        <td>
          <button @click="deleteFeedback(item.feedbackNo)">
            삭제
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const feedbacks = ref([])
const currentPage = ref(0)
const totalPages = ref(1)

const fetchFeedbacks = async () => {
  try {
    const res = await axios.get(`http://localhost:8087/admin/feedbacks`, {
      params: { page: currentPage.value, size: 10 },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    feedbacks.value = res.data.content
    totalPages.value = res.data.totalPages
  } catch (err) {
    console.error('피드백 목록 불러오기 실패:', err)
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchFeedbacks()
  }
}

const deleteFeedback = async (feedbackNo) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:8087/feedback/${feedbackNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    alert('삭제되었습니다')
    fetchFeedbacks()
  } catch (err) {
    console.error('삭제 실패:', err)
    alert('삭제 실패')
  }
}

const goToProject = (projectNo) => {
  if (projectNo) {
    router.push(`/project/${projectNo}`)
  }
}

onMounted(fetchFeedbacks)
</script>

<style scoped>
.feedback-list-container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

.project-link {
  color: black;
  cursor: pointer;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
