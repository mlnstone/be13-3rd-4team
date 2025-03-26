<template>
  <div>
    <textarea v-model="commentContent" 
              placeholder="댓글을 입력하세요"
              ref="textareaRef"
              @input="autoResize"
    ></textarea>
    <div class="comment-write-btnBox">
      <button @click="submitComment" class="comment-create-btn">댓글 등록</button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import apiClient from '@/api';

const textareaRef = ref(null);
const props = defineProps({
  postNo: {
    type: Number,
    required: true
  }
});

const autoResize = () => {              
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';     
    textarea.style.height = `${textarea.scrollHeight}px`; 
  }
};

onMounted(() => {
  autoResize();                       
});

const emit = defineEmits(['commentAdded', 'updateTotalPages']);

const commentContent = ref("");

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    alert("댓글 내용을 입력하세요.");
    return;
  }

  try {
 
    const response = await apiClient.post(
      `/posts/${props.postNo}/comments`,
      {postNo: props.postNo,
      content: commentContent.value
     }
    );

    emit("commentAdded", response.data);
    emit('updateTotalPages');
    commentContent.value = '';   
    autoResize();

  } catch (error) {
    console.error('댓글 작성 실패:', error.response?.data || error.message);
    alert("댓글 작성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
  }
};
</script>

<style scoped>
textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  overflow: hidden;
  resize: none;        
  transition: height 0.2s ease; 

}

.comment-write-btnBox {
  display: flex;
  justify-content: flex-end;
}

.comment-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #0077b6;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  width: 110px;
  height: 45px;
}

.comment-create-btn:hover {
  background-color: #00b4d8;
}
</style>
