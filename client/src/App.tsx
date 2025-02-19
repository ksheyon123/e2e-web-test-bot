import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Root from "./pages/Root";
import UI from "./pages/UI";
import Register from "./pages/Register";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        {/* <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/ui">UI Components</Link>
        </nav> */}
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/ui" element={<UI />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
