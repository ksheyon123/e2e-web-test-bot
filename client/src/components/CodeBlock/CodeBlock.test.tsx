import React from "react";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  const sampleCode = `function hello() {
  console.log("Hello, World!");
}`;

  it("renders code block with line numbers by default", () => {
    render(<CodeBlock code={sampleCode} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders code block without line numbers when showLineNumbers is false", () => {
    render(<CodeBlock code={sampleCode} showLineNumbers={false} />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("displays language when provided", () => {
    render(<CodeBlock code={sampleCode} language="javascript" />);

    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("renders code content correctly", () => {
    render(<CodeBlock code={sampleCode} />);

    expect(screen.getByText("function hello() {")).toBeInTheDocument();
    expect(
      screen.getByText('console.log("Hello, World!");')
    ).toBeInTheDocument();
    expect(screen.getByText("}")).toBeInTheDocument();
  });
});
