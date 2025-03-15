mport axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'http://183.99.3.15:8087'  // 배포 환경
    : 'http://localhost:8087';    // 개발 환경

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
