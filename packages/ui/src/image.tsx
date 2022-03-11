import NextImage, { ImageProps } from 'next/image';

export const Image = ({ ...rest }: ImageProps) => {
  return <NextImage {...rest} />;
};
