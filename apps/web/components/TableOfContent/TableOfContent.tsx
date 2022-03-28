import useProgress from '@app/lib/hooks/useProgress';
import useScrollSpy from '@app/lib/hooks/useScrollSpy';
import { useReducedMotion, motion, useViewportScroll } from 'framer-motion';
import { type } from 'os';
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
  const shouldReduceMotion = useReducedMotion();
  const readingProgress = useProgress();

  /**
   * Only show the table of content between 7% and 95%
   * of the page scrolled.
   */
  const shouldShowTableOfContent =
    readingProgress > 0.07 && readingProgress < 0.95;

  /**
   * Variants handling hidding/showing the table of content
   * based on the amount scrolled by the reader
   */
  const variants = {
    hide: {
      opacity: shouldReduceMotion ? 1 : 0,
    },
    show: (shouldShowTableOfContent: boolean) => ({
      opacity: shouldReduceMotion || shouldShowTableOfContent ? 1 : 0,
    }),
  };

  /**
   * Handles clicks on links of the table of content and smooth
   * scrolls to the corresponding section.
   * @param {React.MouseEvent} event the click event
   * @param {string} id the id of the section to scroll to
   */
  const handleLinkClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    console.log(toc);
    console.log(id);
    const element = document.getElementById(id)!;
    console.log(element);
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

  console.log(toc);
  const [currentActiveIndex] = useScrollSpy(
    typeof document !== 'undefined'
      ? toc.map(item => document.querySelector(`section[id="${item.id}"]`))
      : [],
    { offset: OFFSET },
  );
  const { scrollYProgress } = useViewportScroll();

  return (
    <div className="flex flex-row">
      <ProgressBar progress={readingProgress} />
      {toc.length > 0 ? (
        <ul className="ml-2">
          <motion.p className="p-2 pb-6 text-xl font-larken">Contents</motion.p>
          {toc.map((item, index) => {
            return (
              <motion.li
                className={`
                  px-4
                  py-1
                  ${
                    currentActiveIndex === index
                      ? 'text-kafered dark:text-kafegold font-bold'
                      : 'text-kafeblack dark:text-kafewhite text-xs font-extralight'
                  }`}
                key={item.id}
              >
                <a
                  href={`${item.href}`}
                  className="break-all"
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
