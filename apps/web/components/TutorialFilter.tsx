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

// Uncomment for styled filter component
// const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <VscTriangleDown />
//     </components.DropdownIndicator>
//   );
// };

// const Control = ({ children, ...props }: ControlProps) => (
//   <components.Control {...props}> {children}</components.Control>
// );

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
    // Leaving this in, as it will be useful for styling this component
    // <div className="divide-y-2 dark:divide-kafeblack divide-kafewhite">
    //   <div className="px-10 pt-5">
    //     <p className="text-kafemellow">sort by</p>
    //     <Select
    //       instanceId="sort-by"
    //       options={[
    //         { label: 'popularity', value: 'popularity' },
    //         { label: 'date published', value: 'date published' },
    //         { label: 'total engagement', value: 'total engagement' },
    //       ]}
    //       components={{ Control, DropdownIndicator }}
    //       styles={customStyles}
    //       placeholder="select"
    //       theme={theme => ({
    //         ...theme,
    //         borderRadius: 0,
    //         colors: {
    //           ...theme.colors,
    //           primary25: innerTheme === 'dark' ? '#EB5F49' : '#9462F7',
    //           primary: 'none',
    //         },
    //       })}
    //     />
    //   </div>
    //   <div className="px-10 pt-5">
    //     <p className="text-kafemellow">protocols</p>
    //     <Select
    //       options={[
    //         { label: 'Celo', value: 'Celo' },
    //         { label: 'Chainlink', value: 'Chainlink' },
    //         { label: 'Arweave', value: 'Arweave' },
    //       ]}
    //       instanceId="protocols"
    //       components={{ Control, DropdownIndicator }}
    //       styles={customStyles}
    //       isMulti
    //       placeholder="select"
    //       theme={theme => ({
    //         ...theme,
    //         borderRadius: 0,
    //         colors: {
    //           ...theme.colors,
    //           primary25: innerTheme === 'dark' ? '#EB5F49' : '#9462F7',
    //           primary: 'none',
    //         },
    //       })}
    //     />
    //   </div>
    //   <div className="px-10 pt-5 pb-8">
    //     <p className="pb-5 text-kafemellow">difficulty</p>
    //     <InputCheckbox options={['BEGINNER', 'ADVANCED']} name="diff" />
    //   </div>
    // </div>
    <>
      <div className="mb-5 w-60">
        <div className="p-5 text-gray-500 shadow sm:rounded-lg">
          <div className="mb-6">
            <h2 className="font-bold">Sort by</h2>
            <SortBy
              defaultRefinement={`${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_desc`}
              items={[
                {
                  value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_desc`,
                  label: 'Most votes',
                },
                {
                  value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_number_of_votes_asc`,
                  label: 'Least votes',
                },
              ]}
            />
          </div>
          <div className="mb-6">
            <h2 className="font-bold">Tags</h2>
            <RefinementList attribute="tags" />
          </div>
          <div className="mb-6">
            <h2 className="font-bold">Difficulty</h2>
            <MenuSelect attribute="difficulty" />
          </div>
          <ClearRefinements />
        </div>
      </div>
    </>
  );
};

export default TutorialFilter;
