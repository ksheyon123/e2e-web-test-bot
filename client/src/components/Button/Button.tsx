import React, { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";
import { FiLoader } from "react-icons/fi";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "medium" | "large";
  width?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  width,
  startIcon,
  endIcon,
  icon,
  iconOnly = false,
  loading = false,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    "button",
    `button-${variant}`,
    `button-${size}`,
    startIcon && "button-with-start-icon",
    endIcon && "button-with-end-icon",
    iconOnly && "button-icon-only",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const buttonStyle = {
    ...style,
    width,
  };

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <FiLoader
          data-testid="button-loading-indicator"
          className="button-loading-spinner"
        />
      ) : (
        <>
          {startIcon}
          {iconOnly ? icon : children}
          {endIcon}
        </>
      )}
    </button>
  );
};

export default Button;
