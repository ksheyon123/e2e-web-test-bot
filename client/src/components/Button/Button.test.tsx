import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";
import { FiPlus } from "react-icons/fi";

describe("Button", () => {
  const defaultProps = {
    children: "버튼",
    onClick: jest.fn(),
  };

  describe("default props", () => {
    it("기본 버튼을 렌더링한다", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button", { name: "버튼" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("button");
    });

    it("props를 전달하지 않았을 때 기본값이 적용된다", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-primary"); // default variant
      expect(button).toHaveClass("button-medium"); // default size
      expect(button).not.toHaveClass("button-with-start-icon");
      expect(button).not.toHaveClass("button-with-end-icon");
      expect(button).not.toHaveClass("button-icon-only");
      expect(button).not.toBeDisabled();
      expect(
        screen.queryByTestId("button-loading-indicator")
      ).not.toBeInTheDocument();
    });
  });

  it("클릭 이벤트를 처리한다", async () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "버튼" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태일 때 클릭이 불가능하다", async () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} disabled />);

    const button = screen.getByRole("button", { name: "버튼" });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("variant에 따라 적절한 스타일 클래스를 적용한다", () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />);
    expect(screen.getByRole("button")).toHaveClass("button-primary");

    rerender(<Button {...defaultProps} variant="secondary" />);
    expect(screen.getByRole("button")).toHaveClass("button-secondary");

    rerender(<Button {...defaultProps} variant="text" />);
    expect(screen.getByRole("button")).toHaveClass("button-text");
  });

  it("size prop에 따라 적절한 크기 클래스를 적용한다", () => {
    const { rerender } = render(<Button {...defaultProps} size="small" />);
    expect(screen.getByRole("button")).toHaveClass("button-small");

    rerender(<Button {...defaultProps} size="medium" />);
    expect(screen.getByRole("button")).toHaveClass("button-medium");

    rerender(<Button {...defaultProps} size="large" />);
    expect(screen.getByRole("button")).toHaveClass("button-large");
  });

  it("width prop이 제공되면 해당 너비를 적용한다", () => {
    render(<Button {...defaultProps} width="200px" />);
    expect(screen.getByRole("button")).toHaveStyle({ width: "200px" });
  });

  describe("아이콘 렌더링", () => {
    it("startIcon이 제공되면 텍스트 앞에 아이콘을 렌더링한다", () => {
      render(
        <Button
          {...defaultProps}
          startIcon={<FiPlus data-testid="start-icon" />}
        />
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-with-start-icon");
    });

    it("endIcon이 제공되면 텍스트 뒤에 아이콘을 렌더링한다", () => {
      render(
        <Button {...defaultProps} endIcon={<FiPlus data-testid="end-icon" />} />
      );

      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-with-end-icon");
    });

    it("iconOnly prop이 true일 때 아이콘만 렌더링한다", () => {
      render(
        <Button
          icon={<FiPlus data-testid="icon" />}
          iconOnly
          aria-label="추가"
        />
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-icon-only");
    });
  });

  it("loading 상태일 때 로딩 인디케이터를 표시하고 버튼을 비활성화한다", () => {
    render(<Button {...defaultProps} loading />);

    expect(screen.getByTestId("button-loading-indicator")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
