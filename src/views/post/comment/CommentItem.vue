<template>
  <div class="comment-item">

    <div class="comment-list-box">

      <div class="comment-info-box">

        <p>{{comment.userName}}</p>
        <!-- updatedAt이 존재하면 updatedAt 표시, 없으면 createdAt 표시 -->
        <p>{{ formatDate(comment.updatedAt || comment.createdAt) }}</p>

      </div>

      <!--  댓글 본문을 바로 수정할 수 있음 -->
      <div v-if="editMode">
        <textarea v-model="editedContent" class="edited-content-box"></textarea>
      </div>
      <p v-else>{{ comment.content }}</p>

    </div>


    <!-- 수정/취소 버튼 전환 로직 추가 -->
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
      <!-- 좋아요 버튼 -->
      <button
          @click="toggleLike"
          :class="{ liked: comment.liked }"
          :disabled="postStatus === 'INACTIVE'"
      >
        좋아요 {{ comment.likeCount }}
      </button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from "@/stores/auth.js";
import dayjs from 'dayjs';



export default {
  name: "CommentItem",
  props: {
    comment: { type: Object, required: true },
    postStatus: { type: String, required: true },
    postNo: { type: Number, required: true }
  },
  data() {
    return {
      editMode: false,
      editedContent: '',
      originalContent:'', // 원본 댓글 저장
      currentUsername: null
    };
  },
  watch: {
    comment: {
      handler(newVal) {
        this.editedContent = newVal.content;
        this.originalContent = newVal.content;  // 초기값 저장
        const authStore = useAuthStore();
        this.currentUsername = authStore.getUsernameFromToken();

        // 좋아요 상태 복원
        const likeState = localStorage.getItem(`like_${this.comment.commentNo}`);
        if (likeState !== null) {
          this.comment.liked = likeState === "true";
        }

      },
      immediate: true
    }
  },
  computed: {
    isEditable() {
      return this.comment.userName === this.currentUsername;
    },
    isDeletable() {
      const authStore = useAuthStore();
      const userInfo = authStore.getUserInfo();
      return this.comment.userName === this.currentUsername || userInfo?.role === 'ADMIN';
    }
  },
  mounted() {
    const authStore = useAuthStore();
    
    const userInfo = authStore.getUserInfo();

    if (!userInfo) {
      console.warn("사용자 정보가 없습니다. 로그인 여부를 확인하세요.");
      return;
    }

    this.currentUsername = authStore.getUsernameFromToken();

  },

  methods: {
    async deleteComment() {
      if (!this.isDeletable) {
        alert("해당 댓글 삭제 권한이 없습니다.");
        return;
      }

      if (confirm('정말로 삭제하시겠습니까?')) {
        try {
          const authStore = useAuthStore();
          await axios.delete(`http://localhost:8087/comments/${this.comment.commentNo}`, {
            headers: {
              Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
            }
          });
          this.$emit('commentDeleted', this.comment.commentNo);
        } catch (error) {
          alert('댓글 삭제 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
        }
      }
    },
    toggleEdit() {
      this.editMode = true; // 수정 모드 활성화
      this.editedContent = this.comment.content;  // 원본 내용 복사
    },
    cancelEdit() {  // 추가 (수정 취소 기능)
      this.editMode = false; // 수정 모드 비활성화
      this.editedContent = this.originalContent; // 원래 내용 복원
    },

    async updateComment() {
      try {
        const authStore = useAuthStore();
        const response = await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/update`,
            {content: this.editedContent,
              postNo: this.comment.postNo
            },
            {
          headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        // updatedAt 값을 화면에 반영
        if (response.data.updatedAt) {
          this.comment.updatedAt = response.data.updatedAt;
        }
        this.editMode = false;
        this.$emit('commentUpdated');
      } catch (error) {
        alert('댓글 수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    },
    async toggleLike() {

      const previousState = this.comment.liked;   //  기존 상태 저장
      this.comment.liked = !previousState;        //  즉시 변경
      this.comment.likeCount += previousState ? -1 : 1;  //좋아요 개수 즉시 반영

      if (!this.comment.commentNo || !this.comment.postNo) {
        alert("댓글 정보가 잘못되었습니다. 다시 시도해주세요.");
        return;
      }

      try {

        const authStore = useAuthStore();
        const response = await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/like`,
            {
              postNo: this.postNo
        }, {
          headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
          }
        });

        //  좋아요 상태 및 개수 즉시 업데이트
        console.log("[디버깅] 서버 응답:", response.data);
        if (response.data !== "좋아요 성공적") {
          this.comment.liked = false;
          //서버 응답이 불일치할 경우 상태 복구
        }

        // 사용자 상태를 로컬 스토리지에 저장
        localStorage.setItem(`like_${this.comment.commentNo}`, this.comment.liked.toString());

      } catch (error) {
        console.error("[디버깅] 좋아요 요청 실패:", error);
        this.comment.liked = previousState;  // 오류 시 복구
        this.comment.likeCount += previousState ? 1 : -1;
        alert("좋아요 처리에 실패했습니다.");
      }
    },

    // 날짜 데이터 포멧
    formatDate(dateString) {
      return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
    }

  }
};
</script>

<style scoped>
.comment-item {
  display: block;
  border: 1px solid #e5e7eb;
  padding: 1rem;

}

.comment-info-box{
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  margin-right: 20px;
}

.comment-info-box>p{
  margin-right: 20px;
}


.edited-content-box{
  border : 1px solid #e5e7eb;
  width: 700px;
}


.like-bnt-box{
  display: flex;
  justify-content: flex-end;

}

.like-bnt-box > button {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 3px;

}

.liked {

  color: red;
  font-weight: bold;

}


</style>