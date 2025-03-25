import apiClient from "@/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

export const useReportStore = defineStore('report', () => {

  const router = useRouter();

  // 리포트 상태 관리
  const reports = ref([]);
  const reportDetail = ref({});
  const pageInfo = reactive({
    currentPage: 1,
    totalCount: 0,
    pageLimit: 10,
    listLimit: 10
  });

  // 리포트 목록 조회
  const fetchReports = async (params = {}) => {
    try {
      const response = await apiClient.get('/reports', { params });

      if (response.status === 200) {
        reports.value = response.data.content || [];
        pageInfo.totalCount = response.data.totalElements || 0;
      } else {
        alert("리포트 조회 실패");
      }
    } catch (error) {
      console.error("리포트 조회 실패:", error);
      reports.value = [];
    }
  };

  // 특정 리포트 조회
  const fetchReportDetail = async (reportId) => {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);

      if (response.status === 200) {
        reportDetail.value = response.data;
      } else {
        alert("리포트 조회 실패");
      }
    } catch (error) {
      console.error("리포트 상세 조회 실패:", error);
    }
  };

  // 리포트 추가
  const addReport = async (reportData) => {
    try {
      const response = await apiClient.post('/reports', reportData);

      if (response.status === 201) {
        alert("리포트가 성공적으로 등록되었습니다.");
        router.push({ name: 'reports' });
      }
    } catch (error) {
      console.error("리포트 등록 실패:", error);
      alert("리포트 등록 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  // 리포트 수정
  const updateReport = async (reportId, updatedData) => {
    try {
      const response = await apiClient.put(`/reports/${reportId}`, updatedData);

      if (response.status === 200) {
        alert("리포트가 성공적으로 수정되었습니다.");
        router.push({ name: 'reportDetail', params: { reportId } });
      }
    } catch (error) {
      console.error("리포트 수정 실패:", error);
      alert("리포트 수정 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  // 리포트 삭제
  const deleteReport = async (no) => {
    try {
      const response = await apiClient.delete(`/reports/${no}`);

      if (response.status === 200) {
        alert('정상적으로 삭제되었습니다.');

        fetchReports(pageInfo.currentPage);
      }
    } catch (error)  {

    }
  };

  return {
    reports,
    reportDetail,
    pageInfo,
    fetchReports,
    fetchReportDetail,
    addReport,
    updateReport,
    deleteReport
  };
});