import React from 'react';
import { useTheme } from 'next-themes';
import Select from 'react-select';

const InputSelect = ({ options }) => {
  const { theme } = useTheme();
  options = options.map(option => ({
    value: option,
    label: option,
  }));
  const innerTheme = theme;

  const toggleBg = theme === 'dark' ? '#131213' : '#FCFBF9';
  const toggleText = theme === 'dark' ? '#EAE4D9' : '#1E1C1E';
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: toggleBg,
      border: 'none',
      padding: '10px',
      maxWidth: '400px',
      borderRadius: '20px',
      minHeight: '60px',
      marginTop: '10px',
    }),

    menu: provided => ({
      ...provided,
      backgroundColor: toggleBg,
    }),

    indicatorSeparator: provided => ({
      ...provided,
      display: 'none',
    }),

    menuList: provided => ({
      ...provided,
      backgroundColor: toggleBg,
      color: toggleText,
    }),

    valueContainer: provided => ({
      ...provided,
      color: toggleText,
    }),
    multiValue: provided => ({
      ...provided,
      background: theme === 'dark' ? '#EB5F49' : '#9462F7',
      color: 'white',
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: 'white',
    }),
  };
  return (
    <Select
      options={options}
      isMulti
      isSearchable
      className="text-kafered"
      classNamePrefix="text-kafeblack dark:text-white-200 text-kafeblack"
      placeholder="Select tags"
      styles={customStyles}
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

export default InputSelect;
