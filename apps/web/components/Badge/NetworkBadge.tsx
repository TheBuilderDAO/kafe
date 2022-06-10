import React from 'react';
import { NEXT_PUBLIC_SOLANA_NETWORK } from '@app/constants';

const NetworkBadge = () => {
  return (
    <span className="px-2 py-1 text-[11px] bg-red-500 z-50">
      {NEXT_PUBLIC_SOLANA_NETWORK}
    </span>
  );
};

export default NetworkBadge;
