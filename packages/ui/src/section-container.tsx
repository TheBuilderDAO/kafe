/**
 *  renders the section container keeps the content size good responsively
 * @param childrena content
 * @returns
 */
export const SectionContainer: React.FC = ({ children }) => {
  return (
    <div className="z-10 min-w-[500px] px-4 text-sm leading-6">{children}</div>
  );
};
