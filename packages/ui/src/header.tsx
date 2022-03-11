import Image from 'next/image';
import { Link } from '.';
import logo from './logo.png';

export const Header: React.FC = ({ children }) => {
  return (
    <header className="flex items-center justify-between w-full max-w-6xl px-8 py-10">
      <div>
        <Link href="/" aria-label="Tailwind CSS Blog">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center mr-3">
              BuilderDAO
              <Image src={logo} width={200} height={40} />
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5">
        <div className="hidden sm:block">TODO</div>
        <div>{children}</div>
      </div>
    </header>
  );
};
