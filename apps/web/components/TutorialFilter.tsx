import React from 'react';
import Select, {
  components,
  DropdownIndicatorProps,
  ControlProps,
} from 'react-select';
import { VscTriangleDown } from 'react-icons/vsc';
import { useTheme } from 'next-themes';
import InputCheckbox from './FormElements/InputCheckbox';

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
      padding: '0px',
      minHeight: '50px',
      margin: '0px',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      transform: 'scale(1.05)',
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

    singleValue: provided => ({
      ...provided,
      color: toggleText,
      margin: '0px',
      padding: '0px',
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
      fontSize: 'larger',
    }),
  };
  return (
    <div className="divide-y-2 dark:divide-kafeblack divide-kafewhite">
      <div className="px-10 pt-5">
        <p className="text-kafemellow">sort by</p>
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
      <div className="px-10 pt-5">
        <p className="text-kafemellow">protocols</p>
        <Select
          options={[
            { label: 'Celo', value: 'Celo' },
            { label: 'Chainlink', value: 'Chainlink' },
            { label: 'Arweave', value: 'Arweave' },
          ]}
          components={{ Control, DropdownIndicator }}
          styles={customStyles}
          isMulti
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
      <div className="px-10 pt-5 pb-8">
        <p className="text-kafemellow pb-5">difficulty</p>
        <InputCheckbox options={['BEGINNER', 'ADVANCED']} />
      </div>
    </div>
  );
};

export default TutorialFilter;
