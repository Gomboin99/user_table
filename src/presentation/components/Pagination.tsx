interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button type="button" onClick={() => onPageChange(1)} disabled={page <= 1}>
          {"<<"}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          {"<"}
        </button>
        <span className="pagination-info">
          Страница {page} из {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          {">"}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          {">>"}
        </button>
      </div>
      <div className="pagination-size">
        <span className="pagination-total">Всего: {total}</span>
      </div>
    </div>
  );
}
