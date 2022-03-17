import React from 'react';
import Select, {
  components,
  DropdownIndicatorProps,
  ControlProps,
} from 'react-select';
import { VscTriangleDown } from 'react-icons/vsc';
import { useTheme } from 'next-themes';
import InputCheckbox from './FormElements/InputCheckbox';
import SortBy from '@app/components/Search/SortBy';
import RefinementList from './Search/RefinementList';
import MenuSelect from './Search/MenuSelect';
import ClearRefinements from './Search/ClearRefinements';
import algoliasearch from 'algoliasearch/lite';
import SearchBox from './Search/SearchBox';
import { NEXT_PUBLIC_ALGOLIA_INDEX_NAME } from '@app/constants';

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
      width: '500px',
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
        <SortBy
          defaultRefinement={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_desc`}
          items={[
            {
              value: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_desc`,
              label: 'Most votes',
            },
            {
              value: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_asc`,
              label: 'Least votes',
            },
          ]}
          Control={Control}
          DropdownIndicator={DropdownIndicator}
          customStyles={customStyles}
        />
      </div>
      <div className="px-10 pt-5">
        <p className="text-kafemellow">protocols</p>
        <RefinementList
          attribute="tags"
          Control={Control}
          DropdownIndicator={DropdownIndicator}
          customStyles={customStyles}
        />
      </div>
      <div className="px-10 pt-5">
        <p className="text-kafemellow pb-5">difficulty</p>
        <MenuSelect attribute="difficulty" />
      </div>
    </div>
  );
};

export default TutorialFilter;
