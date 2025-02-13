import React from "react";
import BaseInput from "./components/Input/BaseInput";

const App: React.FC = () => {
  return (
    <div>
      <h1>React TypeScript App</h1>
      <p>Welcome to the React TypeScript application!</p>
      <BaseInput value="" onChange={() => {}} disabled placeholder="입력" />
    </div>
  );
};

export default App;
