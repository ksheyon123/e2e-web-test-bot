import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    onSearch: jest.fn(),
    placeholder: "검색어를 입력하세요",
  };

  it("검색 입력 필드와 아이콘을 렌더링한다", () => {
    render(<SearchInput {...defaultProps} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("placeholder가 올바르게 표시된다", () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByPlaceholderText("검색어를 입력하세요");
    expect(input).toBeInTheDocument();
  });

  it("입력값이 변경될 때 onChange 이벤트가 발생한다", async () => {
    const onChange = jest.fn();
    render(<SearchInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId("search-input");
    await userEvent.type(input, "테스트");

    expect(onChange).toHaveBeenCalled();
  });

  it("엔터키를 누르면 onSearch 이벤트가 발생한다", () => {
    const onSearch = jest.fn();
    render(
      <SearchInput {...defaultProps} onSearch={onSearch} value="테스트" />
    );

    const input = screen.getByTestId("search-input");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSearch).toHaveBeenCalledWith("테스트");
  });

  it("disabled 상태일 때 입력이 비활성화된다", () => {
    render(<SearchInput {...defaultProps} disabled />);

    const input = screen.getByTestId("search-input");
    expect(input).toBeDisabled();
  });

  describe("clear 버튼", () => {
    it("입력값이 있을 때만 clear 버튼이 표시된다", () => {
      const { rerender } = render(<SearchInput {...defaultProps} value="" />);
      expect(screen.queryByTestId("clear-button")).not.toBeInTheDocument();

      rerender(<SearchInput {...defaultProps} value="테스트" />);
      expect(screen.getByTestId("clear-button")).toBeInTheDocument();
    });

    it("clear 버튼 클릭 시 입력값이 초기화된다", async () => {
      const onChange = jest.fn();
      render(
        <SearchInput {...defaultProps} value="테스트" onChange={onChange} />
      );

      const clearButton = screen.getByTestId("clear-button");
      await userEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: { value: "" } })
      );
    });
  });

  describe("스타일", () => {
    it("기본 너비가 적용된다", () => {
      render(<SearchInput {...defaultProps} />);

      const container = screen.getByTestId("search-input-container");
      expect(container).toHaveStyle({ width: "100%" });
    });

    it("custom 너비가 적용된다", () => {
      render(<SearchInput {...defaultProps} width="300px" />);

      const container = screen.getByTestId("search-input-container");
      expect(container).toHaveStyle({ width: "300px" });
    });

    it("disabled 상태일 때 적절한 스타일이 적용된다", () => {
      render(<SearchInput {...defaultProps} disabled />);

      const container = screen.getByTestId("search-input-container");
      expect(container).toHaveClass("search-input-container-disabled");
    });
  });
});
