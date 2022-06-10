import React from 'react';
import ReactTooltip, { TooltipProps } from 'react-tooltip';
import { useTheme } from 'next-themes';

interface Props extends TooltipProps {}

const Tooltip = (props: Props) => {
  const { theme } = useTheme();

  let type: TooltipProps['type'];

  if (theme === 'dark') {
    type = 'light';
  } else {
    type = 'dark';
  }

  return <ReactTooltip type={type} {...props} />;
};

export default Tooltip;
