import Image from 'next/image';
import Light404 from 'public/assets/images/light404.svg';
import Dark404 from 'public/assets/images/dark404.svg';
import { useTheme } from 'next-themes';
export default function Custom404() {
  const { theme } = useTheme();
  return (
    <section className="max-w-[1000px] h-screen flex justify-center items-center flex-col">
      {theme === 'light' ? (
        <Image src={Light404} width={668} height={418} alt="404" />
      ) : (
        <Image src={Dark404} width={668} height={418} alt="404" />
      )}
      <div className="-mt-10 flex flex-col items-center">
        <div className="flex space-x-2 font-larken text-4xl">
          <p className="leading-none">something has gone</p>
          <div className="rotate-180 leading-none">wrong</div>
        </div>
        <p className="leading-loose py-4">
          last time we checked, that page doesn't exist
        </p>
      </div>
    </section>
  );
}
