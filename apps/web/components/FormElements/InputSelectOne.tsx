import Select from 'react-select';
import { useTheme } from 'next-themes';
import DropdownIndicator from '../Search/DropdownIndicator';
import getCustomStyles from '../../utils/getCustomStyles';

const InputSelectOne = ({
  items,
  placeholder = 'select',
  inputRef,
  onChange,
}) => {
  const { theme } = useTheme();
  const innerTheme = theme;
  const customStyles = getCustomStyles(theme);
  return (
    <Select
      options={items}
      components={{ DropdownIndicator }}
      styles={customStyles}
      placeholder={placeholder}
      ref={inputRef}
      onChange={onChange}
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

export default InputSelectOne;
