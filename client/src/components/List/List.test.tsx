import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import List from "./List";

describe("List Component", () => {
  const mockItems = [
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
  ];

  it("renders list items correctly", () => {
    render(<List items={mockItems} />);

    const listContainer = screen.getByTestId("list-container");
    expect(listContainer).toBeInTheDocument();

    mockItems.forEach((item) => {
      const listItem = screen.getByTestId(`list-item-${item.id}`);
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveTextContent(item.text);
    });
  });

  it("calls onItemClick when an item is clicked", () => {
    const mockOnClick = jest.fn();
    render(<List items={mockItems} onItemClick={mockOnClick} />);

    const firstItem = screen.getByTestId("list-item-1");
    fireEvent.click(firstItem);

    expect(mockOnClick).toHaveBeenCalledWith(1);
  });

  it("renders empty list when no items provided", () => {
    render(<List items={[]} />);

    const listContainer = screen.getByTestId("list-container");
    expect(listContainer).toBeInTheDocument();
    expect(listContainer.children.length).toBe(0);
  });
});
