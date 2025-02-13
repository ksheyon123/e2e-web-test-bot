import React from "react";
import BaseInput from "./components/Input/BaseInput";
import BasicInput from "./components/Input/BasicInput";

const App: React.FC = () => {
  return (
    <div>
      <h1>React TypeScript App</h1>
      <p>Welcome to the React TypeScript application!</p>
      <BaseInput value="" onChange={() => {}} placeholder="입력" />
      <BasicInput
        label="입력"
        value=""
        onChange={() => {}}
        placeholder="입력"
      />
    </div>
  );
};

export default App;
