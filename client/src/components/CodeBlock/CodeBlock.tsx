import React from "react";
import "./CodeBlock.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "text",
  showLineNumbers = true,
}) => {
  const lines = code.split("\n");

  return (
    <div className="code-block">
      <div className="code-block-header">
        {language && <span className="code-block-language">{language}</span>}
      </div>
      <pre className="code-block-content">
        {showLineNumbers && (
          <div className="code-block-line-numbers">
            {lines.map((_, index) => (
              <span key={index + 1}>{index + 1}</span>
            ))}
          </div>
        )}
        <code className="code-block-code">
          {lines.map((line, index) => (
            <div key={index} className="code-block-line">
              {line || "\n"}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
