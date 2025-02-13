import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Dropdown.css";

interface DropdownProps<T> {
  options: T[];
  onSelect: (value: T, index: number) => void;
  placeholder: string;
  disabled?: boolean;
  children?: (option: T) => React.ReactNode;
}

const Dropdown = <T,>({
  options,
  onSelect,
  placeholder,
  disabled = false,
  children,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleSelect = (option: T, index: number) => {
    const { name } = option as T & { name: string };
    setSelectedOption(name as string);
    setIsOpen(false);
    onSelect(option, index);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`dropdown ${disabled ? "disabled" : ""}`} ref={dropdownRef}>
      <div
        className="dropdown-header"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption || placeholder}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-options" role="listbox">
          {options.map((option: T, index: number) => (
            <li
              key={index}
              onClick={() => handleSelect(option, index)}
              role="option"
              aria-selected={option === selectedOption}
            >
              {children
                ? children(option)
                : ((option as T & { name: string }).name as string)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
