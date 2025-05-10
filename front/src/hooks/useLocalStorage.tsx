import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬 스토리지에서 값을 가져오거나 초기값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    console.log("??");
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("로컬 스토리지에서 값을 가져오는 중 오류 발생:", error);
      return initialValue;
    }
  });

  // 값이 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("로컬 스토리지에 값을 저장하는 중 오류 발생:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
