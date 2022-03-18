import Image from 'next/image';
import Link from 'next/link';
import Tags from '@app/components/Tags/Tags';
export interface TutorialCardProps {
  tutorial: {
    title: string;
    description: string;
    imageUrl: string;
    href: string;
    authors: {
      name: string;
      avatarUrl: string;
      nickname: string;
    }[];
    categories: {
      name: string;
      slug: string;
    }[];
  };
  defaultAvatar: string;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  defaultAvatar,
}) => {
  const { categories } = tutorial;
  return (
    <div
      key={tutorial.title}
      className="p-10 mb-5 border-[1px] border-kafeblack dark:border-kafewhite tutorial bg-kafelight dark:bg-kafedark min-w-[700px] text-kafeblack dark:text-kafewhite bg-kafewhite dark:bg-kafeblack"
    >
      <div className="flex items-center mb-10">
        <p>Guide by</p>
        {tutorial.authors.map(author => (
          <a key={author.nickname} href={author.nickname} className="mx-2">
            <span className="sr-only">{author.name}</span>
            <Image
              src={author.avatarUrl ? author.avatarUrl : defaultAvatar}
              alt="avatar"
              width={25}
              height={25}
            />
          </a>
        ))}
        <div>
          <p className="text-sm font-bold">
            {tutorial.authors.map(author => (
              <a
                key={author.nickname}
                href={author.nickname}
                className="hover:underline"
              >
                {author.name}
              </a>
            ))}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0"></div>
      <div className="flex flex-col justify-between flex-1">
        <div className="flex-1">
          <Link href={tutorial.href} passHref>
            <a className="block">
              <h2 className="mb-2 text-4xl font-larken">{tutorial.title}</h2>
              <p className="text-l leading-8 max-w-[80%] text-ellipsis mb-12">
                {tutorial.description}
              </p>
            </a>
          </Link>
        </div>
        <Tags tags={categories.map(category => category.name)} />
      </div>
    </div>
  );
};
