import React from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
  return (
    <components.DropdownIndicator {...props}>
      <FontAwesomeIcon icon="fa-solid fa-caret-down" />
    </components.DropdownIndicator>
  );
};

const TutorialFilter = () => {
  const theme = 'dark';

  const toggleBg = theme === 'dark' ? '#131213' : '#FCFBF9';
  const toggleText = theme === 'dark' ? '#EAE4D9' : '#1E1C1E';
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: toggleBg,
      border: 'none',
      padding: '0',
      borderRadius: '20px',
      minHeight: '60px',
      marginTop: '5px',
    }),

    menu: provided => ({
      ...provided,
      backgroundColor: toggleBg,
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: 'red',
      width: '100px',
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
      padding: '0',
    }),

    placeholder: provided => ({
      ...provided,
      color: toggleText,
    }),
  };
  return (
    <div>
      <div>
        <p>sort by</p>
        <Select
          options={[
            { label: 'ey', value: 'popularity' },
            { label: 'ey', value: 'ey' },
          ]}
          components={{ DropdownIndicator }}
          styles={customStyles}
          className="m-0 p-0"
          placeholder="popularity"
        />
      </div>
    </div>
  );
};

export default TutorialFilter;
