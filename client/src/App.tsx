import React, { useState } from "react";
import List from "./components/List/List";
import Dropdown from "./components/Dropdown/Dropdown";

type Item = {
  name: string;
  items: Item[];
};

const App: React.FC = () => {
  const child = ({ items }: Item) => (
    <Dropdown options={items} onSelect={() => {}} placeholder="HI" />
  );
  return (
    <div>
      <h1>React TypeScript App</h1>
      <p>Welcome to the React TypeScript application!</p>
      <List
        items={
          [
            { name: "HI", items: [{ name: "Item1" }, { name: "Item2" }] },
            { name: "BYR", items: [{ name: "Item3" }] },
          ] as Item[]
        }
        children={(d) => child(d)}
      />
    </div>
  );
};

export default App;
