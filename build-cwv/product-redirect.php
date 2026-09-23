<?php
declare(strict_types=1);

// Resuelve las URLs de producto sin consultar la API durante el rastreo.
// Normaliza /producto/ID, slugs antiguos, mayúsculas y slash final antes de
// entregar React, de modo que sólo exista una URL indexable por producto.
$id = strtolower(trim((string) ($_GET['id'] ?? '')));

if (!preg_match('/^[a-z0-9._-]{1,80}$/', $id)) {
    http_response_code(410);
    header('X-Robots-Tag: noindex, nofollow');
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}

$destinationPath = null;
$productMapPath = __DIR__ . '/product-map.php';

if (is_file($productMapPath)) {
    $productMap = require $productMapPath;

    if (is_array($productMap) && isset($productMap[$id])) {
        $destinationPath = (string) $productMap[$id];
    }
}

// Compatibilidad durante el primer despliegue: si aún no existe el mapa,
// utiliza el sitemap canónico ya publicado como fuente de respaldo.
if ($destinationPath === null) {
    $sitemapPath = __DIR__ . '/sitemap.xml';
    $sitemap = @file_get_contents($sitemapPath);

    if ($sitemap === false) {
        http_response_code(503);
        header('Retry-After: 3600');
        header('X-Robots-Tag: noindex, nofollow');
        header('Content-Type: text/html; charset=utf-8');
        readfile(__DIR__ . '/index.html');
        exit;
    }

    $productPrefix = preg_quote('https://disdelsa.com/producto/' . $id . '/', '~');
    $pattern = '~<loc>\s*' . $productPrefix . '([^<\s]+)\s*</loc>~i';

    if (preg_match($pattern, $sitemap, $match) === 1) {
        $destinationPath = '/producto/' . $id . '/' . html_entity_decode(
            $match[1],
            ENT_QUOTES | ENT_XML1,
            'UTF-8'
        );
    }
}

if ($destinationPath !== null) {
    $destination = 'https://disdelsa.com' . $destinationPath;
    $requestPath = rawurldecode((string) parse_url(
        (string) ($_SERVER['REQUEST_URI'] ?? ''),
        PHP_URL_PATH
    ));

    if ($requestPath !== $destinationPath) {
        header('Cache-Control: public, max-age=86400');
        header('Location: ' . $destination, true, 301);
        exit;
    }

    // La URL ya es canónica: conserva el 200 y entrega la aplicación. El
    // encabezado Link proporciona la misma señal incluso antes de ejecutar JS.
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, max-age=0, must-revalidate');
    header('Link: <' . $destination . '>; rel="canonical"');
    readfile(__DIR__ . '/index.html');
    exit;
}

// El ID ya no forma parte del catálogo/sitemap: se retiró definitivamente.
http_response_code(410);
header('Cache-Control: public, max-age=3600');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
