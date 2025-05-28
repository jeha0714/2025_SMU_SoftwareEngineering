import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { vocaServerNoAuth } from "../utils/axiosInfo";

export default function SignupPage() {
  const navigate = useNavigate();

  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    nickname: "",
    id: "",
    password: "",
    verifyPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    nickname: "",
    id: "",
    password: "",
    verifyPassword: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    nickname: false,
    id: false,
    password: false,
    verifyPassword: false,
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
    } else if (name === "nickname") {
      if (!value) {
        error = "닉네임을 입력해주세요";
      } else if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) {
        error = "닉네임은 5~20자의 영문자, 숫자만 사용 가능합니다";
      }
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
    } else if (name === "verifyPassword") {
      if (value !== formValues.password) {
        error = "비밀번호가 일치하지 않습니다";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  // API mutation setup with React Query
  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: (data: { nickname: string; id: string; password: string }) =>
      vocaServerNoAuth.post("/users/join", {
        nickName: data.nickname,
        userId: data.id,
        userPassword: data.password,
      }),
    onSuccess: (response) => {
      // 성공적인 가입 후 처리
      console.log("가입 성공", response.data);
      alert("회원가입 성공!");
      navigate("/signin"); // 로그인 페이지로 리디렉션
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Register failed:", error);
      if (error.response?.data?.message) {
        setStatusError(error.response.data.message);
      } else {
        setStatusError("회원가입 중 오류가 발생했습니다.");
      }
    },
  });
  // Form submission handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusError(null); // 이전 오류 상태 초기화
    setIsSubmitted(true); // 제출 시 true

    // 모든 필드를 터치 처리
    setTouchedFields({
      nickname: true,
      id: true,
      password: true,
      verifyPassword: true,
    });

    // 에러가 있으면 API 호출하지 않고 리턴
    if (!isFormValid) {
      setStatusError("모든 입력값을 올바르게 입력해주세요.");
      return;
    }

    signupMutate(formValues);
  };

  const isFormValid =
    Object.values(formErrors).every((err) => err === "") &&
    Object.values(formValues).every((val) => val !== "");

  return (
    <article className="w-full h-full flex flex-row items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md flex flex-col">
        <form onSubmit={onSubmit} className="space-y-6">
          <InputForm
            formName="nickname"
            type="text"
            placeholder="Nickname"
            icon={null}
            error={formErrors.nickname}
            touched={touchedFields.nickname.toString()}
            onChange={handleChange}
          />

          <InputForm
            formName="id"
            type="text"
            placeholder="ID"
            icon={null}
            error={formErrors.id}
            touched={touchedFields.id.toString()}
            onChange={handleChange}
          />

          <InputForm
            formName="password"
            type="password"
            placeholder="Pasword"
            icon={null}
            error={formErrors.password}
            touched={touchedFields.password.toString()}
            onChange={handleChange}
          />

          <InputForm
            formName="verifyPassword"
            type="password"
            placeholder="Verify Password"
            icon={null}
            error={formErrors.verifyPassword}
            touched={touchedFields.verifyPassword.toString()}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pink-300"
          >
            {isPending ? "가입 중..." : "회원가입"}
          </button>
          {isSubmitted ? (
            <div className="text-red-500 text-sm mt-1 text-center">
              {statusError}
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </article>
  );
}
