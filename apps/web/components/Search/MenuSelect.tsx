import { connectMenu } from 'react-instantsearch-dom';

const MenuSelect = ({ items, currentRefinement, refine }) => (
  <select
    value={currentRefinement || ''}
    onChange={event => refine(event.currentTarget.value)}
  >
    <option value="">select</option>
    {items.map(item => (
      <option
        key={item.label}
        value={item.isRefined ? currentRefinement : item.value}
      >
        {item.label}
      </option>
    ))}
  </select>
);

export default connectMenu(MenuSelect);
