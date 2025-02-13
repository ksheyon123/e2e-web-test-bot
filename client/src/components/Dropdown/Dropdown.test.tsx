import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dropdown from "./Dropdown";

describe("Dropdown 컴포넌트", () => {
  const mockOnSelect = jest.fn();
  const options = ["옵션 1", "옵션 2", "옵션 3"];
  const placeholder = "선택하세요";
  const CustomOption = ({ option }: { option: string }) => (
    <div data-testid="custom-option" className="custom-option">
      {option}
    </div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기 상태에서는 닫혀있어야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      />
    );

    expect(screen.getByText(placeholder)).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("클릭하면 옵션 목록이 표시되어야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      />
    );

    fireEvent.click(screen.getByText(placeholder));

    const optionsList = screen.getByRole("listbox");
    expect(optionsList).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("옵션 선택 시 onSelect가 호출되고 목록이 닫혀야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      />
    );

    // 드롭다운 열기
    fireEvent.click(screen.getByText(placeholder));

    // 옵션 선택
    fireEvent.click(screen.getByText(options[1]));

    expect(mockOnSelect).toHaveBeenCalledWith(options[1], 1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByText(options[1])).toBeInTheDocument();
  });

  it("외부 클릭 시 목록이 닫혀야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      />
    );

    // 드롭다운 열기
    fireEvent.click(screen.getByText(placeholder));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // 외부 클릭
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ESC 키 입력 시 목록이 닫혀야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      />
    );

    // 드롭다운 열기
    fireEvent.click(screen.getByText(placeholder));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // ESC 키 입력
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("커스텀 렌더링이 적용되어야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
      >
        {(option: string) => <CustomOption option={option} />}
      </Dropdown>
    );

    // 드롭다운 열기
    fireEvent.click(screen.getByText(placeholder));

    // 커스텀 옵션들이 렌더링되었는지 확인
    const customOptions = screen.getAllByTestId("custom-option");
    expect(customOptions).toHaveLength(options.length);
    options.forEach((option, index) => {
      expect(customOptions[index]).toHaveTextContent(option);
    });
  });

  it("disabled 상태에서는 클릭해도 열리지 않아야 함", () => {
    render(
      <Dropdown
        options={options}
        onSelect={mockOnSelect}
        placeholder={placeholder}
        disabled
      />
    );

    fireEvent.click(screen.getByText(placeholder));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
