<?php
declare(strict_types=1);

// Optimizador de imágenes del catálogo Disdel.
// Sólo permite archivos dentro de /imagenes y nunca acepta URLs externas.

function fail_request($status, $message)
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo $message;
    exit;
}

function original_image_url($relativePath)
{
    $segments = array_filter(explode('/', str_replace('\\', '/', $relativePath)), 'strlen');
    return '/imagenes/' . implode('/', array_map('rawurlencode', $segments));
}

function redirect_to_original($relativePath)
{
    header('Location: ' . original_image_url($relativePath), true, 302);
    header('Cache-Control: public, max-age=300');
    exit;
}

$relativePath = trim((string) ($_GET['src'] ?? ''));
$requestedWidth = filter_input(INPUT_GET, 'w', FILTER_VALIDATE_INT);
$requestedQuality = filter_input(INPUT_GET, 'q', FILTER_VALIDATE_INT);

if (
    $relativePath === '' ||
    strpos($relativePath, "\0") !== false ||
    preg_match('~(^|[\\/])\.\.([\\/]|$)~', $relativePath)
) {
    fail_request(400, 'Ruta de imagen no válida.');
}

$requestedWidth = max(32, min(1600, $requestedWidth ?: 800));
$requestedQuality = max(45, min(90, $requestedQuality ?: 78));
$relativePath = ltrim(str_replace('\\', '/', $relativePath), '/');

$imageRoot = realpath(__DIR__ . DIRECTORY_SEPARATOR . 'imagenes');
$sourcePath = $imageRoot
    ? realpath($imageRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath))
    : false;

if (
    !$imageRoot ||
    !$sourcePath ||
    !is_file($sourcePath) ||
    strpos($sourcePath, $imageRoot . DIRECTORY_SEPARATOR) !== 0
) {
    fail_request(404, 'Imagen no encontrada.');
}

$extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
    redirect_to_original($relativePath);
}

if (!extension_loaded('gd') || !function_exists('imagewebp')) {
    redirect_to_original($relativePath);
}

$imageInfo = @getimagesize($sourcePath);
if (!$imageInfo || empty($imageInfo[0]) || empty($imageInfo[1])) {
    redirect_to_original($relativePath);
}

[$sourceWidth, $sourceHeight] = $imageInfo;
if (($sourceWidth * $sourceHeight) > 50000000) {
    redirect_to_original($relativePath);
}

$targetWidth = min($requestedWidth, $sourceWidth);
$targetHeight = max(1, (int) round($sourceHeight * ($targetWidth / $sourceWidth)));
$modifiedAt = (int) filemtime($sourcePath);
$cacheKey = hash('sha256', implode('|', [
    $sourcePath,
    (string) $modifiedAt,
    (string) $targetWidth,
    (string) $targetHeight,
    (string) $requestedQuality
]));
$cacheDirectory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'disdel-image-cache';
$cachePath = $cacheDirectory . DIRECTORY_SEPARATOR . $cacheKey . '.webp';

if (!is_dir($cacheDirectory)) {
    @mkdir($cacheDirectory, 0755, true);
}

if (!is_file($cachePath)) {
    $sourceData = @file_get_contents($sourcePath);
    $sourceImage = $sourceData !== false ? @imagecreatefromstring($sourceData) : false;

    if (!$sourceImage) {
        redirect_to_original($relativePath);
    }

    $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);
    if (!$targetImage) {
        imagedestroy($sourceImage);
        redirect_to_original($relativePath);
    }

    imagealphablending($targetImage, false);
    imagesavealpha($targetImage, true);
    $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
    imagefilledrectangle($targetImage, 0, 0, $targetWidth, $targetHeight, $transparent);

    imagecopyresampled(
        $targetImage,
        $sourceImage,
        0,
        0,
        0,
        0,
        $targetWidth,
        $targetHeight,
        $sourceWidth,
        $sourceHeight
    );

    $temporaryPath = $cachePath . '.' . getmypid() . '.tmp';
    $written = @imagewebp($targetImage, $temporaryPath, $requestedQuality);
    imagedestroy($targetImage);
    imagedestroy($sourceImage);

    if (!$written || !is_file($temporaryPath)) {
        @unlink($temporaryPath);
        redirect_to_original($relativePath);
    }

    if (!@rename($temporaryPath, $cachePath)) {
        @unlink($temporaryPath);
    }
}

if (!is_file($cachePath)) {
    redirect_to_original($relativePath);
}

$etag = '"' . $cacheKey . '"';
if (trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $etag) {
    http_response_code(304);
    header('ETag: ' . $etag);
    header('Cache-Control: public, max-age=31536000, immutable');
    exit;
}

header('Content-Type: image/webp');
header('Content-Length: ' . (string) filesize($cachePath));
header('Cache-Control: public, max-age=31536000, immutable');
header('ETag: ' . $etag);
header('X-Content-Type-Options: nosniff');
readfile($cachePath);
