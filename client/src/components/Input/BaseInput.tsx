import React, { InputHTMLAttributes, forwardRef, ChangeEvent } from "react";
import "./BaseInput.css";

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Input의 현재 값 */
  value: string;
  /** Input 값이 변경될 때 호출되는 콜백 함수 */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Input이 비활성화 되었는지 여부 */
  disabled?: boolean;
  /** Input의 타입 */
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  /** Input의 placeholder */
  placeholder?: string;
  /** 추가적인 클래스명 */
  className?: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ type = "text", className = "", disabled, ...props }, ref) => {
    return (
      <input
        disabled={disabled}
        type={type}
        data-testid="base-input"
        className={`base-input ${className}`.trim()}
        {...props} // 모든 custom props를 전개
        ref={ref} // ref는 항상 마지막에
      />
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;
