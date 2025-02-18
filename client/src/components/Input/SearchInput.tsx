import React, { KeyboardEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import BaseInput, { BaseInputProps } from "./BaseInput";
import "./SearchInput.css";

export interface SearchInputProps
  extends Omit<BaseInputProps, "className" | "type"> {
  /** 검색 실행 시 호출되는 콜백 함수 */
  onSearch?: (value: string) => void;
  /** 입력 필드의 너비 */
  width?: string;
}

const SearchInput = ({
  value,
  onChange,
  onSearch,
  disabled = false,
  width = "100%",
  placeholder = "검색어를 입력하세요",
  ...props
}: SearchInputProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className={`search-input-container ${
        disabled ? "search-input-container-disabled" : ""
      }`}
      style={{ width }}
      data-testid="search-input-container"
    >
      <div className="search-input-icon">
        <FiSearch data-testid="search-icon" />
      </div>
      <BaseInput
        {...props}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        data-testid="search-input"
        className="search-input"
      />
      {value && (
        <button
          type="button"
          className="search-input-clear"
          onClick={handleClear}
          data-testid="clear-button"
          disabled={disabled}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
