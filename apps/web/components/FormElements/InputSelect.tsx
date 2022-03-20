import React from 'react';
import { useTheme } from 'next-themes';
import Select from 'react-select';

const InputSelect = ({
  options,
  inputRef,
  onChange,
  placeholder,
  multiselect = true,
}) => {
  const { theme } = useTheme();
  options = options.map(option => ({
    value: option,
    label: option,
  }));
  const innerTheme = theme;

  const toggleBg = theme === 'dark' ? '#1E1C1E' : '#EAE4D9';
  const toggleText = theme === 'dark' ? '#EAE4D9' : '#1E1C1E';
  const customStyles = {
    control: provided => ({
      ...provided,
      backgroundColor: 'none',
      border: 'none',
      padding: '10px',
      maxWidth: '400px',
      borderRadius: '20px',
      minHeight: '60px',
      marginTop: '10px',
      cursor: 'pointer',
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
    placeholder: (provided, state) => ({
      ...provided,
      display: state.isFocused ? 'none' : 'block',
    }),

    input: provided => ({
      ...provided,
      color: toggleText,
      '&:focus': {},
    }),
  };
  return (
    <div className="w-60 xl:w-full dark:bg-kafedarker bg-kafelighter rounded-2xl">
      <Select
        options={options}
        onChange={onChange}
        isMulti={multiselect}
        ref={inputRef}
        isSearchable
        className="text-kafered"
        classNamePrefix=""
        placeholder={placeholder || 'Select tags'}
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
    </div>
  );
};

export default InputSelect;
