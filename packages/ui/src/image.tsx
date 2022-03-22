import NextImage, { ImageProps } from 'next/image';
import path from 'path';

export const Image = ({ ...rest }: ImageProps & { lock: any }) => {
  if ((rest.src as string).startsWith('./assets')) {
    const contentData =
      rest?.lock.content[`${(rest.src as string).replace('./', 'content/')}`];
    const imageRelativePath = path.join(
      '/tutorials/',
      rest.lock.slug,
      contentData.path.replace('./', ''),
    );
    return (
      <NextImage
        {...rest}
        src={imageRelativePath}
        width="100%"
        height="100%"
        layout="responsive"
        objectFit="contain"
      />
    );
  }

  return <NextImage {...rest} />;
};
