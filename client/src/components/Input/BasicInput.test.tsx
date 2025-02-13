import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasicInput from "./BasicInput";

describe("BasicInput Component", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    label: "이름",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Label", () => {
    it("renders label correctly", () => {
      render(<BasicInput {...defaultProps} />);
      const label = screen.getByText("이름");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("basic-input-label");
    });

    it("associates label with input using htmlFor", () => {
      render(<BasicInput {...defaultProps} id="name-input" />);
      const label = screen.getByText("이름");
      expect(label).toHaveAttribute("for", "name-input");
    });

    it("renders required mark when input is required", () => {
      render(<BasicInput {...defaultProps} required />);
      const requiredMark = screen.getByText("*");
      expect(requiredMark).toBeInTheDocument();
      expect(requiredMark).toHaveClass("basic-input-required-mark");
    });
  });

  describe("Input", () => {
    it("renders input element with correct attributes", () => {
      render(<BasicInput {...defaultProps} placeholder="이름을 입력하세요" />);
      const input = screen.getByPlaceholderText("이름을 입력하세요");
      expect(input).toBeInTheDocument();
    });

    it("handles value change", () => {
      const onChange = jest.fn();
      render(<BasicInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "홍길동" } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("Error State", () => {
    it("does not show error message by default", () => {
      render(<BasicInput {...defaultProps} />);
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("shows error message when error prop is provided", () => {
      const errorMessage = "필수 입력 항목입니다.";
      render(<BasicInput {...defaultProps} error={errorMessage} />);

      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass("basic-input-error-message");
    });

    it("applies error styles to input when error exists", () => {
      render(<BasicInput {...defaultProps} error="에러 메시지" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("basic-input-error");
    });

    it("removes error state when error is cleared", () => {
      const { rerender } = render(
        <BasicInput {...defaultProps} error="에러 메시지" />
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("basic-input-error");

      rerender(<BasicInput {...defaultProps} error="" />);
      expect(input).not.toHaveClass("basic-input-error");
    });
  });

  describe("Helper Text", () => {
    it("renders helper text when provided", () => {
      const helperText = "영문, 숫자 조합 8자 이상";
      render(<BasicInput {...defaultProps} helperText={helperText} />);

      const helperElement = screen.getByText(helperText);
      expect(helperElement).toBeInTheDocument();
      expect(helperElement).toHaveClass("basic-input-helper-text");
    });

    it("does not render helper text when not provided", () => {
      render(<BasicInput {...defaultProps} />);
      expect(screen.queryByTestId("helper-text")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("applies disabled styles to label and input", () => {
      render(<BasicInput {...defaultProps} disabled />);

      const label = screen.getByText("이름");
      const input = screen.getByRole("textbox");

      expect(label).toHaveClass("basic-input-label-disabled");
      expect(input).toBeDisabled();
    });

    it("prevents value changes when disabled", () => {
      const onChange = jest.fn();
      render(<BasicInput {...defaultProps} onChange={onChange} disabled />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
