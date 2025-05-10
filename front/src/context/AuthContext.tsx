import { createContext, ReactNode, useContext, useState } from "react";

interface IAuthContext {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
}

// AccessToken을 통해 User가 접근 가능한지 확인하는 context
// AccessToken을 통해 Login 여부를 확인한다.
const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(() => {
    const accessTokenData = sessionStorage.getItem("accessToken");
    if (accessTokenData) return true;
    return false;
  });

  const login = (): void => {
    setIsLogin(true);
  };

  const logout = (): void => {
    sessionStorage.removeItem("accessToken");
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context Error!");
  }

  return context;
};
