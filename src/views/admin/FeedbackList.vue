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
import apiClient from "@/api";
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const feedbacks = ref([])
const currentPage = ref(0)
const totalPages = ref(1)

const fetchFeedbacks = async () => {
  try {
    const res = await apiClient.get(`/admin/feedbacks`, {
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
    await apiClient.delete(`/feedback/${feedbackNo}`, {
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
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  color: #444;
}

th {
  background-color: #4c6ef5;
  color: white;
  font-weight: bold;
}

tr:hover {
  background-color: #f7faff;
}

/* 삭제 버튼 */
button {
  padding: 6px 14px;
  background-color: #ff5c5c;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.85rem;
}

button:hover {
  background-color: #ff3b3b;
}

/* 페이징 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 10px;
}

.pagination button {
  background-color: #4a90e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9rem;
  color: #333;
}
</style>
