export const Hint: React.FC<{
  type: 'success' | 'warning' | 'info' | 'tip';
}> = ({ type, children }) => {
  const getBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-200';
      case 'warning':
        return 'bg-orange-200';
      case 'info':
        return 'bg-blue-200';
      case 'tip':
        return 'bg-gray-200';
      default:
        return 'bg-gray-200';
    }
  };
  return (
    <div
      className={`w-full mt-2 mb-4 p-2 px-4 border-2 rounded-lg border-kafedarker ${getBg()} dark:text-kafeblack`}
    >
      {children}
    </div>
  );
};
