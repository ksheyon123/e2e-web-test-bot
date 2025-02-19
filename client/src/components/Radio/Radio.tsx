import React from "react";
import "./Radio.css";

interface RadioItem {
  id: string;
  label: string;
}

export interface RadioProps {
  /** 라디오 버튼 아이템 목록 */
  items: RadioItem[];
  /** 클릭 이벤트 핸들러 */
  onClick: (item: RadioItem) => void;
  /** 선택된 값 */
  selectedValue?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 라디오 그룹의 이름 */
  name?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 레이아웃 방향 (vertical 또는 horizontal) */
  direction?: "vertical" | "horizontal";
}

const Radio = ({
  items,
  onClick,
  selectedValue,
  disabled = false,
  name = "radio-group",
  className = "",
  direction = "vertical",
}: RadioProps) => {
  return (
    <div className={`radio-group ${direction} ${className}`} role="radiogroup">
      {items.map((item) => (
        <label
          key={item.id}
          className={`radio-label ${disabled ? "radio-disabled" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={item.id}
            checked={selectedValue === item.id}
            disabled={disabled}
            onChange={() => onClick(item)}
            className="radio-input"
          />
          <span className="radio-text">{item.label}</span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
