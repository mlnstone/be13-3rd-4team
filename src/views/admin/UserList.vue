<template>
  <div class="user-list-container">
    <h2> 유저 관리 페이지</h2>

    <!-- 🔽 정렬 기준 드롭다운 -->
    <div>
      <label for="sortOption">정렬 기준:</label>
      <select id="sortOption" v-model="sortOption" @change="fetchUsers">
        <option value="LATEST">최신 가입순</option>
        <option value="USERNAME">이름순</option>
        <option value="ROLE">권한순</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>사용자명</th>
          <th>이메일</th>
          <th>역할</th>
          <th>ban 여부</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.username" @click="goToUserDetail(user.userNo)">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td><span :class="['role-badge', user.role.toLowerCase()]">{{ user.role }}</span></td>
          <td>{{ user.banned }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPageGroup" :disabled="pageGroupStart === 1">«</button>
      <button v-for="page in pageNumbers" :key="page" @click="moveToPage(page)" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
      <button @click="nextPageGroup" :disabled="pageGroupEnd >= totalPages">»</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';

const userList = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const pageGroupStart = ref(1);
const pageGroupSize = 10;
const sortOption = ref('LATEST');
const router = useRouter();

const fetchUsers = async () => {
  try {
    const response = await apiClient.get(`/admin/users?page=${currentPage.value - 1}&size=10&sortOption=${sortOption.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    const data = await response.data;
    userList.value = data.content;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error('🚨 유저 목록 가져오기 실패:', error);
  }
};

const pageGroupEnd = computed(() => Math.min(pageGroupStart.value + pageGroupSize - 1, totalPages.value));
const pageNumbers = computed(() => Array.from({ length: pageGroupEnd.value - pageGroupStart.value + 1 }, (_, i) => i + pageGroupStart.value));

const moveToPage = (page) => {
  currentPage.value = page;
  fetchUsers();
};

const prevPageGroup = () => {
  if (pageGroupStart.value > 1) {
    pageGroupStart.value -= pageGroupSize;
    currentPage.value = pageGroupStart.value;
    fetchUsers();
  }
};

const nextPageGroup = () => {
  if (pageGroupEnd.value < totalPages.value) {
    pageGroupStart.value += pageGroupSize;
    currentPage.value = pageGroupStart.value;
    fetchUsers();
  }
};

const goToUserDetail = (userNo) => {
  router.push(`/admin/user/${userNo}`);
};

onMounted(fetchUsers);
</script>
<style scoped>
.user-list-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

label {
  font-weight: 600;
  color: #555;
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

table {
  width: 100%; /* 테이블 전체 너비 지정 */
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

th, td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4c6ef5;
  color: white;
}

tr:hover {
  background-color: #f7faff;
  cursor: pointer;
}

/* 페이징 스타일 개선 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.pagination button {
  padding: 6px 12px;
  margin: 0 3px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #4c6ef5;
  transition: all 0.2s ease;
}

.pagination button.active {
  background-color: #4c6ef5;
  color: white;
}

.pagination button:hover:not(.active):not(:disabled) {
  background-color: #e3edff;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 역할 badge 스타일 개선 */
.role-badge {
  display: inline-block;
  font-size: 0.8rem;
  padding: 3px 10px;
  border-radius: 999px;
}

.role-badge.admin {
  background-color: #ff6b6b;
  color: white;
}

.role-badge.user {
  background-color: #15aabf;
  color: white;
}

</style>