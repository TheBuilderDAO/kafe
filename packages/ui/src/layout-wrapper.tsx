import React from 'react';
import { Link } from '.';
import ThemeSwitch from './theme-switch';

export const LayoutWrapper: React.FC<{ headerNavLinks?: any[] }> = ({
  children,
  headerNavLinks,
}) => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-screen">
      <header className="flex items-center justify-between w-full max-w-6xl px-8 py-10">
        <div>
          <Link href="/" aria-label="BuilderDAO">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center mr-3">Builder DAO</div>
            </div>
          </Link>
        </div>
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block"></div>
          <ThemeSwitch />
        </div>
      </header>
      <main className="w-full mb-auto">{children}</main>
    </div>
  );
};
