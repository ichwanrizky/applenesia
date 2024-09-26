type PaginationProps = {
  currentPage: number;
  TOTAL_PAGES: number;
  MAX_PAGINATION: number;
  setCurrentPage: (page: number) => void;
};

const Pagination = (props: PaginationProps) => {
  const { currentPage, setCurrentPage, TOTAL_PAGES, MAX_PAGINATION } = props;

  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGINATION / 2));

  for (
    let i = startPage;
    i <= Math.min(TOTAL_PAGES, startPage + MAX_PAGINATION - 1);
    i++
  ) {
    pageNumbers.push(
      <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
        <button
          className="page-link waves-effect"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      </li>
    );
  }

  if (TOTAL_PAGES > MAX_PAGINATION) {
    // Add an ellipsis for additional pages
    if (startPage > 1) {
      pageNumbers.unshift(
        <li key={1} className="page-item disabled">
          <span className="page-link waves-effect">...</span>
        </li>
      );
    }
    if (startPage + MAX_PAGINATION - 1 < TOTAL_PAGES) {
      pageNumbers.push(
        <li key={TOTAL_PAGES} className="page-item disabled">
          <span className="page-link waves-effect">...</span>
        </li>
      );
    }
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link waves-effect"
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>
        </li>
        {pageNumbers}
        <li
          className={`page-item ${
            currentPage === TOTAL_PAGES ? "disabled" : ""
          }`}
        >
          <button
            className="page-link waves-effect"
            onClick={() => setCurrentPage(TOTAL_PAGES)}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
