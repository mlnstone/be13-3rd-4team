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
import { ref, onMounted } from 'vue';
import apiClient from '@/api';
import { eventBus } from '@/utils/eventBus';
import { useAuthStore } from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'; // ✅ jwt-decode import

// ✅ accessToken에서 username 뽑기
const authStore = useAuthStore();

const accessToken = authStore.getUserInfo().accessToken;
const decoded = jwtDecode(accessToken);
const username = decoded.username;

const notifications = ref([])

onMounted(async () => {
  console.log(decoded);
  try {
    const res = await apiClient.get(`/notifications?username=${username}`);
    notifications.value = res.data;

    const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_BASE_URL}/notifications/subscribe?username=${username}`);
    eventSource.addEventListener('notification', (event) => {
      const newNoti = JSON.parse(event.data);
      notifications.value.push(newNoti)

      eventBus.emit('new-notification');
      console.log('📡 이벤트 전송됨: new-notification')
    })
  } catch (error) {

    console.log('에러 발생 : ');
    console.log(error);
  }
});

const markAsRead = async (id) => {
  await apiClient.post(`/notifications/${id}/read?username=${username}`);
  notifications.value = notifications.value.filter(n => n.id !== id)
}
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