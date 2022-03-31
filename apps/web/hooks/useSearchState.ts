import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import qs from 'qs';

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = searchState =>
  searchState ? createURL(searchState) : '';

const urlToSearchState = ({ query }) => qs.parse(query);

const DEBOUNCE_TIME = 400;

const useSearchState = () => {
  const router = useRouter();

  const [searchState, setSearchState] = useState(urlToSearchState(router));
  const debouncedSetStateRef = useRef(null);

  function onSearchStateChange(updatedSearchState) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      const newRelativePathQuery =
        router.pathname + searchStateToUrl(updatedSearchState);
      history.pushState(null, '', newRelativePathQuery);
    }, DEBOUNCE_TIME);

    setSearchState(updatedSearchState);
  }

  useEffect(() => {
    setSearchState(urlToSearchState(router));
  }, [router.route]);

  return { searchState, onSearchStateChange, createURL };
};

export default useSearchState;
