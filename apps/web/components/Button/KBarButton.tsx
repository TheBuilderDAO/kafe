import { useKBar } from 'kbar';

export const KBarButton = () => {
  const { query } = useKBar();
  return (
    <div
      onClick={query.toggle}
      className="relative flex items-center justify-center  h-full mr-1 cursor-pointer"
    >
      <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-kafewhite w-10 h-10">
        {' '}
        ⌘K{' '}
      </kbd>
    </div>
  );
};
