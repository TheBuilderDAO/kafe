import { connectSortBy } from 'react-instantsearch-dom';

const SortBy = ({ items, refine, createURL }) => (
  <ul>
    {items.map(item => (
      <li key={item.value}>
        <a
          href={createURL(item.value)}
          style={{ fontWeight: item.isRefined ? 'bold' : '' }}
          onClick={event => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
);

export default connectSortBy(SortBy);
