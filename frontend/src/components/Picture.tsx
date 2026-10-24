import React from 'react';

interface PictureProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'sizes'> {
  picture: ImagetoolsPicture;
  sizes: string;
  alt: string;
}

export const Picture: React.FC<PictureProps> = ({ picture, sizes, alt, loading = 'lazy', decoding = 'async', ...rest }) => (
  <picture className="contents">
    {Object.entries(picture.sources).map(([format, srcSet]) => (
      <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
    ))}
    <img
      src={picture.img.src}
      width={picture.img.w}
      height={picture.img.h}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  </picture>
);
