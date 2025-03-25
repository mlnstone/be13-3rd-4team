<template>
  <div class="feedback-list-container">
    <h2 class="text-xl font-bold mb-4">내가 쓴 피드백</h2>

    <div v-if="loading">불러오는 중입니다...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <table>
        <thead>
        <tr>
          <th>번호</th>
          <th>프로젝트명</th>
          <th>피드백 타입</th>
          <th>내용</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in feedbacks" :key="item.feedbackNo">
          <td>{{ currentPage * pageSize + index + 1 }}</td>
          <td>{{ item.projectName }}</td>
          <td>{{ item.feedbackType }}</td>
          <td>{{ item.content }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">이전</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from "@/api";

const feedbacks = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = 10
const loading = ref(false)
const error = ref('')

const fetchFeedbacks = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiClient.get(`/feedback/list`, {
      params: { page: currentPage.value, size: pageSize },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    feedbacks.value = res.data.content
    totalPages.value = res.data.totalPages
  } catch (err) {
    error.value = '피드백을 불러올 수 없습니다.'
    console.error('불러오기 실패:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchFeedbacks()
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}
</style>
