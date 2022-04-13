import useProgress from '@app/lib/hooks/useProgress';
import useScrollSpy from '@app/lib/hooks/useScrollSpy';
import { motion } from 'framer-motion';
import React from 'react';
import ProgressBar from './ProgressBar';

interface TableOfContentProps {
  toc: Array<{ id: string; title: string; href: string; depth: number }>;
}

/**
 * This offset is meant for the smooth scrolling and
 * Scrollspy to take into account the header height
 */
const OFFSET = 150;

const TableOfContent = ({ toc }: TableOfContentProps) => {
  const readingProgress = useProgress();
  /**
   * Handles clicks on links of the table of content and smooth
   * scrolls to the corresponding section.
   * @param {React.MouseEvent} event the click event
   * @param {string} id the id of the section to scroll to
   */
  const handleLinkClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id)!;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - 50;

    /**
     * TODO: find an alternative for Safari
     */
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  /**
   * Get the index of the current active section that needs
   * to have its corresponding title highlighted in the
   * table of content
   */
  const [currentActiveIndex, scrolledSections] = useScrollSpy(
    typeof document !== 'undefined'
      ? toc.map(item => document.querySelector(`section[id="${item.id}"]`))
      : [],
    { offset: OFFSET },
  );
  const shouldShowInList = (index: number, depth: number) => {
    switch (true) {
      case depth === 2:
        return true;
      case scrolledSections.length - 1 <= currentActiveIndex &&
        currentActiveIndex < index + 2:
        return true;
    }
  };
  return (
    <div className={`flex flex-row py-4`}>
      <ProgressBar progress={readingProgress} />
      {toc.length > 0 ? (
        <ul className="ml-2">
          <motion.p className="p-2 pb-6 text-xl font-larken">
            Contents {currentActiveIndex}{' '}
          </motion.p>
          {toc.map((item, index) => {
            return (
              <motion.li
                className={`
                  ${shouldShowInList(index, item.depth) ? 'block' : 'hidden'}
                  px-4
                  py-1
                  ${
                    currentActiveIndex === index
                      ? 'text-kafered dark:text-kafegold font-bold'
                      : 'text-kafeblack dark:text-kafewhite'
                  }`}
                key={item.id}
              >
                <a
                  href={`${item.href}`}
                  className="font-mono break-words text-md"
                  onClick={event => handleLinkClick(event, `${item.id}`)}
                >
                  {'∘'.repeat(item.depth - 1)} {item.title}
                </a>
              </motion.li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default TableOfContent;
