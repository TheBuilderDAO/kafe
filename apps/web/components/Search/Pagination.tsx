import { connectPagination } from 'react-instantsearch-dom';

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => {
  return (
    <nav
      className="relative z-0 inline-flex rounded-md mb-40 mt-10"
      aria-label="Pagination"
    >
      {new Array(nbPages).fill(null).map((_, index) => {
        const page = index + 1;

        return (
          <a
            key={index}
            href={createURL(page)}
            className={`px-8 py-2 mr-4 rounded-3xl  ${
              currentRefinement === page
                ? 'bg-kafelighter dark:bg-kafedarker'
                : null
            } text-sm font-medium text-kafeblack dark:text-kafewhite hover:bg-kafelighter dark:hover:bg-kafewhite dark:hover:text-kafeblack`}
            onClick={event => {
              event.preventDefault();
              refine(page);
              window.scrollTo(0, 0);
            }}
          >
            {page}
          </a>
        );
      })}
    </nav>
  );
};

export default connectPagination(Pagination);
