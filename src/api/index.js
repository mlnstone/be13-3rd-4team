import { useAuthStore } from "@/stores/auth";
import axios from "axios";

// Axios
//  - HTTP 기반 통신을 지원하는 자바스크립트 라이브러리이다.
//  - 브라우저 호환성, JSON 자동 변환 기능 등의 장점을 가지고 있다.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    timeout: 2000
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
        // 이전 요청에 대한 config 객체를 얻어온다.
        const originalRequest = error.config;

        console.log(error);

        // 토큰이 만료되어 401 에러가 발생한 경우
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 리프레시 토큰을 사용하여 새 액세스 토큰을 요청한다.
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await apiClient.post(
                    '/api/v1/auth/refresh',
                    null,
                    {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        },
                        _skipInterceptor: true
                    }
                );

                const accessToken = response.data.accessToken;

                // 새 액세스 토큰을 로컬 스토리지에 저장
                localStorage.setItem('accessToken', accessToken);

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