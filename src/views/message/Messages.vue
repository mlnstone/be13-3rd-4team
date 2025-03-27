<template>
  <div class="message-list">
    <h2 class="title">쪽지 목록</h2>
    <div class="tab-container">
      <button 
        @click="loadMessages('received')" 
        :class="['tab-button', { active: currentTab === 'received' }]">
        받은 쪽지 
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </button>
      <button 
        @click="loadMessages('sent')" 
        :class="['tab-button', { active: currentTab === 'sent' }]">
        보낸 쪽지
      </button>
      <router-link to="/messages/add">
        <button class="tab-button">쪽지 보내기</button>
      </router-link>
    </div>

    <div v-if="messages.length === 0" class="no-message">쪽지가 없습니다.</div>
    <div v-else>
      <div v-for="message in messages" :key="message.no" class="message-item">
        <div class="message-header">
          <div class="sender-receiver">
            <span>보낸 사람: {{ message.senderUsername }}</span>
            <span>받는 사람: {{ message.receiverUsername }}</span>
          </div>
          <span class="date">{{ formatDate(message.sendAt) }}</span>
          <router-link :to="`/messages/${message.no}`">
            <p :class="['message-content', message.read ? 'read' : 'unread']">
              {{ message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content }}
            </p>
          </router-link>
        </div>
        <div class="message-actions">
          <button class="delete-btn" @click="deleteMessage(message.no)">삭제</button>
        </div>
      </div>

      <div class="pagination">
        <button @click="loadMessages(currentTab, currentPage - 1)" :disabled="currentPage === 1">〈</button>
        <button 
          v-for="page in pageRange" :key="page" 
          @click="loadMessages(currentTab, page)" 
          :class="{ active: currentPage === page }">
          {{ page }}
        </button>
        <button @click="loadMessages(currentTab, currentPage + 1)" :disabled="currentPage === totalPages">〉</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';

const router = useRouter();
const route = useRoute();

const messages = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const currentTab = ref('received');
const unreadCount = ref(0);
const perPage = 10;

const loadMessages = async (type = currentTab.value, page = 1) => {
  try {
    const response = await apiClient.get(`/messages?type=${type}&page=${page - 1}&size=${perPage}&sort=no,desc`);

    console.log(response);
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
  await loadMessages(currentTab.value, currentPage.value);
  await getUnreadMessages(); // 💡 삭제 후 읽지 않은 쪽지 수 갱신
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
.message-list {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background-color: #fefefe;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 8px;
}

.title {
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 700;
}

.tab-container {
  display: inline-flex;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  margin-bottom: 15px;
}

.tab-button {
  border: none;
  background-color: transparent;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease-in-out;
}

.tab-button.active {
  background-color: #3b82f6;
  color: white;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.tab-button:hover {
  background-color: #3274e0;
}

.unread-badge {
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 7px;
  border-radius: 999px;
  margin-left: 4px;
}

.no-message {
  text-align: center;
  color: #6b7280;
  margin: 20px 0;
}

.message-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: #f9fafb;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}

.message-header {
  flex: 1;
}

.sender-receiver {
  display: flex;
  gap: 15px;
  font-weight: 500;
  color: #374151;
}

.date {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.message-content {
  margin-top: 8px;
  font-size: 14px;
}

.message-content.unread {
  color: #2563eb;
}

.message-content.read {
  color: #6b7280;
}

.message-actions {
  display: flex;
  align-items: center;
}

.delete-btn {
  padding: 6px 12px;
  font-size: 13px;
  color: white;
  background-color: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.delete-btn:hover {
  background-color: #dc2626;
}

.delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 6px rgba(220,38,38,0.6);
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  margin: 0 4px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #e5e7eb;
}

.pagination button.active {
  background-color: #3b82f6;
  color: white;
}

.pagination button:disabled {
  cursor: not-allowed;
  color: #9ca3af;
}
</style>
