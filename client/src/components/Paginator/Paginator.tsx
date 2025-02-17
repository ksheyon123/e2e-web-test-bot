import React from "react";
import "./Paginator.css";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  showCurrentPageOnly?: boolean;
  showPageCount?: boolean;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  showCurrentPageOnly = false,
  showPageCount = false,
}) => {
  const handleFirstPage = () => onPageChange(1);
  const handleLastPage = () => onPageChange(totalPages);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));

  const getPageNumbers = () => {
    if (!showNumbers) return [];
    if (showCurrentPageOnly) return [currentPage];
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="paginator" role="navigation" aria-label="pagination">
      <button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        aria-label="first page"
      >
        <MdFirstPage />
      </button>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="previous page"
      >
        <MdNavigateBefore />
      </button>
      {showNumbers &&
        getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "active" : ""}
            aria-label={`page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {showCurrentPageOnly && showPageCount
              ? `${currentPage} / ${totalPages}`
              : page}
          </button>
        ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="next page"
      >
        <MdNavigateNext />
      </button>
      <button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        aria-label="last page"
      >
        <MdLastPage />
      </button>
    </div>
  );
};

export default Paginator;
