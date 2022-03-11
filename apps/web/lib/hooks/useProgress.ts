import React from 'react';
import ScrollProgress from 'scrollprogress';

// TODO: Move this to a @builderdao/hooks package.
const useProgress = () => {
  const [readingProgress, setReadingProgress] = React.useState(0);
  React.useEffect(() => {
    /**
     * Use Framer Motion's useViewportScroll to get the current scroll
     * position in the viewport and save it in the state
     */

    new ScrollProgress((x, y) => {
      setReadingProgress(y);
    });
  }, []);

  return readingProgress;
};

export default useProgress;
