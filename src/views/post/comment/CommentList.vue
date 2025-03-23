<template>

  <div>
    <!-- 댓글 정렬 기능 -->
    <div class="sort-option">
      <select v-model="sortOption" @change="fetchComments">
        <option value="NEW">최신순</option>
        <option value="LIKE">좋아요순</option>
      </select>
    </div>

    <div v-if="comments.length === 0">댓글이 없습니다.</div>
    <div v-else>
      <CommentItem
          v-for="comment in comments"
          :key="comment.commentNo"
          :postStatus="postStatus"
          :comment="comment"
          :postNo="postNo"
          @commentUpdated="fetchComments"
          @commentDeleted="handleCommentDeleted"
      />
    </div>
    <Pagination
      v-if="comments.length > 0"
      :pageInfo="{
        currentPage: pageInfo.currentPage, 
        listLimit: pageInfo.listLimit,     
        pageLimit: pageInfo.pageLimit,      
        totalCount: pageInfo.totalCount     
          }"
      @change-page="setPage"
    />
  </div>
</template>

<script>
import axios from "axios";
import CommentItem from "@/views/post/comment/CommentItem.vue";
import Pagination from "@/components/common/Pagination.vue";
import {ref} from "vue";


export default {
  name: "CommentList",
  components: {Pagination, CommentItem },
  props: {
    postNo: {
      type: Number,
      required: true
    },
    postStatus: {  // 게시글 상태
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      sortOption: "NEW",  // 기본 정렬 옵션(최신순)

      pageInfo: {    
      currentPage: 1,
      totalCount: 0,
      pageLimit: 10,
      listLimit: 10
      }
    };
  },
  mounted() {
    console.log('postNo 확인:', this.postNo);
    this.fetchComments();
  },
  methods: {
    // 댓글 가져오기 메소드 (정렬 기능 추가)
    async fetchComments() {
      const params = {
        commentSortOption: this.sortOption || "NEW",  // 기본 정렬 옵션 추가
        page: this.pageInfo.currentPage - 1, // 첫 페이지 초기화
        size: this.pageInfo.listLimit// 페이지당 댓글 수
      };

      await axios
          .get(`http://localhost:8087/posts/${this.postNo}/comments`, { params })
          .then((response) => {
         

            if (response.status === 200) {
              this.comments = response.data.content || [];
              this.pageInfo.totalCount = response.data.totalElements || 0;
              //  사용자가 좋아요 누를 상태 복원
              this.comments.forEach(comment => {
                const likeState = localStorage.getItem(`like_${comment.commentNo}`);
                if (likeState !== null) {
                  comment.liked = likeState === "true";
                }
              });

            } else {
              alert("댓글 조회 실패");
            }
          })
          .catch((error) => {
            console.error("댓글 불러오기 실패:", error);
            this.comments= [];
            this.pageInfo.totalCount = 0;
          });
    },

    // 페이지 설정
    setPage({ page, totalPages }) {
      
      if (page >= 1 && page <= totalPages) {
        this.pageInfo.currentPage = page;
        this.$router.push({ name: 'postDetail', params: { postNo: this.postNo }, query: { page } }); 
        this.fetchComments();  // 페이지 변경 시 댓글 새로 불러옴
      }
    },

    // 댓글 추가 시 페이지 계산 로직
    handleCommentAdded(newComment) {
     
      this.comments.unshift(newComment);  // 추가된 댓글을 최상단에 추가
      this.pageInfo.totalCount += 1;  
      this.fetchComments();
    },
    // 댓글 삭제 시 리스트에서 제거하고 부모 컴포넌트에 이벤트 전달
    handleCommentDeleted(deletedCommentNo) {
     
      this.comments = this.comments.filter(comment => comment.commentNo !== deletedCommentNo);
      this.pageInfo.totalCount -= 1;  // totalCount 감소 
      this.$emit('commentDeleted');
    }
  }
};
</script>

