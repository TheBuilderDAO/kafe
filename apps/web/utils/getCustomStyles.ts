function getCustomStyles(theme) {
  const toggleBg = theme === 'dark' ? '#131213' : '#FCFBF9';
  const toggleText = theme === 'dark' ? '#EAE4D9' : '#1E1C1E';
  const toggleHover = theme === 'dark' ? '#EB5F49' : '#EFBB73';

  return {
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

    input: provided => ({
      ...provided,
      color: toggleText,
      outline: 'none',
      fontSize: 'larger',
    }),
  };
}

export default getCustomStyles;
