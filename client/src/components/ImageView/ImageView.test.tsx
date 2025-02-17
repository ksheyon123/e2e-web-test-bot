import React from "react";
import { render, screen } from "@testing-library/react";
import { ImageView } from "./ImageView";

describe("ImageView", () => {
  const sampleBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  it("renders image with base64 data", () => {
    render(<ImageView base64Data={sampleBase64} alt="Test image" />);
    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toContain("data:image/png;base64,");
  });

  it("renders image with custom className", () => {
    render(<ImageView base64Data={sampleBase64} className="custom-class" />);
    const container = screen.getByRole("img").parentElement;
    expect(container).toHaveClass("image-view", "custom-class");
  });

  it("returns null when base64Data is empty", () => {
    const { container } = render(<ImageView base64Data="" />);
    expect(container.firstChild).toBeNull();
  });
});
