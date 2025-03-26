<template>
  <div>
    <!-- 댓글 정렬 기능 -->
    <div class="sort-option">
      <select v-model="sortOption" @change="fetchComments">
        <option value="NEW">최신순</option>
        <option value="LIKE">좋아요순</option>
      </select>
    </div>

    <div v-if="comments.length === 0" class="comment-none">작성된 댓글이 없습니다.</div>
    <div v-else>
      <CommentItem
          v-for="comment in comments"
          :key="comment.commentNo"
          :postStatus="postStatus"
          :comment="comment"
          :postNo="postNo"
          @commentAdded="handleCommentAdded"
          @commentUpdated="fetchComments"
          @commentDeleted="handleCommentDeleted"
      />
    </div>
    <Pagination
      v-if="comments.length > 0"
      :pageInfo="pageInfo"
      @change-page="setPage"
    />
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import apiClient from '@/api';
import CommentItem from '@/views/post/comment/CommentItem.vue';
import Pagination from '@/components/common/Pagination.vue';
const emit = defineEmits(['commentDeleted']);
const props = defineProps({
  postNo: Number,
  postStatus: String
});



const comments = ref([]);
const sortOption = ref('NEW');
const pageInfo = ref({
  currentPage: 1,
  totalCount: 0,
  pageLimit: 10,
  listLimit: 10
});

const fetchComments = async () => {

  if (!props.postNo) {
    console.error('postNo가 존재하지 않습니다.');
    return;
  }



  const params = {
    commentSortOption: sortOption.value,
    page: pageInfo.value.currentPage - 1,
    size: pageInfo.value.listLimit
  };

  try {
    const response = await apiClient.get(`/posts/${props.postNo}/comments`, { params });
    if (response.status === 200) {
      comments.value = response.data.content || [];
      pageInfo.value.totalCount = response.data.totalElements || 0;

      comments.value.forEach(comment => {
        const likeState = localStorage.getItem(`like_${comment.commentNo}`);
        if (likeState !== null) {
          comment.liked = likeState === 'true';
        }
      });
    }
  } catch (error) {
    console.error('댓글 불러오기 실패:', error);
    comments.value = [];
    pageInfo.value.totalCount = 0;
  }
};

defineExpose({
  fetchComments
});

const setPage = ({ page }) => {
  if (page >= 1 && page <= Math.ceil(pageInfo.value.totalCount / pageInfo.value.listLimit)) {
    pageInfo.value.currentPage = page;
    fetchComments();
  }
};


const handleCommentAdded = (newComment) => {
  if (sortOption.value === 'NEW' && pageInfo.value.currentPage === 1) {
    comments.value.unshift(newComment);
  }
  pageInfo.value.totalCount += 1;
};


const handleCommentDeleted = (deletedCommentNo) => {
  comments.value = comments.value.filter(comment => comment.commentNo !== deletedCommentNo);
  pageInfo.value.totalCount -= 1;
  emit('commentDeleted', deletedCommentNo);
  fetchComments();
};


watch(() => props.postNo, fetchComments);
onMounted(fetchComments);
</script>

<style scoped>
@import url('https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css');
.sort-option {
  margin-bottom: 10px;
}

.comment-none{
  display: flex;
  height: 100px;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
  color: #353535;
}
</style>
