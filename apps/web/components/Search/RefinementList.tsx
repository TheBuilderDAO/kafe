import { Highlight, connectRefinementList } from 'react-instantsearch-dom';

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
}) => (
  <ul>
    {items.map(item => (
      <li key={item.label}>
        <a
          href={createURL(item.value)}
          style={{ fontWeight: item.isRefined ? 'bold' : '' }}
          onClick={event => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          {isFromSearch ? (
            <Highlight attribute="label" hit={item} />
          ) : (
            item.label
          )}{' '}
          ({item.count})
        </a>
      </li>
    ))}
  </ul>
);

export default connectRefinementList(RefinementList);
