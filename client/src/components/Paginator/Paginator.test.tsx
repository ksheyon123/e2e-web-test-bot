import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Paginator from "./Paginator";

describe("Paginator", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("모든 네비게이션 버튼이 렌더링되어야 한다", () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText("first page")).toBeInTheDocument();
    expect(screen.getByLabelText("previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("next page")).toBeInTheDocument();
    expect(screen.getByLabelText("last page")).toBeInTheDocument();
  });

  it("첫 페이지에서는 첫 페이지와 이전 페이지 버튼이 비활성화되어야 한다", () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText("first page")).toBeDisabled();
    expect(screen.getByLabelText("previous page")).toBeDisabled();
    expect(screen.getByLabelText("next page")).not.toBeDisabled();
    expect(screen.getByLabelText("last page")).not.toBeDisabled();
  });

  it("마지막 페이지에서는 다음 페이지와 마지막 페이지 버튼이 비활성화되어야 한다", () => {
    render(
      <Paginator
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText("first page")).not.toBeDisabled();
    expect(screen.getByLabelText("previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("next page")).toBeDisabled();
    expect(screen.getByLabelText("last page")).toBeDisabled();
  });

  it("showNumbers가 true일 때 페이지 번호가 표시되어야 한다", () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`page ${i}`)).toBeInTheDocument();
    }
  });

  it("showNumbers가 false일 때 페이지 번호가 표시되지 않아야 한다", () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showNumbers={false}
      />
    );

    expect(screen.queryByLabelText("page 1")).not.toBeInTheDocument();
  });

  it("showCurrentPageOnly가 true일 때 현재 페이지 번호만 표시되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showCurrentPageOnly={true}
      />
    );

    expect(screen.getByLabelText("page 3")).toBeInTheDocument();
    expect(screen.queryByLabelText("page 1")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("page 2")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("page 4")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("page 5")).not.toBeInTheDocument();
  });

  it("showCurrentPageOnly와 showPageCount가 true일 때 현재 페이지와 전체 페이지가 표시되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showCurrentPageOnly={true}
        showPageCount={true}
      />
    );

    // 페이지 카운트 형식 검증
    expect(screen.getByText(/\//)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it("showCurrentPageOnly가 true이고 showPageCount가 false일 때 현재 페이지만 표시되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showCurrentPageOnly={true}
        showPageCount={false}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("3 / 5")).not.toBeInTheDocument();
  });

  it("현재 페이지 번호가 강조 표시되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText("page 3")).toHaveClass("active");
    expect(screen.getByLabelText("page 3")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("첫 페이지 버튼 클릭 시 올바른 페이지 번호로 onPageChange가 호출되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText("first page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("마지막 페이지 버튼 클릭 시 올바른 페이지 번호로 onPageChange가 호출되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText("last page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it("이전 페이지 버튼 클릭 시 올바른 페이지 번호로 onPageChange가 호출되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText("previous page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("다음 페이지 버튼 클릭 시 올바른 페이지 번호로 onPageChange가 호출되어야 한다", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText("next page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("페이지 번호 클릭 시 올바른 페이지 번호로 onPageChange가 호출되어야 한다", () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByLabelText("page 4"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});
