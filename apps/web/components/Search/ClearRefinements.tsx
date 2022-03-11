import { connectCurrentRefinements } from 'react-instantsearch-dom';

const ClearRefinements = ({ items, refine }) => (
  <button
    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
    onClick={() => refine(items)}
    disabled={!items.length}
  >
    Clear all refinements
  </button>
);

export default connectCurrentRefinements(ClearRefinements);
