import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';
import { Link } from '..';

export const WhatsNextSection: React.FC<{
  title: string;
  link: string;
  image: string;
}> = ({ children, title, link, image, ...rest }) => {
  return (
    <Link href={link}>
      <section className="grid grid-cols-2 gap-10 p-4 bg-gray-100 cursor-pointer rounded-3xl">
        <div className="rounded-lg shadow ">
          <img src={image} className="object-fill h-48 w-96" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-600">Whats Next!?</h3>
          <h1>{title}</h1>
          <p>{children}</p>
        </div>
      </section>
    </Link>
  );
};
