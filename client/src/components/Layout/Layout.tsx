import React, { ReactNode, useState } from "react";
import Header from "../Header/Header";
import Drawer from "../Drawer/Drawer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="E2E TEST" onDrawerOpen={handleDrawerOpen} />
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ padding: "10px 20px", cursor: "pointer" }}>
                메뉴 1
              </li>
              <li style={{ padding: "10px 20px", cursor: "pointer" }}>
                메뉴 2
              </li>
              <li style={{ padding: "10px 20px", cursor: "pointer" }}>
                메뉴 3
              </li>
            </ul>
          </nav>
        </Drawer>
        <main style={{ flex: 1, padding: "20px", overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
