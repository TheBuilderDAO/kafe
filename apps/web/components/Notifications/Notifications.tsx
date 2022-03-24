import { Toaster } from 'react-hot-toast';

export const Notifications = () => {
  return (
    <Toaster
      position="bottom-left"
      reverseOrder={true}
      toastOptions={{
        className:
          'bg-kafepurple text-kafeblack text-md dark:bg-kafegold dark:text-kafeblack dark:border-kafedarker dark:border border-kafepurple',
        success: {
          className: 'dark:bg-kafepurple dark:text-kafeblack',
        },
        error: {
          className: 'dark:bg-kafered dark:text-kafeblack',
        },
      }}
    />
  );
};
