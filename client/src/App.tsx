import React, { useEffect, useState } from "react";
import List from "./components/List/List";
import { AISearchElement, AISearchSpec, Response } from "./types";
import Layout from "./components/Layout/Layout";
import Paginator from "./components/Paginator/Paginator";
import { ImageView } from "./components/ImageView/ImageView";
import Loading from "./components/Loading/Loading";
import { findComponents } from "./utils";

const App: React.FC = () => {
  const [data, setData] = useState<AISearchElement[]>([]);
  const [screenId, setScreenId] = useState<string>();
  const [screenBase64, setScreenBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const onLauch = async () => {
    setIsLoading(true);
    await fetch("http://localhost:8080/automate/launch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const r0 = await fetch("http://localhost:8080/automate/screenshot", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (r0.status === 200) {
      const { data } = await r0.json();
      const { screenshot_id, base64 } = data;
      setScreenId(screenshot_id);
      setScreenBase64(base64);
    }
    const r1 = await fetch("http://localhost:8080/automate/coord");
    if (r1.status === 200) {
      const { data } = (await r1.json()) as Response<AISearchSpec>;
      console.log(data);

      // const { elements } = data;
      // setData(elements);
    }
    setIsLoading(false);
  };

  const onClick = async () => {
    const r = await fetch("http://localhost:8080/automate/coord");
    if (r.status === 200) {
      const { data } = await r.json();
      console.log(data);
    }
  };

  useEffect(() => {
    onLauch();
  }, []);

  const [curPage, setCurPage] = useState<number>(1);
  return (
    <Layout>
      <Loading isLoading={isLoading} />
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div style={{ width: 200, height: "100%" }}>
          <div onClick={() => onClick()}>OnClick</div>
          <List
            items={data}
            children={(item) => {
              const { type, test_case, text } = item;
              return (
                <div>
                  {text} {type}{" "}
                </div>
              );
            }}
          />
        </div>
        <div style={{ width: "calc(100vw - 200)", height: "100%" }}>
          <ImageView base64Data={screenBase64} />
          <Paginator
            onPageChange={setCurPage}
            currentPage={curPage}
            totalPages={5}
            showCurrentPageOnly={true}
            showPageCount={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default App;
