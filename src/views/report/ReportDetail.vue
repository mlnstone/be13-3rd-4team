<template>
  <div class="container">
    <h2 class="title">신고 처리</h2>
    <div v-if="report" class="report-card">
      <div class="field">
        <h3>신고 번호: {{ report.no }}</h3>
      </div>
      <div class="field"><strong>신고자 ID:</strong> {{ report.reporterUsername }}</div>
      <div class="field"><strong>신고 대상 ID:</strong> {{ report.reportedUsername }}</div>
      <div class="field"><strong>신고 타입:</strong> {{ report.reportType }}</div>

      <div class="field">
        <strong>신고 상태:</strong>
        <select v-model="reportStatus" class="select">
          <option v-for="status in reportStatuses" :key="status" :value="status">
            {{ getStatusText(status) }}
          </option>
        </select>
      </div>

      <div class="field"><strong>신고 내용:</strong>
        <div class="value-box">{{ report.content }}</div>
      </div>

      <div class="field">
        <strong>관리자 메모:</strong>
        <textarea v-model="reportComment" class="textarea" placeholder="관리자 메모를 입력하세요"></textarea>
      </div>

      <div class="field">
        <strong>신고 URL:</strong>
        <a :href="getFullUrl(report.url)" target="_blank" rel="noopener noreferrer">
          {{ report.url }}
        </a>
      </div>
      <div class="field"><strong>등록일:</strong> {{ formatDate(report.reportTime) }}</div>
      <div class="field"><strong>신고 처리일:</strong> {{ report.commentTime ? formatDate(report.commentTime) : '처리 중' }}
      </div>

      <button @click="updateReport" class="update-button">수정 등록</button>
    </div>
    <div v-else class="loading">신고 상세 정보를 불러오는 중입니다...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/api';

const route = useRoute();
const reportNo = route.params.no;

const report = ref(null);
const reportStatuses = ref(['PENDING', 'COMPLETED', 'ONLY_BANNED', 'BANNED']);
const reportStatus = ref('PENDING');
const reportComment = ref('');

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '대기 중',
    'COMPLETED': '처리 완료',
    'ONLY_BANNED': '부분 차단',
    'BANNED': '완전 차단'
  };
  return statusMap[status] || status;
};
const getFullUrl = (url) => {
  if (!url) return '#';
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : 'http://' + url;
};
const fetchReportDetail = async () => {
  if (!reportNo) return;

  try {
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await apiClient.get(`/reports/${reportNo}`, config);
    report.value = response.data;
    reportStatus.value = report.value.reportStatus;
    reportComment.value = report.value.comment;
  } catch (error) {
    console.error("신고 상세 정보를 불러오는 데 실패했습니다.", error);
  }
};

const updateReport = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      }
    };

    const updateData = {
      comment: reportComment.value,
      status: reportStatus.value,
    };

    const response = await apiClient.put(`/reports/${reportNo}`, updateData, config);
    console.log("신고 수정 성공:", response.data);
    alert("수정된 신고 내용이 저장되었습니다.");
  } catch (error) {
    console.error("신고 수정 실패:", error);
    alert("수정하는 데 실패했습니다.");
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('ko-KR', options);
};

onMounted(fetchReportDetail);
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 30px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.title {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
}

.report-card {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field {
  font-size: 16px;
  color: #444;
}

.select {
  padding: 8px;
  font-size: 14px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  resize: vertical;
}

.value-box {
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 5px;
}

.update-button {
  align-self: flex-end;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.update-button:hover {
  background-color: #125a9c;
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #666;
}
</style>