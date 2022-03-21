import React from 'react';
import Identicon from 'react-identicons';
import { addEllipsis } from 'utils/strings';
import { useTheme } from 'next-themes';

type UserAvatarProps = {
  address: string;
  size?: number;
  ellipsis: boolean;
  bg?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { theme } = useTheme();
  const {
    address,
    size = 25,
    bg = theme === 'dark' ? '#EB5F49' : '#EFBB73',
    ellipsis = true,
  } = props;

  return (
    <div className="flex items-center">
      <div className="mx-2 rounded-full w-[25px] h-[25px] overflow-hidden lg:flex">
        <Identicon string={address} size={size} bg={bg} />
      </div>
      {ellipsis && (
        <p className="hidden lg:block text-xs">{addEllipsis(address)}</p>
      )}
      {!ellipsis && <p className="hidden lg:block text-xs">{address}</p>}
    </div>
  );
};

export default UserAvatar;
