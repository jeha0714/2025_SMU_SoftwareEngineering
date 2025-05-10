import { ReactNode } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    checkPassword: z.string(),
    nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.checkPassword, {
    path: ["checkPassword"], // 어떤 필드에 에러를 표시할지
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const AuthFormProvider = ({ children }: { children: ReactNode }) => {
  // { values, errors, touched, getInputOption }

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      checkPassword: "",
      nickname: "",
    },
    mode: "onChange",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
