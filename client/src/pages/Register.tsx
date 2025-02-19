import Button from "@/components/Button/Button";
import BasicInput from "@/components/Input/BasicInput";
import React, { useState, useEffect } from "react";

interface RegisterFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  verificationCode: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  verificationCode?: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    passwordConfirm: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isEmailVerificationRequested, setIsEmailVerificationRequested] =
    useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Timer handling
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      setTimerId(timer);
      return () => clearTimeout(timer);
    } else if (
      timeRemaining === 0 &&
      isEmailVerificationRequested &&
      !isEmailVerified
    ) {
      setIsEmailVerificationRequested(false);
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증 시간이 만료되었습니다. 다시 인증해주세요.",
      }));
    }
  }, [timeRemaining, isEmailVerificationRequested, isEmailVerified]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "비밀번호를 입력해주세요." }));
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[#$@!^\*]).{10,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "비밀번호는 영문 대/소문자, 특수문자를 포함하여 10자리 이상이어야 합니다.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: undefined }));
    return true;
  };

  const validatePasswordConfirm = (
    password: string,
    passwordConfirm: string
  ): boolean => {
    if (!passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: "비밀번호를 입력해주세요.",
      }));
      return false;
    }
    if (password !== passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: "비밀번호가 일치하지 않습니다.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    return true;
  };

  const validateVerificationCode = (code: string): boolean => {
    if (!code) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return false;
    }
    if (!/^\d{6}$/.test(code)) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "잘못된 인증번호입니다.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, verificationCode: undefined }));
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset email verification if email changes
    if (name === "email" && isEmailVerificationRequested) {
      setIsEmailVerificationRequested(false);
      setIsEmailVerified(false);
      setTimeRemaining(0);
      if (timerId) clearTimeout(timerId);
    }
  };

  const handleEmailVerificationRequest = async () => {
    if (!validateEmail(formData.email)) return;

    try {
      // API call would go here
      setIsEmailVerificationRequested(true);
      setTimeRemaining(180); // 3 minutes
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일 인증 요청에 실패했습니다.",
      }));
    }
  };

  const handleVerificationCodeSubmit = async () => {
    if (!validateVerificationCode(formData.verificationCode)) return;

    try {
      // API call would go here
      setIsEmailVerified(true);
      setTimeRemaining(0);
      if (timerId) clearTimeout(timerId);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "잘못된 인증번호입니다.",
      }));
    }
  };

  const handleRegister = async () => {
    const isPasswordValid = validatePassword(formData.password);
    const isPasswordConfirmValid = validatePasswordConfirm(
      formData.password,
      formData.passwordConfirm
    );

    if (!isEmailVerified || !isPasswordValid || !isPasswordConfirmValid) {
      return;
    }

    try {
      // API call would go here
      // Redirect to login page on success
      window.location.href = "/login";
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: "회원가입에 실패했습니다." }));
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-6">
      <div className="flex gap-4">
        <BasicInput
          label="이메일"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        <Button
          onClick={handleEmailVerificationRequest}
          disabled={isEmailVerified}
        >
          {isEmailVerificationRequested ? "인증번호 확인" : "이메일 인증 요청"}
        </Button>
      </div>

      {isEmailVerificationRequested && !isEmailVerified && (
        <div className="flex gap-4">
          <BasicInput
            label="인증번호"
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleInputChange}
            error={errors.verificationCode}
            helperText={
              timeRemaining > 0 ? formatTime(timeRemaining) : undefined
            }
            required
          />
          <Button
            onClick={handleVerificationCodeSubmit}
            disabled={!timeRemaining}
          >
            확인
          </Button>
        </div>
      )}

      <BasicInput
        label="비밀번호"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
      />

      <BasicInput
        label="비밀번호 확인"
        type="password"
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={handleInputChange}
        error={errors.passwordConfirm}
        required
      />

      <Button onClick={handleRegister} disabled={!isEmailVerified}>
        회원등록
      </Button>
    </div>
  );
};

export default Register;
