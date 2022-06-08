import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';
import DarkModeSVG from '@app/components/SVG/DarkModeSVG';

export const useThemeActions = () => {
  const { setTheme } = useTheme();
  useRegisterActions([
    {
      id: 'theme',
      name: 'Change theme…',
      keywords: 'interface color dark light',
      section: 'Preferences',
      icon: <DarkModeSVG iconSize={20} />,
    },
    {
      id: 'darkTheme',
      name: 'Dark',
      keywords: 'dark theme',
      section: '',
      parent: 'theme',
      icon: <DarkModeSVG iconSize={20} />,
      perform: () => {
        setTheme('dark');
      },
    },
    {
      id: 'lightTheme',
      name: 'Light',
      keywords: 'light theme',
      section: '',
      parent: 'theme',
      icon: <DarkModeSVG iconSize={20} />,
      perform: () => {
        setTheme('light');
      },
    },
  ]);
};
