const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const IMAGE_ORIGIN = 'https://disdelsa.com/imagenes/';
const CACHE_DIRECTORY = path.join(os.tmpdir(), 'disdel-dev-image-cache');
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const clampInteger = (value, fallback, minimum, maximum) => {
  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isFinite(parsedValue)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsedValue));
};

const getOriginalImageUrl = (sourcePath) => {
  const encodedPath = sourcePath
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');

  return `${IMAGE_ORIGIN}${encodedPath}`;
};

module.exports = (app) => {
  app.get('/image-optimizer.php', async (request, response) => {
    const sourcePath = String(request.query.src || '')
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');
    const width = clampInteger(request.query.w, 800, 32, 1600);
    const quality = clampInteger(request.query.q, 78, 45, 90);

    if (
      !sourcePath ||
      sourcePath.includes('\0') ||
      sourcePath.split('/').includes('..') ||
      !ALLOWED_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())
    ) {
      response.status(400).type('text/plain').send('Ruta de imagen no válida.');
      return;
    }

    const originalUrl = getOriginalImageUrl(sourcePath);
    const cacheKey = crypto
      .createHash('sha256')
      .update(`${sourcePath}|${width}|${quality}`)
      .digest('hex');
    const cachePath = path.join(CACHE_DIRECTORY, `${cacheKey}.webp`);

    try {
      await fs.promises.mkdir(CACHE_DIRECTORY, { recursive: true });

      let optimizedImage;
      try {
        optimizedImage = await fs.promises.readFile(cachePath);
      } catch {
        const sourceResponse = await fetch(originalUrl, {
          signal: AbortSignal.timeout(15000),
          headers: { Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' }
        });

        if (!sourceResponse.ok) {
          response.redirect(302, originalUrl);
          return;
        }

        const sourceImage = Buffer.from(await sourceResponse.arrayBuffer());
        optimizedImage = await sharp(sourceImage, { limitInputPixels: 50000000 })
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality, effort: 4 })
          .toBuffer();

        await fs.promises.writeFile(cachePath, optimizedImage);
      }

      response.set({
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'image/webp',
        'Content-Length': String(optimizedImage.length),
        ETag: `"${cacheKey}"`,
        'X-Content-Type-Options': 'nosniff'
      });
      response.send(optimizedImage);
    } catch (error) {
      console.warn(`[image-optimizer] ${error.message}`);
      response.redirect(302, originalUrl);
    }
  });
};
