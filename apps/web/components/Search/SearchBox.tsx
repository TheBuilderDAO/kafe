import { connectSearchBox } from 'react-instantsearch-dom';

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <form noValidate action="" role="search">
    <div>
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        type="search"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-black sm:text-sm border-gray-300 rounded-md"
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
        placeholder="Search..."
      />
    </div>
    <button
      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => refine('')}
    >
      Reset query
    </button>
    {isSearchStalled ? 'My search is stalled' : ''}
  </form>
);

export default connectSearchBox(SearchBox);
