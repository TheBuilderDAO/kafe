/* eslint-disable jsx-a11y/anchor-has-content */
import { default as NextLink } from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

/**
 * Custom Link component that supports relative links.
 */
export const Link = ({
  href,
  ...rest
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return (
      <NextLink href={href}>
        <a {...rest} />
      </NextLink>
    );
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />;
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />;
};
