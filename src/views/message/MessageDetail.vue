<template>
    <div class="message-details">
        <h1>쪽지 내용</h1>
        <div v-if="message" class="message-content">
            <p><strong>보낸 사람:</strong> {{ message.senderUsername }}</p>
            <p><strong>받는 사람:</strong> {{ message.receiverUsername }}</p>
            <p><strong>{{ isSender ? '보낸 시간' : '받은 시간' }}:</strong> {{ formatDate(message.sendAt) }}</p>
            <p><strong>내용:</strong><br />{{ message.content }}</p>

            <!-- 가입 수락/거절 버튼 (팀장이 받은 쪽지일 때만) -->
            <div v-if="isTeamJoinRequest" class="actions">
                <button @click="acceptRequest">가입 수락</button>
                <button @click="rejectRequest">가입 거절</button>
            </div>

            <div class="actions">
                <button @click="deleteMessage">삭제</button>
            </div>
        </div>
        <div v-else>
            <p>쪽지를 불러오는 중...</p>
        </div>
    </div>
</template>
<script setup>
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
    padding: 20px;
}

.message-content {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
    white-space: pre-wrap;
}

.actions {
    margin-top: 20px;
}

button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

button:hover {
    background-color: darkred;
}
</style>