import { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { IconType } from "react-icons/lib";

interface props {
  formName: "id" | "password" | "verifyPassword" | "nickname";
  type: string;
  placeholder: string;
  icon: IconType | null;
  error: string;
  touched: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputForm({
  formName,
  type,
  placeholder,
  icon: Icon,
  error,
  touched,
  onChange,
}: props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const showError = error && touched;

  return (
    <div className="mb-4 w-full">
      <div
        className={`relative flex items-center border rounded-lg overflow-hidden ${
          showError
            ? "border-red-500"
            : "border-gray-300 focus-within:border-pink-500"
        }`}
      >
        {!Icon ? (
          <></>
        ) : (
          <div className="flex items-center justify-center px-3 text-gray-500">
            <Icon size={20} />
          </div>
        )}
        <input
          name={formName}
          type={inputType}
          className="w-full py-3 px-2 outline-none text-gray-700"
          placeholder={placeholder}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
          </button>
        )}
      </div>
      {showError && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
}
