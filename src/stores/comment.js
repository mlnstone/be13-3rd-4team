import {defineStore} from "pinia";
import axios from 'axios';
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import dayjs from 'dayjs';
import CommentItem from "@/views/post/comment/CommentItem.vue";
import Pagination from "@/components/common/Pagination.vue";



export const useCommentStore = defineStore('comment', () => {
 
 // CommentList.vue -----------------------------------------
  
  
  const comments = ref([]);
  const sortOption = ref("NEW");  // 기본 정렬 옵션(최신순)

  const pageInfo = reactive({
    currentPage: 1,
    totalCount: 0,
    pageLimit: 10,
    listLimit: 10
  });

  // 댓글 가져오기 (정렬 기능 추가)
  const fetchComments = async (postNo) => {
    const params = {
      commentSortOption: sortOption.value || "NEW",  // 기본 정렬 옵션 추가
      page: pageInfo.currentPage - 1, // 첫 페이지 초기화
      size: pageInfo.listLimit  // 페이지당 댓글 수
    };

    try {
      const response = await axios.get(`http://localhost:8087/posts/${postNo}/comments`, { params });

      if (response.status === 200) {
        comments.value = response.data.content || [];
        pageInfo.totalCount = response.data.totalElements || 0;

        // 사용자가 좋아요 누른 상태 복원
        comments.value.forEach(comment => {
          const likeState = localStorage.getItem(`like_${comment.commentNo}`);
          if (likeState !== null) {
            comment.liked = likeState === "true";
          }
        });

      } else {
        alert("댓글 조회 실패");
      }
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
      comments.value = [];
      pageInfo.totalCount = 0;
    }
  };

  // 페이지 설정
  const setPage = ({ page, totalPages }) => {
    if (page >= 1 && page <= totalPages) {
      pageInfo.currentPage = page;
      fetchComments();
    }
  };

  // 댓글 추가 시 처리
  const handleCommentAdded = (newComment) => {
    comments.value.unshift(newComment);  // 추가된 댓글을 최상단에 추가
    pageInfo.totalCount += 1;
    fetchComments();
  };

  // 댓글 삭제 시 처리
  const handleCommentDeleted = (deletedCommentNo) => {
    comments.value = comments.value.filter(comment => comment.commentNo !== deletedCommentNo);
    pageInfo.totalCount -= 1;
  };


  //CommentCreate.vue ------------------------------------------------------

  async function submitComment() {
    console.log(' postNo 값:', this.postNo);
    console.log(' 댓글 내용:', this.commentContent);

    if (!this.commentContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      const authStore = useAuthStore();
      const token = authStore.getUserInfo()?.accessToken;

      if (!token) {
        alert("로그인 상태를 확인해주세요.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8087/posts/${this.postNo}/comments`,
        { postNo: this.postNo,
          content: this.commentContent },
        { headers: { Authorization: `Bearer ${token}` } });

      // 보낸 댓글 콘솔에서 확인 가능
      console.log('응답 데이터:', response.data);

      this.$emit("commentAdded", response.data);

      this.$emit('updateTotalPages');

      this.commentContent = '';

    } catch (error) {
      console.error('댓글 작성 실패:', error.response?.data || error.message);
      alert("댓글 작성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  }
  
  // CommentItem.vue ------------------------------------------------------------
  const commentStore = useCommentStore();

  // 댓글 삭제
  async function deleteComment() {
    const deletedCommentNo = await commentStore.deleteComment(this.comment);
    if (deletedCommentNo) {
      this.$emit('commentDeleted', deletedCommentNo);
    }
  }
  //
  // 댓글 수정 모드 활성화
  function toggleEdit(comment, context) {
    context.editMode = true;
    context.editedContent = comment.content; // 기존 댓글 내용 복사
    context.originalContent = comment.content;
  }

  // 댓글 수정 취소
  function cancelEdit(context) {
    context.editMode = false;  // 수정 모드 종료
    context.editedContent = context.originalContent; // 원본 댓글 복원
  }
  // 댓글 수정 
  async function updateComment() {
    const success = await commentStore.updateComment(this.comment, this.editedContent);
    if (success) {
      this.editMode = false;
      this.$emit('commentUpdated');
    }
  }
  // 좋아요 생성/삭제
  const toggleLike = async (comment, postNo) => {
    const previousState = comment.liked;
    comment.liked = !previousState;
    comment.likeCount += previousState ? -1 : 1;

    if (!comment.commentNo || !comment.postNo) {
      alert("댓글 정보가 잘못되었습니다. 다시 시도해주세요.");
      return;
    }

    try {
      const authStore = useAuthStore();
      const response = await axios.post(`http://localhost:8087/comments/${comment.commentNo}/like`,
        { postNo },
        {
          headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
          }
        });

      if (response.data !== "좋아요 성공적") {
        comment.liked = false;
      }

      localStorage.setItem(`like_${comment.commentNo}`, comment.liked.toString());
    } catch (error) {
      console.error("[디버깅] 좋아요 요청 실패:", error);
      comment.liked = previousState;
      comment.likeCount += previousState ? 1 : -1;
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
  };
  
  
  
  
  

  return {
    comments,
    sortOption,
    pageInfo,
    fetchComments,
    setPage,
    handleCommentAdded,
    handleCommentDeleted,
    deleteComment,
    toggleEdit,
    cancelEdit,
    updateComment,
    toggleLike,
    formatDate
  };
});
