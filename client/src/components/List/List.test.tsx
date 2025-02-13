import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import List from "./List";

describe("List Component", () => {
  const mockItems = ["Item 1", "Item 2", "Item 3"];
  const mockOnClick = jest.fn();

  it("목록 아이템들이 올바르게 렌더링되는지 확인", () => {
    render(<List items={mockItems} onClick={mockOnClick} />);

    mockItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("아이템 클릭 시 올바른 인덱스와 함께 onClick이 호출되는지 확인", () => {
    render(<List items={mockItems} onClick={mockOnClick} />);

    const items = screen.getAllByRole("listitem");
    fireEvent.click(items[1]); // Click second item

    expect(mockOnClick).toHaveBeenCalledWith(1);
  });

  it("각 아이템에 대해 커스텀 자식 컴포넌트가 올바르게 렌더링되는지 확인", () => {
    const CustomComponent = ({ item }: { item: string }) => (
      <div data-testid="custom-component">{item}</div>
    );

    render(
      <List items={mockItems} onClick={mockOnClick}>
        {(item: string) => <CustomComponent item={item} />}
      </List>
    );

    const customComponents = screen.getAllByTestId("custom-component");
    expect(customComponents).toHaveLength(mockItems.length);

    mockItems.forEach((item, index) => {
      expect(customComponents[index]).toHaveTextContent(item);
    });
  });

  it("빈 목록이 제공될 때 올바르게 렌더링되는지 확인", () => {
    render(<List items={[]} onClick={mockOnClick} />);

    const list = screen.getByRole("list");
    expect(list.children).toHaveLength(0);
  });
});
