/**
 *  renders the section container keeps the content size good responsively
 * @param childrena content
 * @returns
 */
export const SectionContainer: React.FC = ({ children }) => {
  return (
    <div className="z-10 w-full max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-6xl xl:px-0">
      {children}
    </div>
  );
};
