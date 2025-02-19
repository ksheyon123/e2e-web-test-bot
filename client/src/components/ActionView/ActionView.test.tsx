import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionView } from "./ActionView";

jest.mock("../ImageView/ImageView", () => ({
  ImageView: ({ base64Data, alt }: { base64Data: string; alt: string }) => (
    <img src={base64Data} alt={alt} data-testid="mocked-image" />
  ),
}));

describe("ActionView", () => {
  const mockSteps = [
    {
      image: {
        base64Data: "/assets/images/1.png",
        alt: "첫 번째 단계",
      },
      code: "console.log('첫 번째 단계');",
    },
    {
      image: {
        base64Data: "/assets/images/2.png",
        alt: "두 번째 단계",
      },
      code: "console.log('두 번째 단계');",
    },
  ];
  describe("컴포넌트 구조 테스트", () => {
    it("모든 하위 컴포넌트가 올바르게 렌더링되어야 함", () => {
      render(<ActionView steps={mockSteps} />);

      // ImageView 확인
      expect(screen.getByTestId("mocked-image")).toBeInTheDocument();

      // CodeBlock 확인
      expect(
        screen.getByText("console.log('첫 번째 단계');")
      ).toBeInTheDocument();

      // Paginator 확인
      expect(screen.getByText("1 / 2")).toBeInTheDocument();
    });
  });
  describe("페이지네이션 기능 테스트", () => {
    it("페이지 변경 시 이미지와 코드가 업데이트되어야 함", async () => {
      const user = userEvent.setup();
      render(<ActionView steps={mockSteps} />);

      // 초기 상태 확인
      expect(screen.getByAltText("첫 번째 단계")).toBeInTheDocument();
      expect(
        screen.getByText("console.log('첫 번째 단계');")
      ).toBeInTheDocument();

      // 다음 페이지로 이동
      await user.click(screen.getByLabelText("next page"));

      // 업데이트된 내용 확인
      expect(screen.getByAltText("두 번째 단계")).toBeInTheDocument();
      expect(
        screen.getByText("console.log('두 번째 단계');")
      ).toBeInTheDocument();
    });

    it("steps가 비어있을 때 빈 상태를 표시해야 함", () => {
      render(<ActionView steps={[]} />);

      // 빈 상태 확인
      expect(screen.queryByTestId("mocked-image")).not.toBeInTheDocument();
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
    });
  });

  describe("엣지 케이스 테스트", () => {
    it("한 단계만 있는 경우에도 올바르게 동작해야 함", () => {
      const singleStep = [mockSteps[0]];
      render(<ActionView steps={singleStep} />);

      // 단일 페이지 확인
      const nextButton = screen.getByLabelText("next page");
      expect(nextButton).toBeDisabled();
    });

    it("잘못된 이미지 경로가 주어져도 에러 없이 렌더링되어야 함", () => {
      const stepsWithInvalidImage = [
        {
          image: {
            base64Data: "invalid-path.png",
            alt: "잘못된 이미지",
          },
          code: "console.log('테스트');",
        },
      ];

      render(<ActionView steps={stepsWithInvalidImage} />);

      // 이미지가 깨져도 나머지 컴포넌트는 정상 동작
      expect(screen.getByAltText("잘못된 이미지")).toBeInTheDocument();
      expect(screen.getByText("console.log('테스트');")).toBeInTheDocument();
    });
  });
});
