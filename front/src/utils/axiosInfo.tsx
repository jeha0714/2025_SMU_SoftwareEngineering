import axios from "axios";
import { signinResponse } from "../types/ServerResponseType";

export const umcServerNoAuth = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}`,
  timeout: 1000,
  headers: { accept: "application/json" },
});

export const umcServerNeedAuth = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}`,
  timeout: 1000,
  headers: { accept: "application/json" },
});

// request 요청 시 accessToken 포함 시키기
// 없다면 error
umcServerNeedAuth.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    // accessToken이 존재할 경우 포함시키기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    // accessTokeN이 없는 경우 에러 발생
    else {
      return Promise.reject(new Error("No accessToken"));
    }
  },
  (error) => {
    // 요청 설정 중 발생한 에러 처리
    return Promise.reject(error);
  }
);

// response 받을 시 accessToken 문제인 경우 처리
umcServerNeedAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status == 401) {
      try {
        // 1. refreshToken 가져오기
        const refreshToken: string | null | undefined =
          localStorage.getItem("refreshToken");

        // 2. refresh 요청 보내기 (header에 넣기)
        const { data }: { data: signinResponse } = await umcServerNoAuth.post(
          `/v1/auth/refresh`,
          { refresh: refreshToken }
        );

        // 3. 새로운 accessToken, refreshToken 저장
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;
        sessionStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // 4. 원래 요청에 새 accessToken 넣기
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 5. 원래 요청 다시 보내서 결과 return
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          return umcServerNeedAuth(originalRequest);
        }
      } catch (refreshError) {
        // Refresh Token도 만료되었을 경우 등
        console.error("토큰 재발급 실패");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
