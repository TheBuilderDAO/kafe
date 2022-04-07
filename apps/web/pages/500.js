import Image from 'next/image';
import Light500 from 'public/assets/images/light500.svg';
import Dark500 from 'public/assets/images/dark500.svg';
import { useTheme } from 'next-themes';
export default function Custom500() {
  const { theme } = useTheme();
  return (
    <section className="max-w-[1000px] h-screen flex justify-center items-center flex-col">
      {theme === 'light' ? (
        <Image src={Light500} width={668} height={418} alt="404" />
      ) : (
        <Image src={Dark500} width={668} height={418} alt="404" />
      )}
      <div className="-mt-10 text-center">
        <div className="flex space-x-2 font-larken text-4xl">
          <p className="leading-none">something has gone</p>
          <div className="rotate-180 leading-none">wrong</div>
        </div>
        <p className="leading-loose py-4">
          grab a coffee and we'll get right on it
        </p>
      </div>
    </section>
  );
}
