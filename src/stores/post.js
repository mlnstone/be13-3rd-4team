import { defineStore } from 'pinia';
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import dayjs from 'dayjs';

export const usePostStore = defineStore('post', () => {
  const comments = reactive([]);
  const pageInfo = reactive({
    currentPage: 1,
    totalCount: 0,
    listLimit: 10
  });

  // 댓글 작성
  const submitComment = async (postNo, commentContent, emit) => {
    console.log(' postNo 값:', postNo);
    console.log(' 댓글 내용:', commentContent);

    if (!commentContent.trim()) {
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

      const response = await apiClient.post(
        `/posts/${postNo}/comments`,
        { postNo, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('응답 데이터:', response.data);

      emit("commentAdded", response.data);
      emit('updateTotalPages');
    } catch (error) {
      console.error('댓글 작성 실패:', error.response?.data || error.message);
      alert("댓글 작성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentNo, emit) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        const authStore = useAuthStore();
        await apiClient.delete(`/comments/${commentNo}`, {
          headers: { Authorization: `Bearer ${authStore.getUserInfo().accessToken}` }
        });

        emit('commentDeleted', commentNo);
      } catch (error) {
        alert('댓글 삭제 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    }
  };

  // 댓글 수정
  const updateComment = async (commentNo, editedContent, emit) => {
    try {
      const authStore = useAuthStore();
      const response = await apiClient.post(
        `/comments/${commentNo}/update`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.updatedAt) {
        comments.forEach(comment => {
          if (comment.commentNo === commentNo) {
            comment.updatedAt = response.data.updatedAt;
          }
        });
      }

      emit('commentUpdated');
    } catch (error) {
      alert('댓글 수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  // 좋아요 기능
  const toggleLike = async (comment, postNo) => {
    const previousState = comment.liked;
    comment.liked = !previousState;
    comment.likeCount += previousState ? -1 : 1;

    try {
      const authStore = useAuthStore();
      const response = await apiClient.post(
        `/comments/${comment.commentNo}/like`,
        { postNo },
        {
          headers: { Authorization: `Bearer ${authStore.getUserInfo().accessToken}` }
        }
      );

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

  // 댓글 가져오기
  const fetchComments = async (postNo) => {
    const params = {
      commentSortOption: "NEW",
      page: pageInfo.currentPage - 1,
      size: pageInfo.listLimit
    };

    try {
      const response = await apiClient.get(`/posts/${postNo}/comments`, { params });

      if (response.status === 200) {
        comments.value = response.data.content || [];
        pageInfo.totalCount = response.data.totalElements || 0;

        comments.forEach(comment => {
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

  // 날짜 포맷 변환
  const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
  };

  return {
    comments,
    pageInfo,
    submitComment,
    deleteComment,
    updateComment,
    toggleLike,
    fetchComments,
    formatDate
  };
});