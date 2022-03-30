import { connectPagination } from 'react-instantsearch-dom';
import { getPages } from '../../utils/pagination';
import { useMemo } from 'react';

const Pagination = props => {
  const { currentRefinement, nbPages, refine, createURL, padding = 3 } = props;

  const pages = useMemo(() => {
    return getPages(currentRefinement, nbPages, padding).map(value => ({
      key: value,
      label: value,
      value,
      selected: value === currentRefinement,
    }));
  }, [currentRefinement, nbPages, padding]);

  return (
    <nav
      className="relative z-0 flex justify-center rounded-md mb-40 mt-5"
      aria-label="Pagination"
    >
      {pages.map((page, index) => {
        return (
          <a
            key={page.key}
            href={createURL(page.value)}
            className={`px-8 py-2 mr-4 rounded-3xl  ${
              page.selected ? 'bg-kafelighter dark:bg-kafedarker' : null
            } text-sm font-medium text-kafeblack dark:text-kafewhite hover:bg-kafelighter dark:hover:bg-kafewhite dark:hover:text-kafeblack`}
            onClick={event => {
              event.preventDefault();
              refine(page.value);
              window.scrollTo(0, 0);
            }}
          >
            {page.label}
          </a>
        );
      })}
    </nav>
  );
};

export default connectPagination(Pagination);
