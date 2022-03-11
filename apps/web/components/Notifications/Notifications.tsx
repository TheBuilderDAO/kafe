import toast, { Toaster } from "react-hot-toast";

export const Notifications = () => {
    return (
      <>
        <Toaster
          position="bottom-left"
          reverseOrder={true}
          toastOptions={{className: "dark:bg-kafelighter dark:text-kafedarker dark:border-kafegold dark:border"}}
        />
      </>

    );
  };
  