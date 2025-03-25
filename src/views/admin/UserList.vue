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
}

h2 {
  text-align: center;
  margin: 20px 0;
}

label {
  margin-right: 10px;
}

select {
  margin-bottom: 15px;
}

th, td {
  padding: 10px;
  text-align: center;
}

th {
  background-color: grey;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
}

.pagination button.active {
  background-color: #4c6ef5;
  color: white;
}

.role-badge.admin {
  background-color: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
}

.role-badge.user {
  background-color: #15aabf;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
}
</style>
