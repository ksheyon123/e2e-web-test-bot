import React from "react";
import { render, screen } from "@testing-library/react";
import { ImageView } from "./ImageView";

describe("ImageView", () => {
  const base64Image =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const httpUrl = "https://example.com/image.png";

  it("renders null when no base64Data is provided", () => {
    const { container } = render(<ImageView base64Data="" />);
    expect(container.firstChild).toBeNull();
  });

  it("handles http/https URLs correctly", () => {
    render(<ImageView base64Data={httpUrl} alt="HTTP Image" />);
    const img = screen.getByAltText("HTTP Image");
    expect(img).toHaveAttribute("src", httpUrl);
  });

  it("handles raw base64 data correctly", () => {
    render(<ImageView base64Data={base64Image} alt="Base64 Image" />);
    const img = screen.getByAltText("Base64 Image");
    expect(img).toHaveAttribute("src", `data:image/png;base64,${base64Image}`);
  });

  it("handles data URL correctly", () => {
    const dataUrl = `data:image/png;base64,${base64Image}`;
    render(<ImageView base64Data={dataUrl} alt="Data URL Image" />);
    const img = screen.getByAltText("Data URL Image");
    expect(img).toHaveAttribute("src", dataUrl);
  });

  it("applies custom className", () => {
    render(
      <ImageView
        base64Data={base64Image}
        alt="Custom Class Image"
        className="custom-class"
      />
    );
    const container = screen.getByAltText("Custom Class Image").parentElement;
    expect(container).toHaveClass("image-view", "custom-class");
  });
});
