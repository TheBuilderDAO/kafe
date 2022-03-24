import NextImage, { ImageProps } from 'next/image';

// TODO: clean up this file.
export const Image = ({ getFile, ...rest }: any) => {
  if ((rest.src as string).startsWith('./assets')) {
    const contentData =
      rest?.lock.content[`${(rest.src as string).replace('./', 'content/')}`];
    const src = getFile(rest.lock.slug, contentData.path.replace('./', ''));
    return (
      <NextImage
        {...rest}
        src={src}
        width="100%"
        height="100%"
        layout="responsive"
        objectFit="contain"
      />
    );
  }

  return <NextImage {...rest} />;
};
