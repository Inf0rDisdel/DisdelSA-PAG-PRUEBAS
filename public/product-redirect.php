<?php
declare(strict_types=1);

// Resuelve las URLs históricas /producto/ID sin consultar la API durante el
// rastreo. sitemap.xml ya contiene la única URL canónica de cada producto.
$id = strtolower(trim((string) ($_GET['id'] ?? '')));

if (!preg_match('/^[a-z0-9._-]{1,80}$/', $id)) {
    http_response_code(410);
    header('X-Robots-Tag: noindex, nofollow');
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}

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
$pattern = '~<loc>\s*(' . $productPrefix . '[^<\s]+)\s*</loc>~i';

if (preg_match($pattern, $sitemap, $match) === 1) {
    $destination = html_entity_decode($match[1], ENT_QUOTES | ENT_XML1, 'UTF-8');
    header('Cache-Control: public, max-age=86400');
    header('Location: ' . $destination, true, 301);
    exit;
}

// El ID ya no forma parte del catálogo/sitemap: se retiró definitivamente.
http_response_code(410);
header('Cache-Control: public, max-age=3600');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
