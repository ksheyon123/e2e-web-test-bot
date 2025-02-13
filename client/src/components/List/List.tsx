import React, { ReactNode } from "react";
import "./List.css";

interface ListProps<T> {
  items: T[];
  onClick?: (index: number) => void;
  children?: (item: T) => ReactNode;
}

const List = <T,>({ items, onClick, children }: ListProps<T>) => {
  const renderItem = (item: T, index: number) => {
    if (children) {
      return (
        <li
          key={index}
          onClick={() => {
            if (onClick) onClick(index);
          }}
        >
          {children(item)}
        </li>
      );
    }
    return (
      <li
        key={index}
        onClick={() => {
          if (onClick) onClick(index);
        }}
      >
        {String(item)}
      </li>
    );
  };

  return (
    <ul className="list">
      {items.map((item, index) => renderItem(item, index))}
    </ul>
  );
};

export default List;
