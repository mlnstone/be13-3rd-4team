import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://183.99.3.15:8087", // 기본값 설정
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"  // 응답 데이터 타입 명시
  },
  withCredentials: true // CORS 요청 시 인증정보 포함
});

export default api;
