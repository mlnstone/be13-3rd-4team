<template>
  <form @submit.prevent="onSubmit" class="feedback-form">
    <label>피드백 유형</label>
    <select v-model="feedbackType" required>
      <option value="TROUBLESHOOTING">트러블 슈팅</option>
      <option value="WEAKNESS">아쉬운 점</option>
      <option value="LESSON">배운 점</option>
      <option value="RETROSPECTIVE">회고록</option>
    </select>

    <label>피드백 내용</label>
    <textarea
      v-model="content"
      placeholder="피드백을 입력하세요..."
      required
    ></textarea>

    <div class="button-group">
      <button type="submit">
        {{ isEditMode ? '수정하기' : '작성하기' }}
      </button>
      <button
        type="button"
        v-if="isEditMode"
        class="cancel-btn"
        @click="$emit('cancel')"
      >
        취소
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  projectNo: Number,
  isEditMode: Boolean,
  feedbackNo: Number,
  initialContent: String,
  initialType: String,
})
const emit = defineEmits(['submitted', 'cancel'])

const content = ref(props.initialContent || '')
const feedbackType = ref(props.initialType || 'TROUBLESHOOTING')

watch(() => props.initialContent, val => (content.value = val))
watch(() => props.initialType, val => (feedbackType.value = val))

const onSubmit = async () => {
  const token = localStorage.getItem('accessToken')
  const url = props.isEditMode
    ? `http://localhost:8087/feedback/project/${props.projectNo}/update/${props.feedbackNo}?feedbackType=${feedbackType.value}`
    : `http://localhost:8087/feedback/project/${props.projectNo}/createFeedback?feedbackType=${feedbackType.value}`

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: content.value })
    })
    emit('submitted')
  } catch (err) {
    alert('요청 실패')
    console.error(err)
  }
}
</script>

<style scoped>
.feedback-form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
}

.feedback-form label {
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 10px;
}

.feedback-form textarea,
.feedback-form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-size: 1rem;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.feedback-form button {
  padding: 8px 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #005bbb;
  color: white;
}

.cancel-btn {
  background-color: #bbb;
}
</style>
