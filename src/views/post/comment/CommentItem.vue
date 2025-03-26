<template>
    <div class="comment-item">
      <div class="comment-list-box">
        <div class="comment-info-box">
          <div class="comment-info-nad">
            <p>{{ comment.userName }}</p>
            <p>{{ formatDate(comment.updatedAt || comment.createdAt) }}</p>
          </div>
          <div class="comment-info-like">
            <div class="like-bnt-box">
              <span>좋아요 {{ comment.likeCount }}</span>
              <button
                @click="toggleLike"
                :class="{ liked: comment.liked }"
                :disabled="postStatus === 'INACTIVE'">
                <i class="fi fi-ss-heart" :class="{ liked: comment.liked }"></i>
              </button>
            </div>
          </div>
        
        </div>

        

        <div v-if="editMode">
          <textarea v-model="editedContent" 
                    class="edited-content-box"
                    ref="editBox"
                    @input="autoResize">
            
          </textarea>
        </div>
        <p v-else class="comment-content">{{ comment.content }}</p>
      </div>

     

      <div v-if="isEditable || isDeletable" class="edit-delete-box">
        <div v-if="editMode">
          <button @click="updateComment">수정 완료</button>
          <button @click="cancelEdit">수정 취소</button>
        </div>
        <div v-else>
          <button v-if="isEditable" @click="toggleEdit">수정</button>
          <button v-if="isDeletable" @click="deleteComment">삭제</button>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed, onMounted, watch, nextTick  } from 'vue';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth.js';
import dayjs from 'dayjs';

const emit = defineEmits(['commentUpdated', 'commentDeleted']);

const props = defineProps({
  comment: Object,
  postStatus: String,
  postNo: Number
});

const authStore = useAuthStore();
const editMode = ref(false);
const editedContent = ref('');
const editBox = ref(null);
const originalContent = ref('');
const currentUsername = ref(authStore.getUsernameFromToken());

onMounted(() => {
  const username = authStore.getUsernameFromToken();
  currentUsername.value = username;
  console.log('현재 유저:', username);
});
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
  nextTick(() => autoResize());
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

const autoResize = () => {
  nextTick(() => {
    if (editBox.value) {
      editBox.value.style.height = 'auto'; // 초기화
      editBox.value.style.height = editBox.value.scrollHeight + 'px'; // 실제 높이 적용
    }
  });
};


const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
@import url('https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css');

.comment-item {
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 180px;
}

.comment-info-box {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
}

.comment-info-box p:first-child {
  font-weight: bold;
  color: #353535;
}

.comment-content {
  margin: 6px 0;
  color: #353535;
  line-height: 1.5;
  font-size: 14px;
}
.comment-info-box {
  display: flex;
  justify-content: space-between;
}
.comment-info-nad{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.comment-info-like{
  display: flex;
  align-items: center;
}

/* 수정 textarea */
.edited-content-box {
  width: 100%;
  min-height: 60px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  font-size: 14px;
  resize: none;
  overflow: hidden;
  outline: none;
}

/* 좋아요 박스 - 오른쪽 정렬 */
.like-bnt-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  border: 1px solid #d9d9d9;
  width: 100px;
}

.like-bnt-box span {
  font-size: 13px;
  color: #353535;
}

.like-bnt-box button {

  border: none;
  background-color: white;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.like-bnt-box button:disabled {
  opacity: 0.5;
  cursor: not-allowed;

}

.like-bnt-box i {
  font-size: 16px;
  color: #d9d9d9;
  transition: transform 0.3s ease, color 0.3s ease;
}
.like-bnt-box button:hover i {
  color: #ff7b89;
}
.like-bnt-box i.liked {
    color: #ff3e60; /* 빨간색 하트 */
    animation: heart-pop 0.3s ease;
}

@keyframes heart-pop {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.4);
  }
  60% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1.2);
  }
}

/* 수정/삭제 버튼 */
.edit-delete-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
}

.edit-delete-box button {
  background-color: #f1f1f1;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #353535;
  cursor: pointer;
}

.edit-delete-box button:hover {
  background-color: #e2e2e2;
}
</style>
