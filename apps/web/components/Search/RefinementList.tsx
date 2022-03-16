import { Highlight, connectRefinementList } from 'react-instantsearch-dom';
import Select from 'react-select';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const RefinementList = ({
  items,
  refine,
  Control,
  DropdownIndicator,
  customStyles,
  isFromSearch,
}) => {
  const { theme } = useTheme();
  const innerTheme = theme;
  const [filteredItems, setFilteredItems] = useState('');

  const handleMenuChange = (options, meta) => {
    options.map(option => {
      refine(option.value);
    });
    setFilteredItems(options);
  };
  return (
    <Select
      instanceId="tags"
      isMulti
      options={items}
      value={items.find(item => filteredItems.includes(item.value))}
      components={{ Control, DropdownIndicator }}
      styles={customStyles}
      placeholder="select"
      onChange={handleMenuChange}
      theme={theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: innerTheme === 'dark' ? '#EB5F49' : '#9462F7',
          primary: 'none',
        },
      })}
    />
  );
};

export default connectRefinementList(RefinementList);
