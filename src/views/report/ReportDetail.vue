<template>
  <div class="container">
    <h2>신고 처리</h2>
    <div v-if="report">
      <div class="report-info">
        <h3>신고 번호: {{ report.no }}</h3>
        <p><strong>신고자 ID:</strong> {{ report.reporterUsername }}</p>
        <p><strong>신고 대상 ID:</strong> {{ report.reportedUsername }}</p>
        <p><strong>신고 타입:</strong> {{ report.reportType }}</p>

        <p><strong>신고 상태:</strong>
          <select v-model="reportStatus">
            <option v-for="status in reportStatuses" :key="status" :value="status">
              {{ getStatusText(status) }}
            </option>
          </select>
        </p>

        <p><strong>신고 내용:</strong> {{ report.content }}</p>

        <p><strong>관리자 메모:</strong>
          <textarea v-model="reportComment" placeholder="관리자 메모를 입력하세요"></textarea>
        </p>

        <p><strong>신고 URL:</strong> <a :href="report.url" target="_blank">{{ report.url }}</a></p>

        <p><strong>등록일:</strong> {{ formatDate(report.reportTime) }}</p>
        <p><strong>신고 처리일:</strong>
          {{ report.commentTime ? formatDate(report.commentTime) : '처리 중' }}
        </p>

        <button @click="updateReport" class="update-button">수정 등록</button>
      </div>
    </div>
    <div v-else>
      <p>신고 상세 정보를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const reportNo = route.params.no;
const authStore = useAuthStore();

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

const fetchReportDetail = async () => {
  if (!reportNo) {
    console.error("reportNo가 없습니다.");
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await axios.get(`http://localhost:8087/reports/${reportNo}`, config);
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

    const response = await axios.put(`http://localhost:8087/reports/${reportNo}`, updateData, config);
    console.log("신고 수정 성공:", response.data);
    alert("수정된 신고 내용이 저장되었습니다.");
  } catch (error) {
    console.error("신고 수정 실패:", error);
    alert("수정하는 데 실패했습니다.");
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(date).toLocaleString('ko-KR', options);
};

onMounted(fetchReportDetail);
</script>

<style scoped>
.report-info {
  margin-top: 20px;
}
.report-info p {
  font-size: 16px;
  margin: 5px 0;
}
textarea {
  width: 100%;
  height: 80px;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
}
button.update-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button.update-button:hover {
  background-color: #45a049;
}
</style>