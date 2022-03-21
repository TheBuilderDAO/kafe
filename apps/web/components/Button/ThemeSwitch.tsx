import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Button from './';
import DarkModeSVG from '../SVG/DarkModeSVG';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // NOTE: This is a hack that makes sure the component is mounted before we attempt to set the theme.
  // Without this, things will crash.
  useEffect(() => setMounted(true), []);

  const toggleDarkMode = () => {
    mounted
      ? setTheme(
          theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark',
        )
      : null;
  };
  return (
    <Button handleClick={toggleDarkMode}>
      <DarkModeSVG iconSize={20} />
    </Button>
  );
};

export default ThemeSwitch;
