import React from "react";

interface ListItem {
  id: number;
  text: string;
}

interface ListProps {
  items: ListItem[];
  onItemClick?: (id: number) => void;
}

const List: React.FC<ListProps> = ({ items, onItemClick }) => {
  return (
    <ul className="list-container" data-testid="list-container">
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onItemClick?.(item.id)}
          data-testid={`list-item-${item.id}`}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
};

export default List;
