import React, { ChangeEvent, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BaseInput from "./BaseInput";

describe("BaseInput Component", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    const user = userEvent.setup();
    it("renders input element correctly", () => {
      render(<BaseInput {...defaultProps} />);
      const input = screen.getByTestId("base-input");
      expect(input).toBeInTheDocument();
    });

    it("handles value change", async () => {
      // value 상태 관리를 위한 테스트 컴포넌트
      const TestComponent = () => {
        const [value, setValue] = useState("");
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
          onChange(e);
        };

        return (
          <BaseInput {...defaultProps} value={value} onChange={handleChange} />
        );
      };

      const onChange = jest.fn();
      render(<TestComponent />);

      const input = screen.getByTestId("base-input");
      // user.type은 비동기 작업이므로 await 사용
      await user.type(input, "test value");

      expect(onChange).toHaveBeenCalledTimes("test value".length);
      expect(onChange).toHaveBeenCalledWith(expect.any(Object));
      expect(input).toHaveValue("test value");
    });
  });

  describe("Input Types", () => {
    it("applies default type as text", () => {
      render(<BaseInput {...defaultProps} />);
      const input = screen.getByTestId("base-input");
      expect(input).toHaveAttribute("type", "text");
    });

    it("applies custom type when provided", () => {
      render(<BaseInput {...defaultProps} type="password" />);
      const input = screen.getByTestId("base-input");
      expect(input).toHaveAttribute("type", "password");
    });

    it("applies email type correctly", () => {
      render(<BaseInput {...defaultProps} type="email" />);
      const input = screen.getByTestId("base-input");
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("Disabled State", () => {
    const user = userEvent.setup();

    it("is enabled by default", () => {
      render(<BaseInput {...defaultProps} />);
      const input = screen.getByTestId("base-input");
      expect(input).not.toBeDisabled();
    });

    it("applies disabled state when provided", () => {
      render(<BaseInput {...defaultProps} disabled />);
      const input = screen.getByTestId("base-input");
      expect(input).toBeDisabled();
    });

    it("prevents value changes when disabled", async () => {
      // value 상태 관리를 위한 테스트 컴포넌트
      const TestComponent = () => {
        const [value, setValue] = useState("");
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
          onChange(e);
        };

        return <BaseInput {...defaultProps} disabled onChange={handleChange} />;
      };

      const onChange = jest.fn();
      render(<TestComponent />);

      const input = screen.getByTestId("base-input");
      await user.type(input, "test value");

      // 값이 변경되지 않음
      expect(input).toHaveValue("");

      // onChange가 호출되지 않음
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Placeholder", () => {
    it("does not have placeholder by default", () => {
      render(<BaseInput {...defaultProps} />);
      const input = screen.getByTestId("base-input");
      expect(input).not.toHaveAttribute("placeholder");
    });

    it("applies placeholder when provided", () => {
      const placeholder = "Enter text";
      render(<BaseInput {...defaultProps} placeholder={placeholder} />);
      const input = screen.getByTestId("base-input");
      expect(input).toHaveAttribute("placeholder", placeholder);
    });
  });

  describe("Additional Props", () => {
    it("forwards additional props to input element", () => {
      render(
        <BaseInput
          {...defaultProps}
          data-custom="test"
          aria-label="test input"
          maxLength={10}
          required
        />
      );

      const input = screen.getByTestId("base-input");
      expect(input).toHaveAttribute("data-custom", "test");
      expect(input).toHaveAttribute("aria-label", "test input");
      expect(input).toHaveAttribute("maxLength", "10");
      expect(input).toBeRequired();
    });
  });
});
