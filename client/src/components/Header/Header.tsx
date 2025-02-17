import React, { ReactNode } from "react";
import { FaBars } from "react-icons/fa";
import "./Header.css";

interface HeaderProps {
  title: string;
  icon?: ReactNode;
  onDrawerOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ icon, title, onDrawerOpen }) => {
  return (
    <header className="header">
      <div
        className="icon-wrapper"
        onClick={onDrawerOpen}
        style={{ cursor: "pointer" }}
      >
        {icon || <FaBars data-testid="hamburger-icon" size={20} />}
      </div>
      <div>{title}</div>
    </header>
  );
};

export default Header;
