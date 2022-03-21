import { VscTriangleDown } from 'react-icons/vsc';
import { DropdownIndicatorProps, components } from 'react-select';

const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
  return (
    <components.DropdownIndicator {...props}>
      <VscTriangleDown />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
