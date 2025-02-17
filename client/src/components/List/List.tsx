import React, { ReactNode } from "react";
import "./List.css";

interface ListProps<T> {
  items: T[];
  onClick?: (index: number) => void;
  children?: (item: T) => ReactNode;
  titleFormatter?: (item: T) => string;
}

const List = <T,>({
  items,
  onClick,
  children,
  titleFormatter,
}: ListProps<T>) => {
  const renderItem = (item: T, index: number) => {
    const title = titleFormatter ? titleFormatter(item) : String(item);
    if (children) {
      return <li key={index}>{children(item)}</li>;
    }
    return (
      <li
        key={index}
        onClick={() => {
          if (onClick) onClick(index);
        }}
      >
        {title}
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
