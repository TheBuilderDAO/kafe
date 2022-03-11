import React from 'react';
import { Link } from '@builderdao/ui';

const Header = props => {
  return (
    <div>
      <div>
        <Link href="/tutorials/propose">Propose Tutorial</Link>
      </div>
      <div>
        <Link href="/tutorials">Search</Link>
      </div>
    </div>
  );
};

export default Header;
