import { createContext, ReactNode, useContext } from "react";
import { UserSigninInfo, validateSignin } from "../utils/validate";
import useCustomForm from "../hooks/useCustomForm";

interface ISignupContext {
  values: UserSigninInfo;
  errors: Record<string, string> | undefined;
  touched: Record<string, boolean> | undefined;
  getInputOption: (name: keyof UserSigninInfo) => {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
}

const SignupContext = createContext<ISignupContext | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const { values, errors, touched, getInputOption } =
    useCustomForm<UserSigninInfo>({
      initialValue: {
        email: "",
        password: "",
        checkPassword: "",
        nickname: "",
      },
      validate: validateSignin,
    });

  return (
    <SignupContext.Provider value={{ values, errors, touched, getInputOption }}>
      {children}
    </SignupContext.Provider>
  );
};

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("Signup context Error!");
  }

  return context;
}
