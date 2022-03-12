import { connectPagination } from 'react-instantsearch-dom';

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <nav
    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
    aria-label="Pagination"
  >
    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1;

      return (
        <a
          key={index}
          href={createURL(page)}
          className="px-8 py-2 mr-2 rounded-3xl border border-kafeblack dark:border-kafewhite bg-kafelighter dark:bg-kafedarker text-sm font-medium text-kafeblack dark:text-kafewhite hover:bg-kafegold dark:hover:bg-kafegold dark:hover:text-kafeblack"
          onClick={event => {
            event.preventDefault();
            refine(page);
          }}
        >
          {page}
        </a>
      );
    })}
  </nav>
);

export default connectPagination(Pagination);
