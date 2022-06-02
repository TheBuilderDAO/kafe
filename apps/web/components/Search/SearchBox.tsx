import { useCallback } from 'react';
import { useRef } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import useKeyboardJs from 'react-use/lib/useKeyboardJs';

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  const [isPressed] = useKeyboardJs('command + k');
  const ref = useRef(null);
  if (isPressed) {
    ref.current.focus();
  }
  return (
    <form noValidate action="" role="search" className="flex flex-row mb-4">
      <div className="flex-1">
        <label
          htmlFor="search"
          className="sr-only block text-sm font-medium text-gray-700"
        >
          Quick search
        </label>
        <div className="mt-1 relative flex items-center">
          <input
            type="search"
            ref={ref}
            className="shadow-sm focus:ring-kafered focus:border-kafered block w-full text-black sm:text-sm border-gray-300 rounded-md py-4"
            value={currentRefinement}
            onChange={event => refine(event.currentTarget.value)}
            placeholder="Search..."
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
              {' '}
              ⌘K{' '}
            </kbd>
          </div>
        </div>
      </div>
    </form>
  );
};

export default connectSearchBox(SearchBox);
