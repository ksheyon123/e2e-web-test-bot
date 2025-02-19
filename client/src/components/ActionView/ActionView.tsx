import React, { useState } from "react";
import { ImageView } from "../ImageView/ImageView";
import { CodeBlock } from "../CodeBlock/CodeBlock";
import Paginator from "../Paginator/Paginator";
import "./ActionView.css";

interface ActionStep {
  image: {
    base64Data: string;
    alt?: string;
  };
  code: string;
}

interface ActionViewProps {
  steps: ActionStep[];
}

export const ActionView: React.FC<ActionViewProps> = ({ steps }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!steps.length) {
    return null;
  }

  const currentStep = steps[currentPage - 1];

  return (
    <div className="action-view">
      <div className="action-view-image">
        <ImageView
          base64Data={currentStep.image.base64Data}
          alt={currentStep.image.alt || `Step ${currentPage}`}
        />
      </div>
      <div className="action-view-wrapper">
        <div className="action-view-code">
          <CodeBlock
            code={currentStep.code}
            language="typescript"
            showLineNumbers={true}
          />
        </div>
        <div className="action-view-paginator">
          <Paginator
            currentPage={currentPage}
            totalPages={steps.length}
            onPageChange={handlePageChange}
            showNumbers={true}
            showCurrentPageOnly={true}
            showPageCount={true}
          />
        </div>
      </div>
    </div>
  );
};
