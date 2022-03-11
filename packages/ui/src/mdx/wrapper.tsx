export const MDXWrapper: React.FC = ({ children }) => {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <article className="max-w-5xl px-4 prose lg:prose-xl">{children}</article>
    </section>
  );
};
