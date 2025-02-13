import { render, screen, act } from "@testing-library/react";
import BasicInput from "./BasicInput";
import userEvent from "@testing-library/user-event";

describe("BasicInput", () => {
  const defaultProps = {
    label: "테스트 입력",
    value: "",
    onChange: jest.fn(),
  };

  it("라벨과 입력 필드를 렌더링한다", () => {
    render(<BasicInput {...defaultProps} />);

    expect(screen.getByLabelText("테스트 입력")).toBeInTheDocument();
    expect(screen.getByTestId("basic-input")).toBeInTheDocument();
  });

  it("required가 true일 때 필수 표시(*)를 보여준다", () => {
    render(<BasicInput {...defaultProps} required />);

    const requiredMark = screen.getByText("*");
    expect(requiredMark).toBeInTheDocument();
    expect(requiredMark).toHaveClass("basic-input-required-mark");
  });

  it("에러가 있을 때 에러 메시지를 표시하고 컨테이너에 에러 스타일을 적용한다", () => {
    const errorMessage = "필수 입력 항목입니다";
    render(<BasicInput {...defaultProps} error={errorMessage} />);

    const container = screen.getByTestId("basic-input-container");
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveClass(
      "basic-input-error-message"
    );
    expect(container).toHaveClass("basic-input-container-error");
  });

  it("입력 필드가 포커스되면 컨테이너에 파란색 아웃라인이 표시된다", () => {
    render(<BasicInput {...defaultProps} />);

    const input = screen.getByTestId("basic-input");
    const container = screen.getByTestId("basic-input-container");
    act(() => {
      input.focus();
    });

    expect(container).toHaveClass("basic-input-container-focused");
  });

  it("helperText가 있을 때 도움말을 표시한다", () => {
    const helperText = "도움말 텍스트입니다";
    render(<BasicInput {...defaultProps} helperText={helperText} />);

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByTestId("helper-text")).toHaveClass(
      "basic-input-helper-text"
    );
  });

  it("disabled 상태일 때 입력이 비활성화된다", () => {
    render(<BasicInput {...defaultProps} disabled />);

    const input = screen.getByTestId("basic-input");
    expect(input).toBeDisabled();
    expect(screen.getByText("테스트 입력")).toHaveClass(
      "basic-input-label-disabled"
    );
  });

  it("입력 값이 변경될 때 onChange 핸들러를 호출한다", async () => {
    const onChange = jest.fn();
    render(<BasicInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId("basic-input");
    await userEvent.type(input, "테스트");

    expect(onChange).toHaveBeenCalled();
  });

  it("id가 제공되지 않았을 때 자동으로 id를 생성한다", () => {
    render(<BasicInput {...defaultProps} />);

    const input = screen.getByTestId("basic-input");
    expect(input.id).toBe("basic-input-테스트-입력");
  });

  it("custom id가 제공되었을 때 해당 id를 사용한다", () => {
    const customId = "custom-input-id";
    render(<BasicInput {...defaultProps} id={customId} />);

    const input = screen.getByTestId("basic-input");
    expect(input.id).toBe(customId);
  });

  it("width와 height가 제공되었을 때 컨테이너에 스타일이 적용된다", () => {
    const width = "300px";
    const height = "48px";
    render(<BasicInput {...defaultProps} width={width} height={height} />);

    const container = screen.getByTestId("basic-input-field-container");
    expect(container).toHaveStyle({
      width: width,
      height: height,
    });
  });

  it("width와 height가 제공되지 않았을 때 기본 스타일이 적용된다", () => {
    render(<BasicInput {...defaultProps} />);

    const container = screen.getByTestId("basic-input-field-container");
    expect(container).toHaveStyle({
      width: "100%",
    });
  });
});
