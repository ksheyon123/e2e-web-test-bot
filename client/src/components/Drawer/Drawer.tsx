import React, { useEffect, useCallback, ReactNode } from "react";
import "./Drawer.css";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  component?: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  component,
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="drawer-container">
      {isOpen && (
        <div
          data-testid="drawer-backdrop"
          className="drawer-backdrop"
          onClick={onClose}
        />
      )}
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
