import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Drawer from "./Drawer";

describe("Drawer 컴포넌트", () => {
  const mockOnToggle = jest.fn();
  const drawerContent = "Drawer 내용";
  const title = "Drawer 제목";
  const CustomComponent = () => (
    <div data-testid="custom-component">커스텀 컴포넌트</div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기 상태에서는 닫혀있어야 함", () => {
    render(
      <Drawer title={title} onToggle={mockOnToggle}>
        {drawerContent}
      </Drawer>
    );

    expect(screen.getByTestId("open-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("drawer-backdrop")).not.toBeInTheDocument();
  });

  it("아이콘 클릭 시 Drawer가 열리고 닫혀야 함", () => {
    render(
      <Drawer title={title} onToggle={mockOnToggle}>
        {drawerContent}
      </Drawer>
    );

    // 열기
    const openIcon = screen.getByTestId("open-icon");
    fireEvent.click(openIcon);
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-backdrop")).toBeInTheDocument();
    expect(mockOnToggle).toHaveBeenCalledWith(true);

    // 닫기
    const closeIcon = screen.getByTestId("close-icon");
    fireEvent.click(closeIcon);
    expect(screen.getByTestId("open-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("drawer-backdrop")).not.toBeInTheDocument();
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it("커스텀 컴포넌트가 올바르게 렌더링되는지 확인", () => {
    render(
      <Drawer title={title} component={<CustomComponent />}>
        {drawerContent}
      </Drawer>
    );

    const openIcon = screen.getByTestId("open-icon");
    fireEvent.click(openIcon);

    expect(screen.getByTestId("custom-component")).toBeInTheDocument();
  });

  it("백드롭 클릭 시 Drawer가 닫혀야 함", () => {
    render(
      <Drawer title={title} onToggle={mockOnToggle}>
        {drawerContent}
      </Drawer>
    );

    // 먼저 Drawer 열기
    const openIcon = screen.getByTestId("open-icon");
    fireEvent.click(openIcon);

    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);

    expect(screen.getByTestId("open-icon")).toBeInTheDocument();
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it("ESC 키 입력 시 Drawer가 닫혀야 함", () => {
    render(
      <Drawer title={title} onToggle={mockOnToggle}>
        {drawerContent}
      </Drawer>
    );

    // 먼저 Drawer 열기
    const openIcon = screen.getByTestId("open-icon");
    fireEvent.click(openIcon);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByTestId("open-icon")).toBeInTheDocument();
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });
});
