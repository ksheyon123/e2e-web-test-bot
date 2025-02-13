import React, { useEffect, useCallback, ReactNode, useState } from "react";
import "./Drawer.css";

interface DrawerProps {
  title: string;
  children?: ReactNode;
  component?: ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  children,
  component,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  }, [isOpen, onToggle]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleToggle();
      }
    },
    [isOpen, handleToggle]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const renderIcon = () => {
    if (isOpen) {
      return (
        <button
          data-testid="close-icon"
          className="drawer-icon"
          onClick={handleToggle}
          aria-label="닫기"
        >
          ✕
        </button>
      );
    }
    return (
      <button
        data-testid="open-icon"
        className="drawer-icon"
        onClick={handleToggle}
        aria-label="열기"
      >
        ≡
      </button>
    );
  };

  return (
    <div className="drawer-container">
      {isOpen && (
        <div
          data-testid="drawer-backdrop"
          className="drawer-backdrop"
          onClick={handleToggle}
        />
      )}
      <div className="drawer-header">
        <h2 className="drawer-title">{title}</h2>
        {renderIcon()}
      </div>
      <div
        role="dialog"
        aria-modal="true"
        className={`drawer ${isOpen ? "drawer-open" : ""}`}
      >
        {component && <div className="drawer-component">{component}</div>}
        {children && <div className="drawer-content">{children}</div>}
      </div>
    </div>
  );
};

export default Drawer;
