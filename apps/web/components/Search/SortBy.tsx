import { connectSortBy } from 'react-instantsearch-dom';
import Select from 'react-select';
import { useTheme } from 'next-themes';

type Item = {
  value?: string;
};

const SortBy = ({
  items,
  refine,
  Control,
  DropdownIndicator,
  customStyles,
}) => {
  const { theme } = useTheme();
  const innerTheme = theme;
  return (
    <Select
      instanceId="sort-by"
      options={items}
      components={{ Control, DropdownIndicator }}
      styles={customStyles}
      placeholder="select"
      onChange={(item: Item) => refine(item.value)}
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

export default connectSortBy(SortBy);
