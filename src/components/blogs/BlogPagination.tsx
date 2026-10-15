import Link from "next/link";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getPageItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);
  for (
    let page = Math.max(1, currentPage - 2);
    page <= Math.min(totalPages, currentPage + 2);
    page += 1
  ) {
    pages.add(page);
  }

  const items: (number | "ellipsis")[] = [];
  let previousPage = 0;
  for (const page of [...pages].sort((first, second) => first - second)) {
    if (previousPage > 0 && page - previousPage > 1) items.push("ellipsis");
    items.push(page);
    previousPage = page;
  }
  return items;
}

function pageHref(page: number) {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

export function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="blogs-pagination" aria-label="Blog pages">
      {currentPage > 1 ? (
        <Link
          className="blogs-pagination-link"
          href={pageHref(currentPage - 1)}
          rel="prev"
        >
          Previous
        </Link>
      ) : (
        <span className="blogs-pagination-link is-disabled">Previous</span>
      )}

      <div className="blogs-pagination-pages">
        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="blogs-pagination-ellipsis"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Link
              key={item}
              className="blogs-pagination-page"
              href={pageHref(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          className="blogs-pagination-link"
          href={pageHref(currentPage + 1)}
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span className="blogs-pagination-link is-disabled">Next</span>
      )}
    </nav>
  );
}
