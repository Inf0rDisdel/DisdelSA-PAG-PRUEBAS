import { AppConfig } from 'config/AppConfig';

const INVALID_IMAGE_VALUES = new Set([
  '',
  '0',
  'undefined',
  'null',
  'n/a',
  'nan'
]);

export const isValidImagePath = (value) => {
  if (value === null || value === undefined) return false;

  const normalizedValue = String(value).trim().toLowerCase();
  return !INVALID_IMAGE_VALUES.has(normalizedValue);
};

export const getDisdelImageUrl = (value, directory = '') => {
  if (!isValidImagePath(value)) return undefined;

  const imagePath = String(value).trim();
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const baseUrl = AppConfig.baseImageUrl.endsWith('/')
    ? AppConfig.baseImageUrl
    : `${AppConfig.baseImageUrl}/`;
  const cleanDirectory = directory
    ? `${String(directory).replace(/^\/+|\/+$/g, '')}/`
    : '';
  const cleanImagePath = imagePath.replace(/^\/+/, '');

  return `${baseUrl}${cleanDirectory}${cleanImagePath}`;
};

const OPTIMIZER_PATH = '/image-optimizer.php';
const DISDEL_IMAGE_PATH = '/imagenes/';

const isOptimizerAvailableOnCurrentHost = () => {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname.toLowerCase();
  return hostname === 'disdelsa.com' ||
    hostname === 'www.disdelsa.com' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1';
};

const normalizeWidth = (value) => {
  const width = Number.parseInt(value, 10);
  if (!Number.isFinite(width)) return undefined;
  return Math.min(1600, Math.max(32, width));
};

const normalizeQuality = (value) => {
  const quality = Number.parseInt(value, 10);
  if (!Number.isFinite(quality)) return 78;
  return Math.min(90, Math.max(45, quality));
};

const getOptimizerSourcePath = (imageUrl) => {
  try {
    const parsedUrl = new URL(imageUrl, window.location.origin);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isDisdelHost = hostname === 'disdelsa.com' || hostname === 'www.disdelsa.com';

    if (!isDisdelHost || !parsedUrl.pathname.startsWith(DISDEL_IMAGE_PATH)) {
      return undefined;
    }

    return decodeURIComponent(parsedUrl.pathname.slice(DISDEL_IMAGE_PATH.length));
  } catch {
    return undefined;
  }
};

export const getOptimizedImageUrl = (imageUrl, width, quality = 78) => {
  if (!imageUrl || !isOptimizerAvailableOnCurrentHost()) return imageUrl;

  const sourcePath = getOptimizerSourcePath(imageUrl);
  const normalizedWidth = normalizeWidth(width);
  if (!sourcePath || !normalizedWidth) return imageUrl;

  const params = new URLSearchParams({
    src: sourcePath,
    w: String(normalizedWidth),
    q: String(normalizeQuality(quality))
  });

  return `${OPTIMIZER_PATH}?${params.toString()}`;
};

/**
 * Genera variantes WebP desde el mismo servidor sin cambiar el origen de los
 * datos. En localhost conserva el archivo original para que React Dev Server
 * no intente interpretar PHP.
 */
export const getResponsiveImageSources = (
  value,
  {
    directory = '',
    widths = [],
    targetWidth,
    quality = 78,
    sizes
  } = {}
) => {
  const original = getDisdelImageUrl(value, directory);
  if (!original) return { original: undefined, src: undefined };

  const normalizedWidths = [...new Set(widths.map(normalizeWidth).filter(Boolean))]
    .sort((first, second) => first - second);
  const fallbackWidth = normalizeWidth(targetWidth) || normalizedWidths.at(-1);
  const src = fallbackWidth
    ? getOptimizedImageUrl(original, fallbackWidth, quality)
    : original;
  const srcSet = normalizedWidths.length > 1 && src !== original
    ? normalizedWidths
      .map((width) => `${getOptimizedImageUrl(original, width, quality)} ${width}w`)
      .join(', ')
    : undefined;

  return {
    original,
    src,
    srcSet,
    sizes: srcSet ? sizes : undefined
  };
};
