<!-- Reports.vue -->
<template>
  <div class="container">
    <h2>전체 신고 목록</h2>

    <!-- 검색 바 -->
    <div class="search-container">
      <input type="text" v-model="searchUserId" placeholder="유저 ID 입력" />
      <button @click="searchReports" class="btn btn-primary">검색</button>
      <button @click="fetchReports(1, true)" class="btn btn-secondary">전체보기</button>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>신고 번호</th>
        <th>신고자</th>
        <th>신고 대상</th>
        <th>신고 유형</th>
        <th>상태</th>
        <th>등록일</th>
        <th>상세</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in reports" :key="report.no">
        <td>{{ report.no }}</td>
        <td>{{ report.reporterUsername }}</td>
        <td>{{ report.reportedUsername }}</td>
        <td>{{ report.reportType }}</td>
        <td>{{ getStatusText(report.reportStatus) }}</td>
        <td>{{ report.reportTime }}</td>
        <td><button @click="viewReport(report.no)" class="btn btn-info">상세보기</button></td>
      </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="fetchReports(currentPage - 1)" :disabled="currentPage === 1">〈</button>

      <button
        v-for="page in getPageRange()"
        :key="page"
        @click="fetchReports(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>

      <button @click="fetchReports(currentPage + 1)" :disabled="currentPage === totalPages">〉</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const reports = ref([]);
const totalReports = ref(0);
const currentPage = ref(1);
const perPage = ref(10);
const totalPages = ref(1);
const searchUserId = ref('');
const isSearching = ref(false);

const fetchReports = async (page = 1, reset = false) => {
  try {
    const token = localStorage.getItem('accessToken'); // 확실히 존재하는 토큰
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page: page - 1,
        size: perPage.value,
      }
    };

    let url = ':8087/reports';
    if (isSearching.value && !reset) {
      url = `/reports/user/${searchUserId.value}`;
    } else {
      isSearching.value = false;
      searchUserId.value = '';
    }

    const response = await apiClient.get(url, config);
    reports.value = response.data.content;
    totalReports.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = page;
  } catch (error) {
    console.error("신고 목록 가져오기 실패:", error);
    alert(error.response?.data?.message || '에러 발생');
  }
};

const searchReports = () => {
  if (!searchUserId.value) {
    alert('검색할 유저 ID를 입력하세요.');
    return;
  }
  isSearching.value = true;
  fetchReports(1);
};

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '처리 중',
    'COMPLETED': '처리 완료',
    'ONLY_BANNED': '사용자 밴 (게시글 유지)',
    'BANNED': '사용자 밴 + 모든 작성한 글 삭제',
  };
  return statusMap[status] || status;
};

const getPageRange = () => {
  const range = [];
  const start = Math.floor((currentPage.value - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, totalPages.value);
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
};

const viewReport = (reportNo) => {
  router.push(`/admin/reports/${reportNo}`);
};

onMounted(() => {
  const queryPage = parseInt(route.query.page) || 1;
  currentPage.value = queryPage;
  fetchReports(currentPage.value);
});
</script>
<style>
.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.search-container input {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
  font-size: 0.9rem;
}

.search-container .btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #4c6ef5;
  color: white;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-info {
  background-color: #228be6;
  color: white;
}

.btn-primary:hover {
  background-color: #3b5bdb;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.btn-info:hover {
  background-color: #1c7ed6;
}

.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  color: #444;
}

th {
  background-color: #4c6ef5;
  color: white;
  font-weight: bold;
}

tr:hover {
  background-color: #f7faff;
}

/* 페이징 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 6px;
  flex-wrap: wrap;
}

.pagination button {
  background-color: #4a90e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination button.active {
  background-color: #2b74d8;
  font-weight: bold;
}

.pagination button:hover:not(.active):not(:disabled) {
  background-color: #72a9ee;
}

.pagination button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}</style>