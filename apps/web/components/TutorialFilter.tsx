import React from 'react';
import Select, {
  components,
  DropdownIndicatorProps,
  ControlProps,
} from 'react-select';
import { VscTriangleDown } from 'react-icons/vsc';
import { useTheme } from 'next-themes';

const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
  return (
    <components.DropdownIndicator {...props}>
      <VscTriangleDown />
    </components.DropdownIndicator>
  );
};

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}> {children}</components.Control>
);

const TutorialFilter = () => {
  const { theme } = useTheme();
  const innerTheme = theme;

  const toggleBg = theme === 'dark' ? '#131213' : '#FCFBF9';
  const toggleText = theme === 'dark' ? '#EAE4D9' : '#1E1C1E';
  const toggleHover = theme === 'dark' ? '#EB5F49' : '#EFBB73';

  const customStyles = {
    control: provided => ({
      ...provided,
      backgroundColor: 'none',
      padding: '0',
      borderRadius: '20px',
      minHeight: '60px',
      marginTop: '5px',
      border: '0',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }),

    menu: provided => ({
      ...provided,
      backgroundColor: toggleBg,
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: toggleText,
      fontSize: '1.5em',
      cursor: 'pointer',
      '&:hover': {
        color: toggleHover,
      },
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

    placeholder: (provided, state) => ({
      ...provided,
      color: toggleText,
      display: state.isFocused && 'none',
    }),

    input: (provided, state) => ({
      ...provided,
      color: toggleText,
      outline: 'none',
      border: 'none',
    }),
  };
  return (
    <div>
      <div>
        <p>sort by</p>
        <Select
          options={[
            { label: 'popularity', value: 'popularity' },
            { label: 'date published', value: 'date published' },
            { label: 'total engagement', value: 'total engagement' },
          ]}
          components={{ Control, DropdownIndicator }}
          styles={customStyles}
          placeholder="select"
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
    </div>
  );
};

export default TutorialFilter;
