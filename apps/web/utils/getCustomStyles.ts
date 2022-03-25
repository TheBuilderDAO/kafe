function getCustomStyles(theme) {
  const dark = theme === 'dark';
  const kafeblack = '#1E1C1E';
  const kafewhite = '#EAE4D9';
  const kafelighter = '#FCFBF9';
  const kafedarker = '#131213';
  const kafegold = '#EFBB73';
  const kafered = '#EB5F49';
  const kafepurple = '#9462F7';
  const toggleBg = dark ? kafedarker : kafelighter;
  const toggleText = dark ? kafelighter : kafedarker;
  const toggleHover = dark ? kafegold : kafepurple;

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

    option: (provided, state) => ({
      ...provided,
      color: state.isSelected
        ? dark
          ? kafegold
          : kafepurple
        : dark
        ? kafewhite
        : kafeblack,
      '&:hover': {
        color: !state.isSelected && (dark ? kafeblack : kafewhite),
      },
    }),

    menu: provided => ({
      ...provided,
      backgroundColor: toggleBg,
    }),

    dropdownIndicator: provided => ({
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
