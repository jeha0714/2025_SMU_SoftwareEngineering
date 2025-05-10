// src/api/axios.ts
import axios from "axios";

const umcServerNoAuth = axios.create({
  baseURL: "http://localhost:8080", // 테스트용 백엔드 URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default umcServerNoAuth;
