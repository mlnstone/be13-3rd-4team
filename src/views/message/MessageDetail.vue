<template>
  <BackButton />
    <div class="message-details">
        <h1>쪽지 내용</h1>
        <div v-if="message" class="message-content">
            <p><strong>보낸 사람:</strong> {{ message.senderUsername }}</p>
            <p><strong>받는 사람:</strong> {{ message.receiverUsername }}</p>
            <p><strong>{{ isSender ? '보낸 시간' : '받은 시간' }}:</strong> {{ formatDate(message.sendAt) }}</p>
            <p><strong>내용:</strong><br />{{ message.content }}</p>

            <!-- 가입 수락/거절 버튼 (팀장이 받은 쪽지일 때만) -->
            <!-- 가입 수락/거절 버튼 -->
<div v-if="isTeamJoinRequest" class="actions">
    <button class="accept-btn" @click="acceptRequest">가입 수락</button>
    <button class="reject-btn" @click="rejectRequest">가입 거절</button>
</div>

<!-- 삭제 버튼 -->
<div class="actions">
    <button class="delete-btn" @click="deleteMessage">삭제</button>
</div>
        </div>
        <div v-else>
            <p>쪽지를 불러오는 중...</p>
        </div>
    </div>
</template>
<script setup>
import BackButton from '@/components/common/BackButton.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const messageNo = route.params.no;
const message = ref(null);
const isSender = ref(false);
const isTeamJoinRequest = ref(false);

const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const username = userInfo.username;

const fetchMessageDetails = async () => {
    try {
        const response = await apiClient.get(`/messages/${messageNo}`);
        message.value = response.data;

        isSender.value = message.value.senderUsername === username;

        if (message.value.receiverUsername === username && message.value.content.includes('가입 신청')) {
            isTeamJoinRequest.value = true;
        }
    } catch (error) {
        console.error('쪽지 조회 실패:', error);
    }
};

const acceptRequest = async () => {
    const teamNo = extractTeamNoFromMessage(message.value.content);
    const userNo = message.value.senderNo;
    if (!teamNo || !userNo || userNo === -1) {
        alert('유효하지 않은 가입 요청입니다.');
        return;
    }

    try {
        await apiClient.put(`/team/${teamNo}/setting/members/accept/${userNo}`);
        alert('팀 가입을 수락했어요!');
    } catch (err) {
        alert('수락 실패: ' + err.response?.data?.message);
    }
};

const rejectRequest = async () => {
    const teamNo = extractTeamNoFromMessage(message.value.content);
    const userNo = message.value.senderNo;
    if (!teamNo || !userNo || userNo === -1) {
        alert('유효하지 않은 가입 요청입니다.');
        return;
    }

    try {
        await apiClient.put(`/team/${teamNo}/setting/members/delete/${userNo}`);
        alert('팀 가입을 거절했어요!');
    } catch (err) {
        alert('거절 실패: ' + err.response?.data?.message);
    }
};

const extractTeamNoFromMessage = (content) => {
    const match = content.match(/(\d+)\s*팀/);
    return match ? parseInt(match[1]) : null;
};

const deleteMessage = async () => {
    try {
        await apiClient.delete(`/messages/${messageNo}`);

        router.push('/messages/');

        alert('쪽지가 삭제되었습니다');
    } catch (error) {
        console.error('쪽지 삭제 실패:', error);
    }
};

const formatDate = (date) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(date).toLocaleString('ko-KR', options);
};

onMounted(fetchMessageDetails);
</script>

<style scoped>
.message-details {
  max-width: 800px;
  margin: 30px auto;
  background-color: #ffffff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.message-details h1 {
  color: #374151;
  font-weight: 700;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f4ff;
  padding-bottom: 8px;
}

.message-content {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #4b5563;
  line-height: 1.6;
}

.message-content strong {
  font-weight: 600;
  color: #374151;
}

.actions {
  margin-top: 25px;
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.actions button:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.actions button:active {
  transform: scale(0.95);
}

/* 가입 수락 버튼 (파란색) */
.actions button.accept-btn {
  background-color: #3b82f6;
  color: white;
}

.actions button.accept-btn:hover {
  background-color: #2563eb;
}

/* 가입 거절 버튼 (빨간색) */
.actions button.reject-btn {
  background-color: #ef4444;
  color: white;
}

.actions button.reject-btn:hover {
  background-color: #dc2626;
}

/* 삭제 버튼 (주황색) */
.actions button.delete-btn {
  background-color: orangered;
  color: white;
}

.actions button.delete-btn:hover {
  background-color: #e03e00;
}
</style>