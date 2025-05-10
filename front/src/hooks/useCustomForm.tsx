import { useEffect, useState } from "react";

interface UseCustomFormProps<T> {
  initialValue: T; // {email: '', password: ''}
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

export default function useCustomForm<T>({
  initialValue,
  validate,
}: UseCustomFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>();
  const [touched, setTouched] = useState<Record<string, boolean>>();

  function getInputOption(name: keyof T) {
    const value = values[name];

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      setValues({
        ...values,
        [name]: event.target.value,
      });
    }

    const onBlur = () => {
      setTouched({
        ...touched,
        [name]: true,
      });
    };

    return { value, onChange, onBlur };
  }

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values, validate]);

  return { values, errors, touched, getInputOption };
}
