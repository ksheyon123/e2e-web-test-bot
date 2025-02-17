import React, { useState } from "react";
import List from "./components/List/List";
import { AISearchElement, AISearchSpec, Response } from "./types";
import Layout from "./components/Layout/Layout";

const App: React.FC = () => {
  const [data, setData] = useState<AISearchElement[]>([]);
  const onLauch = async () => {
    await fetch("http://localhost:8080/automate/launch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await fetch("http://localhost:8080/automate/screenshot", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const r = await fetch("http://localhost:8080/automate/features");
    if (r.status === 200) {
      const { data } = (await r.json()) as Response<AISearchSpec>;
      const { elements } = data;
      console.log(elements);
      setData(elements);
    }
  };
  return (
    <Layout>
      <div
        onClick={() => {
          onLauch();
        }}
      >
        Click
      </div>
      <List
        items={data}
        titleFormatter={(item: AISearchElement) =>
          `${item.text} ${item.type.toUpperCase()}`
        }
      />
    </Layout>
  );
};

export default App;
