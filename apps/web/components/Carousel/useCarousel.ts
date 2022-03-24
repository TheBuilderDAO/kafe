import { useCallback, useState } from 'react';

const useCarousel = (perPage: number) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      setCurrentIndex(perPage - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, perPage]);

  const handleNext = useCallback(() => {
    if (currentIndex === perPage - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, perPage]);

  return { currentIndex, handlePrev, handleNext };
};

export default useCarousel;
