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
import { ref, onMounted, onUnmounted } from 'vue';
import apiClient from '@/api';
import { eventBus } from '@/utils/eventBus';
import { useAuthStore } from '@/stores/auth';

const notifications = ref([]);
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const username = userInfo.username;
let eventSource = null;

const fetchNotifications = async () => {
  try {
    const res = await apiClient.get(`/notifications?username=${username}`);
    console.log('fetchNotifications : ');
    console.log(res);
    notifications.value = res.data;
  } catch (error) {
    console.error('🔴 알림 가져오기 실패:', error);
  }
};

const subscribeNotifications = () => {
  if (eventSource) {
    eventSource.close();
  }
  eventSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/notifications/subscribe?username=${username}`);
  eventSource.addEventListener('notification', (event) => {
    const newNoti = JSON.parse(event.data);
    notifications.value.push(newNoti);
    console.log('📩 새 알림:', newNoti);
    eventBus.emit('new-notification');
  });
};

const markAsRead = async (id) => {
  try {
    await apiClient.post(`/notifications/${id}/read?username=${username}`);
    notifications.value = notifications.value.filter(n => n.id !== id);
  } catch (error) {
    console.log('알림');
    console.error('🔴 알림 읽음 처리 실패:', error);
  }
};

onMounted(() => {
  fetchNotifications();
  subscribeNotifications();
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
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
  list-style-position: inside; /* ● 을 안쪽에 표시 */
  padding-left: 0; /* 기본 여백 제거 */
  margin: 0;
}

.notification-item {
  list-style-type: disc; /* ● 표시 */
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