import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Drawer from "./Drawer";

describe("Drawer", () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    mockClose.mockClear();
  });

  it("renders drawer when isOpen is true", () => {
    render(<Drawer isOpen={true} onClose={mockClose} />);
    expect(screen.getByRole("dialog")).toHaveClass("drawer-open");
  });

  it("does not render drawer when isOpen is false", () => {
    render(<Drawer isOpen={false} onClose={mockClose} />);
    expect(screen.getByRole("dialog")).not.toHaveClass("drawer-open");
  });

  it("closes drawer when backdrop is clicked", () => {
    render(<Drawer isOpen={true} onClose={mockClose} />);
    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);
    expect(mockClose).toHaveBeenCalled();
  });

  it("closes drawer when ESC key is pressed", () => {
    render(<Drawer isOpen={true} onClose={mockClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("renders children content", () => {
    render(
      <Drawer isOpen={true} onClose={mockClose}>
        <div data-testid="child-content">Child Content</div>
      </Drawer>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders component prop", () => {
    const TestComponent = () => (
      <div data-testid="test-component">Test Component</div>
    );

    render(
      <Drawer isOpen={true} onClose={mockClose} component={<TestComponent />} />
    );

    expect(screen.getByTestId("test-component")).toBeInTheDocument();
    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  it("renders both children and component prop", () => {
    const TestComponent = () => (
      <div data-testid="test-component">Test Component</div>
    );

    render(
      <Drawer isOpen={true} onClose={mockClose} component={<TestComponent />}>
        <div data-testid="child-content">Child Content</div>
      </Drawer>
    );

    expect(screen.getByTestId("test-component")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });
});
