<template>
  <div class="feedback-list-container">
    <BackButton />
    <h2 class="text-xl font-bold mb-4">팀 피드백 목록</h2>

    <div class="mb-4" v-if="isTeamMember">
      <button class="write-button" @click="toggleForm">
        {{ showForm ? '작성 취소' : '✍️ 피드백 작성' }}
      </button>
    </div>


    <FeedbackCreate
      v-if="showForm"
      :projectNo="projectNo"
      @submitted="onCreateSuccess"
    />

    <div v-if="loading">불러오는 중입니다...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="feedbacks.length === 0" class="text-gray-500">피드백이 없습니다.</div>

      <div class="feedback-card-list">
        <div
          v-for="(item, index) in feedbacks"
          :key="item.feedbackNo"
          class="feedback-card"
        >
          <div class="feedback-header">
            <span class="feedback-index">#{{ currentPage * pageSize + index + 1 }}</span>
            <!-- <span class="feedback-type">{{ item.feedbackType }}</span> -->
            <span class="feedback-type">{{ statusLabels[item.feedbackType] }}</span>
          </div>

          <div v-if="editingFeedback?.feedbackNo === item.feedbackNo">
            <FeedbackCreate
              :projectNo="projectNo"
              :feedbackNo="item.feedbackNo"
              :initialContent="item.content"
              :initialType="item.feedbackType"
              :isEditMode="true"
              @submitted="onEditSuccess"
              @cancel="cancelEdit"
            />
          </div>

          <div v-else>
            <div class="feedback-content">{{ item.content }}</div>
            <div class="feedback-footer">
              <span class="feedback-writer">작성자: {{ item.userName }}</span>
              <template v-if="item.userName.toLowerCase() === currentUserName.toLowerCase()">
                <button class="edit-btn" @click="startEdit(item)">수정</button>
                <button class="delete-btn" @click="deleteFeedback(item.feedbackNo)">삭제</button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">이전</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BackButton from '@/components/common/BackButton.vue';
import { ref, onMounted, watch } from 'vue';
import apiClient from "@/api";
import { useRoute } from 'vue-router';
import FeedbackCreate from "@/views/feedback/FeedbackCreate.vue";

const route = useRoute()
const projectNo = route.params.projectNo

const feedbacks = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = 10
const loading = ref(false)
const error = ref('')
const editingFeedback = ref(null)
const showForm = ref(false)


const isTeamMember = ref(false)

const user = JSON.parse(localStorage.getItem('user'))
const currentUserName = user?.username || ''


const fetchProjectFeedbacks = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiClient.get(`/feedback/list/${projectNo}`, {
      params: { page: currentPage.value, size: pageSize },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    feedbacks.value = res.data.content
    totalPages.value = res.data.totalPages
    isTeamMember.value = true // ✅ 성공 시 true
  } catch (err) {
    console.error('피드백 불러오기 실패:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = '피드백을 불러올 수 없습니다.'
    }
    isTeamMember.value = false // ✅ 실패 시 false
  } finally {
    loading.value = false
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
    alert('삭제되었습니다.')
    fetchProjectFeedbacks()
  } catch (err) {
    console.error('삭제 실패:', err)
    alert('삭제에 실패했습니다.')
  }
}

const startEdit = (feedback) => {
  editingFeedback.value = feedback
}

const cancelEdit = () => {
  editingFeedback.value = null
}

const onEditSuccess = () => {
  editingFeedback.value = null
  fetchProjectFeedbacks()
}

const onCreateSuccess = () => {
  showForm.value = false
  fetchProjectFeedbacks()
}

const toggleForm = () => {
  showForm.value = !showForm.value
  editingFeedback.value = null
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchProjectFeedbacks()
  }
}

const statusLabels = {
  TROUBLESHOOTING: '트러블슈팅',
  LESSON: '배운점',
  WEAKNESS: '아쉬운점',
  RETROSPECTIVE: '회고록',
};

onMounted(fetchProjectFeedbacks)
watch(currentPage, fetchProjectFeedbacks)
</script>

<style scoped>
.feedback-list-container {
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
}

.write-button {
  background-color: #005bbb;
  color: white;
  padding: 8px 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.write-button:hover {
  background-color: #004399;
}

.feedback-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

.feedback-index {
  font-weight: bold;
  color: #333;
}

.feedback-type {
  font-style: italic;
  color: #888;
}

.feedback-content {
  font-size: 1rem;
  color: #222;
  margin-bottom: 8px;
}

.feedback-footer {
  text-align: right;
  font-size: 0.85rem;
  color: #666;
}

.edit-btn,
.delete-btn {
  margin-left: 8px;
  padding: 4px 10px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
}

.delete-btn:hover {
  background-color: #c9302c;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}
</style>
