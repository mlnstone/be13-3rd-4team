import { useAuthStore } from "@/stores/auth";
import axios from "axios";

// Axios
//  - HTTP 기반 통신을 지원하는 자바스크립트 라이브러리이다.
//  - 브라우저 호환성, JSON 자동 변환 기능 등의 장점을 가지고 있다.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    "Content-Type": "application/json",
    timeout: 10000
});


// Axios 인터셉터
//  - 요청(request) 또는 응답(response)이 처리되기 전에 가로채서 특정 로직을 수행하도록 하는 기능이다.

// 요청(request) 인터셉터
//  - HTTP 요청이 서버로 전송되기 전에 실행된다.
apiClient.interceptors.request.use(
    (config) => {
        if (config._skipInterceptor) {
            return config;
        }

        // 로컬 스토리지에서 accessToken을 가져온다.
        const accessToken = localStorage.getItem('accessToken');
        

        // accessToken 확인 후 Authorization 해더에 accessToken을 추가한다.
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        // 비동기 코드에서 에러를 처리하거나 에러를 즉시 반환할 때 사용한다.
        return Promise.reject(error);
    }
);

// 응답(response) 인터셉터
//  - 서버에서 HTTP 응답이 도착한 후에 실행된다.
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
      console.log('🔹 401 발생 여부:', error.response?.status);
        // 이전 요청에 대한 config 객체를 얻어온다.
        const originalRequest = error.config;
        console.log('에러 응답 구조: ', error.response);

        // 토큰이 만료되어 401 에러가 발생한 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 리프레시 토큰을 사용하여 새 액세스 토큰을 요청한다.
              
                const refreshToken = localStorage.getItem('refreshToken');
                console.log('refreshToken: '+ refreshToken);
                const response = await apiClient.post(
                    '/auth/refresh',
                    null,
                    {
                      headers: {'Authorization': `Bearer ${refreshToken}`},
                      _skipInterceptor: true
                    }
                );

                console.log('새 액세스 토큰 발급 성공');
                console.log(response);
                
                const accessToken = response.data?.accessToken;
              if (!accessToken) {
                throw new Error('새 액세스 토큰 발급 실패');
              }

                // 새 액세스 토큰을 로컬 스토리지에 저장
                localStorage.setItem('accessToken', accessToken);

              //originalRequest의 headers가 undefined인 경우 강제 초기화
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              // 원래 요청에 새 액세스 토큰 추가
              // Authroization 헤더가 없으면 요청 시 액세스 토큰을 발급하지 않음
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
              
                // 원래 요청을 재시도
                return apiClient(originalRequest);
            } catch (error) {
                // 리프레시 토큰이 만료된 경우, 로그아웃 처리
                const authStore = useAuthStore();

                authStore.logout();

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);


export default apiClient;