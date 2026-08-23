import React from 'react';
import { getResponsiveImageSources } from 'utils/imageUrl';

const OptimizedImage = ({
  src,
  directory = '',
  widths,
  targetWidth,
  quality = 78,
  sizes,
  alt = '',
  onError,
  fetchPriority,
  ...imageProps
}) => {
  const sources = getResponsiveImageSources(src, {
    directory,
    widths,
    targetWidth,
    quality,
    sizes
  });

  const handleError = (event) => {
    const image = event.currentTarget;

    if (
      sources.original &&
      image.dataset.originalFallbackApplied !== 'true' &&
      image.currentSrc !== sources.original
    ) {
      image.dataset.originalFallbackApplied = 'true';
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.src = sources.original;
    }

    onError?.(event);
  };

  return (
    <img
      {...imageProps}
      src={sources.src}
      srcSet={sources.srcSet}
      sizes={sources.sizes}
      alt={alt}
      onError={handleError}
      fetchpriority={fetchPriority}
    />
  );
};

export default React.memo(OptimizedImage);
