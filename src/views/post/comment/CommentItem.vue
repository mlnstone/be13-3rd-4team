<template>
  <div class="comment-item">
    <div class="comment-list-box">
      <div class="comment-info-box">
        <p>{{ comment.userName }}</p>
        <p>{{ formatDate(comment.updatedAt || comment.createdAt) }}</p>
      </div>

      <div v-if="editMode">
        <textarea v-model="editedContent" class="edited-content-box"></textarea>
      </div>
      <p v-else>{{ comment.content }}</p>
    </div>

    <div v-if="isEditable || isDeletable">
      <div v-if="editMode">
        <button @click="updateComment">수정 완료</button>
        <button @click="cancelEdit">수정 취소</button>
      </div>
      <div v-else>
        <button v-if="isEditable" @click="toggleEdit">수정</button>
        <button v-if="isDeletable" @click="deleteComment">삭제</button>
      </div>
    </div>

    <div class="like-bnt-box">
      <button @click="toggleLike" :class="{ liked: comment.liked }" :disabled="postStatus === 'INACTIVE'">
        좋아요 {{ comment.likeCount }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth.js';
import dayjs from 'dayjs';

const props = defineProps({
  comment: Object,
  postStatus: String,
  postNo: Number
});

const authStore = useAuthStore();
const editMode = ref(false);
const editedContent = ref('');
const originalContent = ref('');
const currentUsername = ref(authStore.getUsernameFromToken());

const isEditable = computed(() => props.comment.userName === currentUsername.value);
const isDeletable = computed(() => {
  const userInfo = authStore.getUserInfo();
  return props.comment.userName === currentUsername.value || userInfo?.role === 'ADMIN';
});

watch(
  () => props.comment,
  (newVal) => {
    editedContent.value = newVal.content;
    originalContent.value = newVal.content;

    const likeState = localStorage.getItem(`like_${props.comment.commentNo}`);
    if (likeState !== null) {
      props.comment.liked = likeState === 'true';
    }
  },
  { immediate: true }
);

const toggleEdit = () => {
  editMode.value = true;
  editedContent.value = props.comment.content;
};

const cancelEdit = () => {
  editMode.value = false;
  editedContent.value = originalContent.value;
};

const updateComment = async () => {
  try {
    const response = await apiClient.post(`/comments/${props.comment.commentNo}/update`, {
      content: editedContent.value,
      postNo: props.comment.postNo
    }, {
      headers: {
        Authorization: `Bearer ${authStore.getUserInfo().accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.updatedAt) {
      props.comment.updatedAt = response.data.updatedAt;
    }

    editMode.value = false;
    emit('commentUpdated');
  } catch (error) {
    alert('댓글 수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
  }
};

const deleteComment = async () => {
  if (!isDeletable.value) {
    alert('해당 댓글 삭제 권한이 없습니다.');
    return;
  }

  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      await apiClient.delete(`/comments/${props.comment.commentNo}`, {
        headers: {
          Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
        }
      });

      emit('commentDeleted', props.comment.commentNo);
    } catch (error) {
      alert('댓글 삭제 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  }
};

const toggleLike = async () => {
  const previousState = props.comment.liked;
  props.comment.liked = !previousState;
  props.comment.likeCount += previousState ? -1 : 1;

  try {
    await apiClient.post(`/comments/${props.comment.commentNo}/like`, { postNo: props.postNo }, {
      headers: {
        Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
      }
    });

    localStorage.setItem(`like_${props.comment.commentNo}`, props.comment.liked.toString());
  } catch (error) {
    props.comment.liked = previousState;
    props.comment.likeCount += previousState ? 1 : -1;
    alert('좋아요 처리에 실패했습니다.');
  }
};

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
.comment-item {
  margin-bottom: 1rem;
}
</style>
