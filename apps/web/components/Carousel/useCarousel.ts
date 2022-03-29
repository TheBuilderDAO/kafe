import { useCallback, useMemo, useState } from 'react';

const useCarousel = (perPage: number, totalCount: number) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const pageCounter = useMemo(() => {
    if (totalCount < perPage) {
      return totalCount;
    }
    return perPage;
  }, [perPage, totalCount]);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      setCurrentIndex(pageCounter - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, pageCounter]);

  const handleNext = useCallback(() => {
    if (currentIndex === pageCounter - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, pageCounter]);

  return { currentIndex, handlePrev, handleNext };
};

export default useCarousel;
