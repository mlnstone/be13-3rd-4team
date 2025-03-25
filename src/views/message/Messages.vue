<template>
  <div class="message-list">
    <h2>쪽지 목록</h2>
    <div>
      <button @click="loadMessages('received')" :class="{ active: currentTab === 'received' }">
        받은 쪽지 <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </button>
      <button @click="loadMessages('sent')" :class="{ active: currentTab === 'sent' }">보낸 쪽지</button>
      <router-link to="/messages/write">
        <button>쪽지 보내기</button>
      </router-link>
    </div>

    <div v-if="messages.length === 0">쪽지가 없습니다.</div>
    <div v-else>
      <div v-for="message in messages" :key="message.no" class="message-item">
        <div class="message-header">
          <span class="sender">보낸 사람: {{ message.senderId }}</span>
          <span class="receiver">받은 사람: {{ message.receiverId }}</span>
          <span class="date">{{ formatDate(message.sendAt) }}</span>
          <div class="message-content">
            <router-link :to="`/messages/${message.no}`">
              <p :class="message.read ? 'read' : 'unread'">
                {{ message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content }}
              </p>
            </router-link>
          </div>
        </div>
        <div class="message-actions">
          <button class="btn btn-danger" @click="deleteMessage(message.no)">삭제</button>
        </div>
      </div>

      <div class="pagination">
        <button @click="loadMessages(currentTab, currentPage - 1)" :disabled="currentPage === 1">〈</button>
        <button v-for="page in pageRange" :key="page" @click="loadMessages(currentTab, page)" :class="{ active: currentPage === page }">{{ page }}</button>
        <button @click="loadMessages(currentTab, currentPage + 1)" :disabled="currentPage === totalPages">〉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const userInfo = authStore.userInfo;

const messages = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const currentTab = ref('received');
const unreadCount = ref(0);
const perPage = 10;

const loadMessages = async (type = currentTab.value, page = 1) => {
  try {
    const response = await apiClient.get(`/messages?type=${type}&page=${page - 1}&size=${perPage}&sort=no,desc`);

    if (response.status === 200) {
      messages.value = response.data.content;
      currentPage.value = response.data.pageable.pageNumber + 1;
      totalPages.value = response.data.totalPages;
      currentTab.value = type;

      router.push({ query: { type: currentTab.value, page: currentPage.value } });
    }
  } catch (error) {
    console.error('쪽지 목록 불러오기 실패:', error);
    alert('쪽지 목록을 불러오는 데 실패했습니다.');
  }
};

const deleteMessage = async (messageNo) => {
  try {
    const response = await apiClient.delete(`/messages/${messageNo}`);

    if (response.status === 200) {
      alert('쪽지가 삭제되었습니다.');
      loadMessages(currentTab.value, currentPage.value);
    }
  } catch (error) {
    console.error('쪽지 삭제 실패:', error);
    alert('쪽지 삭제 실패');
  }
};

const getUnreadMessages = async () => {
  try {
    const response = await apiClient.get(`/messages-unread`);
    
    if (response.status === 200) {
      unreadCount.value = response.data;
    }
  } catch (error) {
    console.error('안 읽은 쪽지 개수 불러오기 실패:', error);
  }
};

const pageRange = computed(() => {
  const range = [];
  const start = Math.floor((currentPage.value - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, totalPages.value);
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

const formatDate = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  currentPage.value = parseInt(route.query.page, 10) || 1;
  currentTab.value = route.query.type || 'received';
  loadMessages(currentTab.value, currentPage.value);
  getUnreadMessages();
});
</script>

<style scoped>
.message-list { padding: 20px; }
button.active { background-color: #007bff; color: white; }
.message-item { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; display: flex; justify-content: space-between; }
.message-header { display: flex; flex-direction: column; width: 100%; }
.sender, .receiver, .date { font-weight: bold; }
.message-content { margin-top: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.message-actions button { margin-right: 10px; padding: 10px 20px; font-size: 14px; }
.pagination { text-align: center; margin-top: 20px; }
.pagination button { padding: 10px 20px; margin: 0 5px; cursor: pointer; }
.pagination button:disabled { background-color: #ccc; cursor: not-allowed; }
.unread { color: blue; }
.read { color: #6b6b6b; }
.unread-badge { background-color: red; color: white; font-size: 12px; font-weight: bold; padding: 3px 6px; border-radius: 50%; margin-left: 5px; }
</style>
