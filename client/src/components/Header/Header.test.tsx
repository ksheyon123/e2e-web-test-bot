import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

// react-icons/fa 모듈 모킹
jest.mock("react-icons/fa", () => ({
  FaBars: () => <div data-testid="hamburger-icon">Hamburger Icon</div>,
}));

describe("Header 컴포넌트", () => {
  const mockOnDrawerOpen = jest.fn();
  const mockOnDrawerClose = jest.fn();
  const defaultProps = {
    onDrawerOpen: mockOnDrawerOpen,
    onDrawerClose: mockOnDrawerClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const title = "Header";

  it("헤더가 렌더링되어야 합니다", () => {
    render(<Header title={title} {...defaultProps} />);
    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });

  it("햄버거 아이콘 클릭시 onDrawerOpen이 호출되어야 합니다", () => {
    render(<Header title={title} {...defaultProps} />);
    const hamburgerIcon = screen.getByTestId("hamburger-icon");

    fireEvent.click(hamburgerIcon);
    expect(mockOnDrawerOpen).toHaveBeenCalledTimes(1);
  });

  it("커스텀 아이콘이 전달되면 렌더링되어야 합니다", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
    render(<Header title={title} {...defaultProps} icon={<CustomIcon />} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("hamburger-icon")).not.toBeInTheDocument();
  });

  it("햄버거 아이콘이 기본적으로 렌더링되어야 합니다", () => {
    render(<Header title={title} {...defaultProps} />);
    expect(screen.getByTestId("hamburger-icon")).toBeInTheDocument();
  });
});
