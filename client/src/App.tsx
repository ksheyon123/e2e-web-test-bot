import React, { useState } from "react";
import List from "./components/List/List";
import Dropdown from "./components/Dropdown/Dropdown";

type Item = {
  name: string;
  items: Item[];
};

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const onLauch = async () => {
    await fetch("http://127.0.0.1:8080/automate/launch");
    await fetch("http://127.0.0.1:8080/automate/screenshot");
    const r = await fetch("http://127.0.0.1:8080/automate/features");
    if (r.status === 200) {
      const { data } = await r.json();
      const { elements } = data;
      setData(elements);
    }
  };
  return (
    <div>
      <div
        onClick={() => {
          onLauch();
        }}
      >
        Click
      </div>
      <List items={data} />
    </div>
  );
};

export default App;
