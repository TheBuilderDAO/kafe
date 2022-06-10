/**
 *  renders the section container keeps the content size good responsively
 * @param childrena content
 * @returns
 */
export const SectionContainer: React.FC = ({ children }) => {
  return (
    <div className="z-10 md:min-w-[500px] md:px-4 text-sm leading-6">
      {children}
    </div>
  );
};
