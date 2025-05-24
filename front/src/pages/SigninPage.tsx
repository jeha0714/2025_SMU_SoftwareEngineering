import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import InputForm from "../components/InputForm";
import { useAuth } from "../context/AuthContext";
import type { AxiosError } from "axios";
import { vocaServerNoAuth } from "../utils/axiosInfo";

export default function SigninPage() {
  const navigate = useNavigate();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    id: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    id: "",
    password: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    id: false,
    password: false,
  });

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 필드가 터치되었음을 표시
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // 유효성 검사
    validateField(name, value);
  };

  // 개별 필드 유효성 검사
  const validateField = (name: string, value: string) => {
    let error = "";

    // XSS 방지를 위한 입력값 정규식: HTML 태그, 스크립트, 이벤트 핸들러 차단
    const xssPattern =
      /<script|on\w+\s*=|javascript:|\b(alert|eval|prompt|confirm)\b/i;
    if (xssPattern.test(value)) {
      error = "입력값에 허용되지 않은 문자가 포함되어 있습니다";
      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else if (name === "id") {
      if (!value) {
        error = "아이디를 입력해주세요";
      } else if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) {
        error = "아이디는 5~20자의 영문자, 숫자만 사용 가능합니다";
      }
    } else if (name === "password") {
      if (!value) {
        error = "비밀번호를 입력해주세요";
      } else if (value.length < 6) {
        error = "비밀번호는 최소 6자 이상이어야 합니다";
      } else if (!/^[a-zA-Z0-9!@#$%^&*()]+$/.test(value)) {
        error = "비밀번호에 허용되지 않은 문자가 포함되어 있습니다";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (data: { id: string; password: string }) =>
      vocaServerNoAuth.post("/users/login", {
        userId: data.id,
        userPassword: data.password,
      }),

    onSuccess: (response) => {
      const accessToken = response.data.result.jwtToken; // jwtToken은 문자열임
      // console.log(response);
      sessionStorage.setItem("accessToken", accessToken);
      login();
      navigate("/");
    },
    onError: (error: AxiosError<{ status: number }>) => {
      console.error("Login failed:", error);
      setStatusError("ID 또는 비밀번호가 틀렸습니다.");
    },
  });

  // Form submission handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusError(null); // 이전 오류 상태 초기화
    setIsSubmitted(true); // 제출 시 true

    // 모든 필드를 터치 처리
    setTouchedFields({
      id: true,
      password: true,
    });

    // 에러가 있으면 API 호출하지 않고 리턴
    if (!isFormValid) {
      setStatusError("모든 입력값을 올바르게 입력해주세요.");
      return;
    }

    loginMutate(formValues);
  };

  const isFormValid =
    Object.values(formErrors).every((err) => err === "") &&
    Object.values(formValues).every((val) => val !== "");

  return (
    <article className="w-full h-full flex flex-row items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">로그인</h1>
          <p className="text-gray-500 mt-2">
            계정에 로그인하여 서비스를 이용하세요
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <InputForm
            formName="id"
            type="text"
            placeholder="아이디를 입력해주세요"
            icon={FaRegUser}
            error={formErrors.id}
            touched={touchedFields.id.toString()}
            onChange={handleChange}
          />

          <InputForm
            formName="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            icon={CiLock}
            error={formErrors.password}
            touched={touchedFields.password.toString()}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pink-300"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
          {!isFormValid && isSubmitted ? (
            <div className="text-red-500 text-sm mt-1 text-center">
              {statusError}
            </div>
          ) : (
            <></>
          )}

          <div className="flex justify-end text-sm mt-4 text-gray-600">
            <p className="mr-3">계정이 없으신가요?</p>
            <button
              type="button"
              className="font-bold hover:text-green-500"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
