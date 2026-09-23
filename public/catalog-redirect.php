<?php
declare(strict_types=1);

// Resuelve categorías, marcas y aliases antiguos antes de cargar React.
// Un componente SPA no puede cambiar un HTTP 200 a 404: por eso esta capa
// devuelve 301 para rutas conocidas y 404 real para las inexistentes.
$mapPath = __DIR__ . '/catalog-map.php';

if (!is_file($mapPath)) {
    http_response_code(503);
    header('Retry-After: 3600');
    header('X-Robots-Tag: noindex, nofollow');
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}

$requestPath = (string) parse_url(
    (string) ($_SERVER['REQUEST_URI'] ?? ''),
    PHP_URL_PATH
);
$requestPath = rawurldecode($requestPath);
$normalizedPath = '/' . trim((string) preg_replace('~/+~', '/', $requestPath), '/');
$lookupPath = strtolower($normalizedPath);
$catalogMap = require $mapPath;

if (is_array($catalogMap) && isset($catalogMap[$lookupPath])) {
    $canonicalPath = (string) $catalogMap[$lookupPath];

    if ($requestPath !== $canonicalPath) {
        header('Cache-Control: public, max-age=86400');
        header('Location: https://disdelsa.com' . $canonicalPath, true, 301);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, max-age=0, must-revalidate');
    header('Link: <https://disdelsa.com' . $canonicalPath . '>; rel="canonical"');
    readfile(__DIR__ . '/index.html');
    exit;
}

http_response_code(404);
header('Cache-Control: public, max-age=3600');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
