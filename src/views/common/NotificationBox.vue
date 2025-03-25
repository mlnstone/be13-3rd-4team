<template>
  <div class="notification-box">
    <h6>🔔 알림 목록</h6>
    <ul v-if="notifications.length > 0">
      <li v-for="noti in notifications" :key="noti.id" class="mb-2">
        {{ noti.message }}
        <button class="btn btn-sm btn-outline-secondary ms-2" @click="markAsRead(noti.id)">읽음</button>
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
const userInfo = authStore.getUserInfo();
const username = userInfo.username;
let eventSource = null;

const fetchNotifications = async () => {
  try {
    const res = await apiClient.get(`/notifications?username=${username}`);
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
  width: 250px;
  padding: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>