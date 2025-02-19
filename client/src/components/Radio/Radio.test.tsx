import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Radio from "./Radio";

describe("Radio Component", () => {
  const mockItems = [
    { id: "1", label: "Option 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3" },
  ];

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("아이템 목록으로 라디오 버튼을 렌더링한다", () => {
    render(<Radio items={mockItems} onClick={mockOnClick} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(mockItems.length);

    mockItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("라디오 버튼 클릭 시 onClick 함수가 호출된다", async () => {
    const user = userEvent.setup();
    render(<Radio items={mockItems} onClick={mockOnClick} />);

    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[0]);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it("disabled 상태일 때 모든 라디오 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    render(<Radio items={mockItems} onClick={mockOnClick} disabled />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio) => {
      expect(radio).toBeDisabled();
    });

    await user.click(radioButtons[0]);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("선택된 아이템의 checked 상태가 정확히 표시된다", () => {
    const selectedItem = mockItems[1];
    render(
      <Radio
        items={mockItems}
        onClick={mockOnClick}
        selectedValue={selectedItem.id}
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[1]).toBeChecked();
    expect(radioButtons[0]).not.toBeChecked();
    expect(radioButtons[2]).not.toBeChecked();
  });

  it("사용자 정의 className이 적용된다", () => {
    const customClass = "custom-radio-group";
    render(
      <Radio items={mockItems} onClick={mockOnClick} className={customClass} />
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveClass(customClass);
  });

  it("접근성을 위한 올바른 속성들이 적용된다", () => {
    render(
      <Radio items={mockItems} onClick={mockOnClick} name="test-radio-group" />
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio, index) => {
      expect(radio).toHaveAttribute("name", "test-radio-group");
      expect(radio).toHaveAttribute("value", mockItems[index].id);
    });
  });
});
