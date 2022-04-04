import React from 'react';
import Identicon from 'react-identicons';
import { addEllipsis } from 'utils/strings';
import { useTheme } from 'next-themes';
import { AVATAR_SIZE } from '@app/constants';

type UserAvatarProps = {
  address: string;
  size?: number;
  ellipsis?: boolean;
  bg?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { theme } = useTheme();
  const {
    address,
    size = AVATAR_SIZE,
    bg = theme === 'dark' ? '#EB5F49' : '#EFBB73',
    ellipsis = true,
  } = props;

  return (
    <div className="flex items-center">
      <div className="mr-2 rounded-full w-[25px] h-[25px] overflow-hidden lg:flex">
        <Identicon string={address} size={size} bg={bg} />
      </div>
      {ellipsis && <p className="text-xs font-black">{addEllipsis(address)}</p>}
      {!ellipsis && <p className="text-xs font-black">{address}</p>}
    </div>
  );
};

export default UserAvatar;
