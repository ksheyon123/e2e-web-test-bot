import React from "react";
import BasicInput from "../components/Input/BasicInput";
import SearchInput from "../components/Input/SearchInput";
import Dropdown from "../components/Dropdown/Dropdown";
import List from "../components/List/List";
import Paginator from "../components/Paginator/Paginator";
import Layout from "../components/Layout/Layout";
import Button from "@/components/Button/Button";

const UI = () => {
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
              value=""
              onChange={(e) => {}}
              onSearch={() => {}}
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
          <Button />
        </section>
      </div>
    </Layout>
  );
};

export default UI;
