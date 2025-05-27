import axios from "axios";

export const vocaServerNoAuth = axios.create({
  baseURL: "http://116.36.58.106:9001", // 테스트용 백엔드 URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vocaServerNeedAuth = axios.create({
  baseURL: "http://116.36.58.106:9001", // 테스트용 백엔드 URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// request 요청 시 accessToken 포함 시키기
// 없다면 error
vocaServerNeedAuth.interceptors.request.use(
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
