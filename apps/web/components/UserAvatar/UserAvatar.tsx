import React from 'react';
import Identicon from 'react-identicons';
import { addEllipsis } from 'utils/strings';

type UserAvatarProps = {
  address: string;
  size?: number;
  bg?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { address, size = 25, bg = 'white' } = props;

  return (
    <>
      <div className="mx-2 rounded-full w-[25px] h-[25px] overflow-hidden">
        <Identicon string={address} size={size} bg={bg} />
      </div>
      <p className="hidden">{addEllipsis(address)}</p>
    </>
  );
};

export default UserAvatar;
