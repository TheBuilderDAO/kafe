const Authors = ({ date, children }) => {
  return (
    <div className="mt-8 mb-16 text-sm text-gray-400 ">
      {date} by {children}
    </div>
  );
};

export const Author = ({ name, link }) => {
  return (
    <span className="after:content-[','] last:after:content-['']">
      <a
        key={name}
        href={link}
        target="_blank"
        className="mx-1 text-gray-800 dark:text-gray-600"
        rel="noreferrer"
      >
        {name}
      </a>
    </span>
  );
};

export default Authors;
