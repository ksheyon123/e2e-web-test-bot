import React, { useState, KeyboardEvent } from "react";
import BasicInput from "../components/Input/BasicInput";
import SearchInput from "../components/Input/SearchInput";
import Dropdown from "../components/Dropdown/Dropdown";
import List from "../components/List/List";
import Paginator from "../components/Paginator/Paginator";
import Layout from "../components/Layout/Layout";
import Button from "@/components/Button/Button";
import SearchComponent from "@/__wrong__component/SearchComponent";
import Radio from "@/components/Radio/Radio";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { ActionView } from "@/components/ActionView/ActionView";

const UI = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    console.log("검색어:", searchText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1>UI Components</h1>

        <section style={{ marginBottom: "40px" }}>
          <h2>Inputs</h2>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <BasicInput
              label="Basic Input"
              placeholder="Enter text"
              value=""
              onChange={(e) => {}}
            />
            <SearchInput
              placeholder="Search text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Dropdown</h2>
          <Dropdown<{ name: string }>
            options={[
              { name: "Option 1" },
              { name: "Option 2" },
              { name: "Option 3" },
            ]}
            placeholder="Select an option"
            onSelect={() => {}}
          />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>List</h2>
          <List
            items={[
              { id: "1", content: "List Item 1" },
              { id: "2", content: "List Item 2" },
              { id: "3", content: "List Item 3" },
            ]}
          />
        </section>

        <section>
          <h2>Paginator</h2>
          <Paginator currentPage={1} totalPages={5} onPageChange={() => {}} />
        </section>

        <section>
          <h2>Button</h2>
          <Button onClick={handleSearch} onKeyDown={handleKeyDown}>
            검색
          </Button>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Radio</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div>
              <h3>수직 레이아웃</h3>
              <Radio
                items={[
                  { id: "1", label: "옵션 1" },
                  { id: "2", label: "옵션 2" },
                  { id: "3", label: "옵션 3" },
                ]}
                onClick={() => {}}
                direction="vertical"
              />
            </div>
            <div>
              <h3>수평 레이아웃</h3>
              <Radio
                items={[
                  { id: "4", label: "옵션 1" },
                  { id: "5", label: "옵션 2" },
                  { id: "6", label: "옵션 3" },
                ]}
                onClick={() => {}}
                direction="horizontal"
              />
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Code Block</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <CodeBlock
              code={`function greeting(name: string) {
  return \`Hello, \${name}!\`;
}

// Call the function
console.log(greeting("World"));`}
              language="typescript"
            />

            <CodeBlock
              code={`const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
  },
}`}
              language="javascript"
              showLineNumbers={false}
            />

            <CodeBlock
              code={`.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`}
              language="css"
            />
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Action View</h2>
          <ActionView
            steps={[
              {
                image: {
                  base64Data:
                    "http://localhost:8888/assets/images/default_screen.png",
                  alt: "Example Image 1",
                },
                code: `function handleClick() {
  console.log("Button clicked!");
}`,
              },
              {
                image: {
                  base64Data: "http://localhost:8888/assets/images/1.png",
                  alt: "Example Image 2",
                },
                code: `const styles = {
  button: {
    backgroundColor: "blue",
    color: "white"
  }
}`,
              },
            ]}
          />
        </section>
      </div>
    </Layout>
  );
};

export default UI;
