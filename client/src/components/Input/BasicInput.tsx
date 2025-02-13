import React, { forwardRef } from "react";
import BaseInput, { BaseInputProps } from "./BaseInput";
import "./BasicInput.css";

export interface BasicInputProps extends Omit<BaseInputProps, "className"> {
  /** 입력 필드의 라벨 */
  label: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 입력 필드의 ID */
  id?: string;
}

const BasicInput = forwardRef<HTMLInputElement, BasicInputProps>(
  ({ label, error, helperText, id, required, disabled, ...props }, ref) => {
    const inputId =
      id || `basic-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="basic-input-container">
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
        <div className="basic-input-field-container">
          <BaseInput
            {...props}
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            data-testid="basic-input"
          />
        </div>
        {error && (
          <p className="basic-input-error-message" data-testid="error-message">
            {error}
          </p>
        )}
        {helperText && (
          <p className="basic-input-helper-text" data-testid="helper-text">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

BasicInput.displayName = "BasicInput";

export default BasicInput;
