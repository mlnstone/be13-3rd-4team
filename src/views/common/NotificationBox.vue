<template>
  <div class="notification-box">
    <h6>🔔 알림 목록</h6>
    <ul v-if="notifications.length > 0">
      <li
        v-for="noti in notifications"
        :key="noti.id"
        class="mb-2 notification-item"
        @click="markAsRead(noti.id)"
      >
        {{ noti.message }}
      </li>
    </ul>
    <p v-else>새 알림이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import apiClient from '@/api';
import { eventBus } from '@/utils/eventBus';
import { useAuthStore } from '@/stores/auth';

const notifications = ref([]);
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
let eventSource = null;

// 알림 가져오기
const fetchNotifications = async (username) => {
  if (!username) return;
  try {
    const res = await apiClient.get(`/notifications?username=${username}`);
    notifications.value = res.data;
    console.log('✅ 알림 목록:', res.data);
  } catch (error) {
    console.error('🔴 알림 가져오기 실패:', error);
  }
};

// SSE 연결
const subscribeNotifications = (username) => {
  if (!username) return;

  if (eventSource) eventSource.close();

  eventSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/notifications/subscribe?username=${username}`);

  eventSource.onopen = () => {
    console.log('✅ SSE 연결 성공');
  };

  eventSource.addEventListener('notification', (event) => {
    const newNoti = JSON.parse(event.data);
    notifications.value.push(newNoti);
    console.log('📩 새 알림:', newNoti);
    eventBus.emit('new-notification');
  });

  eventSource.onerror = (err) => {
    console.error('🔴 SSE 연결 오류:', err);
    eventSource.close();
  };
};

// 알림 읽음 처리
const markAsRead = async (id) => {
  try {
    await apiClient.post(`/notifications/${id}/read?username=${userInfo.username}`);
    notifications.value = notifications.value.filter(n => n.id !== id);
  } catch (error) {
    console.error('🔴 알림 읽음 처리 실패:', error);
  }
};

// 로그인 성공 이벤트 감지
eventBus.off('login-success'); // 혹은 동일 핸들러 지정 시 자동 제거됨

eventBus.on('login-success', (username) => {
  console.log('🟢 로그인 성공 이벤트 수신:', username);
  fetchNotifications(username);
  subscribeNotifications(username);
});

// 마운트 시 로그인되어 있으면 바로 실행
onMounted(() => {
  if (authStore.isLoggedIn && userInfo.username) {
    fetchNotifications(userInfo.username);
    subscribeNotifications(userInfo.username);
  }
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});

watch(() => authStore.isLoggedIn, (newVal) => {
  if (newVal && userInfo.username) {
    fetchNotifications(userInfo.username);
    subscribeNotifications(userInfo.username);
  }
});
</script>

<style scoped>
.notification-box {
  z-index: 9999;
  background: white;
  border: 1px solid #ccc;
  width: 360px;
  padding: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

ul {
  list-style-position: inside;
  padding-left: 0;
  margin: 0;
}

.notification-item {
  list-style-type: disc;
  padding-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: #f0f4ff;
}
</style>