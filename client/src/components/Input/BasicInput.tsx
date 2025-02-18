import { useState } from "react";
import BaseInput, { BaseInputProps } from "./BaseInput";
import "./BasicInput.css";

export interface BasicInputProps extends Omit<BaseInputProps, "className"> {
  /** 입력 필드의 라벨 */
  label: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 도움말 아이콘 */
  helperIcon?: React.ReactNode;
  /** 입력 필드의 ID */
  id?: string;
  /** 입력 필드의 너비 */
  width?: string;
  /** 입력 필드의 높이 */
  height?: string;
}

const BasicInput = ({
  label,
  error,
  helperText,
  helperIcon,
  id,
  required,
  disabled,
  width,
  height,
  ...props
}: BasicInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId =
    id || `basic-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      data-testid="basic-input-container"
      className={`basic-input-container ${
        isFocused ? "basic-input-container-focused" : ""
      } ${error ? "basic-input-container-error" : ""}`}
    >
      <label
        htmlFor={inputId}
        className={`basic-input-label ${
          disabled ? "basic-input-label-disabled" : ""
        }`}
      >
        {label}
        {required && (
          <span className="basic-input-required-mark" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div
        className="basic-input-field-container"
        data-testid="basic-input-field-container"
        style={{ width: width || "100%", height }}
      >
        <BaseInput
          {...props}
          id={inputId}
          required={required}
          disabled={disabled}
          data-testid="basic-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {error && (
        <p className="basic-input-error-message" data-testid="error-message">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="basic-input-helper-text" data-testid="helper-text">
          {helperIcon}
          {helperText}
        </p>
      )}
    </div>
  );
};

export default BasicInput;
