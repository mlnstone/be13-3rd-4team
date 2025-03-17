import axios from "axios";

// axios 기본 설정
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// 요청 인터셉터 추가
axios.interceptors.request.use(
  (config) => {
    // sessionStorage에서 토큰 가져오기
    const token = sessionStorage.getItem("accessToken");
    // 토큰이 존재하면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log(process.env.VUE_APP_API_BASE_URL);

export default axios;
