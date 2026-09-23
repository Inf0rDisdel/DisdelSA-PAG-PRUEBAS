/* eslint-disable */
const fs = require("fs");
const axios = require("axios");
const path = require("path");

// ---------------- 1. CONFIGURACIÓN DE DOMINIO Y ENDPOINTS ----------------
const BASE_URL = "https://disdelsa.com"; 
const API_PRODUCTOS = "https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos";
const API_MENU = "https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu";
const OUTPUT_FILE = path.join(__dirname, "sitemap.xml");
const PRODUCT_MAP_FILE = path.join(__dirname, "product-map.php");
const CATALOG_MAP_FILE = path.join(__dirname, "catalog-map.php");
const IMG_BASE_URL = `${BASE_URL}/imagenes/productos/`;

const payload = {
  IdCompania: 1007,
  Division: "1",
};

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
};

const MAX_API_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1200;

// ---------------- 2. REGLAS B2B Y SECCIONES DESTACADAS ----------------
const MARCAS_TOP = [
  "KIMBERLY CLARK",
  "3M",
  "WIESE",
  "SILVER",
  "LEONCITO",
];

const CATEGORIAS_TOP = [
  "BAÑOS E HIGIENE",
  "LIMPIEZA",
  "HERRAMIENTAS PARA LIMPIEZA",
  "EPP",
  "QUIMICOS PARA LIMPIEZA",
  "FERRETERIA",
  "BOTIQUIN",
  "CAFETERIA",
  "PAPELERIA",
];

// ---------------- 3. FUNCIONES AUXILIARES Y SANEAMIENTO ----------------
const createSlug = (text) => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Escapado defensivo de caracteres XML
const escapeXml = (str = "") =>
  String(str).replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[c]));

const escapePhpString = (value = "") =>
  String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const escapePhpArray = (map) => `<?php
// Archivo generado automáticamente por generar-sitemap.js. No editar.
return [
${[...map.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(
    ([sourcePath, canonicalPath]) =>
      `  '${escapePhpString(sourcePath)}' => '${escapePhpString(canonicalPath)}',`
  )
  .join("\n")}
];
`;

// Valida que la imagen exista y no sea "0", "undefined" o "n/a"
const hasValidImage = (image) => {
  if (!image) return false;

  const img = String(image).trim().toLowerCase();

  return (
    img !== "" &&
    img !== "0" &&
    img !== "undefined" &&
    img !== "null" &&
    img !== "n/a"
  );
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const shouldRetryRequest = (error) => {
  const status = error.response?.status;
  return !status || status === 429 || status >= 500;
};

const postWithRetry = async (endpoint, label) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt += 1) {
    try {
      return await axios.post(endpoint, payload, config);
    } catch (error) {
      lastError = error;

      if (!shouldRetryRequest(error) || attempt === MAX_API_ATTEMPTS) {
        throw error;
      }

      const delay = RETRY_BASE_DELAY_MS * attempt;
      const status = error.response?.status || "sin respuesta";
      console.warn(
        `⚠️ ${label} respondió ${status}. Reintento ${attempt + 1}/${MAX_API_ATTEMPTS} en ${delay} ms...`
      );
      await wait(delay);
    }
  }

  throw lastError;
};

// ---------------- 4. GENERADOR PRINCIPAL ----------------
async function generateSitemap() {
  const urls = [];
  const uniqueUrls = new Set();
  const uniqueProducts = new Set();
  const productMap = new Map();
  const catalogMap = new Map();

  // La clave siempre es minúscula porque Apache usa este archivo para
  // normalizar mayúsculas, slash final y aliases históricos con un 301 real.
  const addCatalogRoute = (sourcePath, canonicalPath) => {
    const source = String(sourcePath || "").trim().toLowerCase();
    const canonical = String(canonicalPath || "").trim();
    if (!source || !canonical || catalogMap.has(source)) return;
    catalogMap.set(source, canonical);
  };

  const addUrl = (item) => {
    if (!item.loc) return;
    if (uniqueUrls.has(item.loc)) return; // Evita duplicados en el sitemap
    uniqueUrls.add(item.loc);
    urls.push(item);
  };

  // --- PÁGINAS ESTÁTICAS DE LA WEB ---
  addUrl({ loc: `${BASE_URL}/`, priority: "1.0", changefreq: "daily" });
  addUrl({ loc: `${BASE_URL}/quienes-somos`, priority: "0.8", changefreq: "monthly" });
  addUrl({ loc: `${BASE_URL}/ubicaciones`, priority: "0.8", changefreq: "monthly" });
  addUrl({ loc: `${BASE_URL}/ayuda`, priority: "0.7", changefreq: "monthly" });

  try {
    const [menuResponse, productsResponse] = await Promise.all([
      postWithRetry(API_MENU, "API de menú"),
      postWithRetry(API_PRODUCTOS, "API de productos"),
    ]);

    // --- PROCESAMIENTO DE MENÚ (CATEGORÍAS Y MARCAS) ---
    if (Array.isArray(menuResponse.data)) {
      menuResponse.data.forEach((segmento) => {
        const segmentName = segmento.NombreSegmento || "";
        const segmentSlug = createSlug(segmentName);
        const upper = segmentName.toUpperCase();

        const isBrand = MARCAS_TOP.some((m) => upper.includes(m));
        const isTop = CATEGORIAS_TOP.some((c) => upper.includes(c));
        const folder = isBrand ? "marca" : "categoria";
        const segmentPath = `/${folder}/${segmentSlug}`;

        addUrl({
          loc: `${BASE_URL}${segmentPath}`,
          priority: isBrand || isTop ? "0.9" : "0.8",
          changefreq: "daily",
        });
        addCatalogRoute(segmentPath, segmentPath);

        // Los aliases de una sola palabra fueron usados por la web anterior.
        // Sólo se generan cuando apuntan a una URL actual y canónica.
        if (!isBrand) {
          addCatalogRoute(`/category/${segmentSlug}`, segmentPath);
          addCatalogRoute(`/c/${segmentSlug}`, segmentPath);
        } else {
          addCatalogRoute(`/marcas/${segmentSlug}`, segmentPath);
          addCatalogRoute(`/m/${segmentSlug}`, segmentPath);
        }

        if (!Array.isArray(segmento.Categorias)) return;

        segmento.Categorias.forEach((categoria) => {
          const categorySlug = createSlug(categoria.NombreCategoria);
          const categoryPath = `${segmentPath}/${categorySlug}`;

          addUrl({
            loc: `${BASE_URL}${categoryPath}`,
            priority: "0.8",
            changefreq: "daily",
          });
          addCatalogRoute(categoryPath, categoryPath);

          if (!isBrand) {
            addCatalogRoute(`/category/${categorySlug}`, categoryPath);
            addCatalogRoute(`/c/${categorySlug}`, categoryPath);
          }

          // Subcategorías (Nivel 3)
          if (!isBrand && Array.isArray(categoria.SubCategorias)) {
            categoria.SubCategorias.forEach((sub) => {
              const subSlug = createSlug(sub.NombreSubCategoria);
              const subcategoryPath = `${categoryPath}/${subSlug}`;

              addUrl({
                loc: `${BASE_URL}${subcategoryPath}`,
                priority: "0.7",
                changefreq: "weekly",
              });
              addCatalogRoute(subcategoryPath, subcategoryPath);
              addCatalogRoute(`/category/${subSlug}`, subcategoryPath);
              addCatalogRoute(`/c/${subSlug}`, subcategoryPath);
              addCatalogRoute(`/subcategoria/${subSlug}`, subcategoryPath);
              addCatalogRoute(`/lgrepsa.com/subcategoria/${subSlug}`, subcategoryPath);
            });
          }
        });
      });
    }

    // --- PROCESAMIENTO DE PRODUCTOS ---
    if (Array.isArray(productsResponse.data)) {
      productsResponse.data.forEach((product) => {
        const id = String(product.IdProducto || "").trim().toLowerCase();
        if (!id || uniqueProducts.has(id)) return;

        uniqueProducts.add(id);
        const slug = createSlug(product.Descripcion);
        if (!slug) return;

        const canonicalPath = `/producto/${id}/${slug}`;
        productMap.set(id, canonicalPath);

        addUrl({
          loc: `${BASE_URL}${canonicalPath}`,
          priority: "0.8",
          changefreq: "weekly",
          image: hasValidImage(product.Imagen)
            ? `${IMG_BASE_URL}${product.Imagen}`
            : null,
          title: product.Descripcion,
        });
      });

      // "Silver" se construye desde productos, no desde el menú. Mantener
      // sus rutas válidas fuera del 404 evita perder una marca indexable.
      const silverCategories = new Map();
      productsResponse.data.forEach((product) => {
        const brand = String(product.Marca || product.brand || "").toLowerCase();
        const description = String(product.Descripcion || product.name || "").toLowerCase();
        if (!brand.includes("silver") && !description.includes("silver")) return;

        const categorySlug = createSlug(product.Categoria || product.NombreCategoria || "otros");
        const subcategorySlug = createSlug(product.SubCategoria || product.NombreSubCategoria || "");
        if (!silverCategories.has(categorySlug)) silverCategories.set(categorySlug, new Set());
        if (subcategorySlug) silverCategories.get(categorySlug).add(subcategorySlug);
      });

      if (silverCategories.size > 0) {
        addCatalogRoute("/marca/silver", "/marca/silver");
        silverCategories.forEach((subcategories, categorySlug) => {
          const categoryPath = `/marca/silver/${categorySlug}`;
          addCatalogRoute(categoryPath, categoryPath);
          subcategories.forEach((subcategorySlug) => {
            const subcategoryPath = `${categoryPath}/${subcategorySlug}`;
            addCatalogRoute(subcategoryPath, subcategoryPath);
          });
        });
      }
    }

    // --- ORDENAMIENTO Y GENERACIÓN XML ---
    urls.sort((a, b) => a.loc.localeCompare(b.loc));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>${
      u.image
        ? `
    <image:image>
      <image:loc>${escapeXml(u.image)}</image:loc>
      <image:title>${escapeXml(u.title)}</image:title>
    </image:image>`
        : ""
    }
  </url>`
  )
  .join("")}
</urlset>`;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, xml, "utf8");

    // Mapa O(1) utilizado por product-redirect.php. Además de evitar una
    // consulta a la API en cada visita, permite normalizar ID, slug y slash
    // con un 301 real antes de cargar React.
    const phpMap = `<?php
// Archivo generado automáticamente por generar-sitemap.js. No editar.
return [
${[...productMap.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(
    ([id, canonicalPath]) =>
      `  '${escapePhpString(id)}' => '${escapePhpString(canonicalPath)}',`
  )
  .join("\n")}
];
`;

    fs.writeFileSync(PRODUCT_MAP_FILE, phpMap, "utf8");
    fs.writeFileSync(CATALOG_MAP_FILE, escapePhpArray(catalogMap), "utf8");

    console.log(`✅ Sitemap generado en: ${OUTPUT_FILE}`);
    console.log(`🧭 Mapa canónico generado en: ${PRODUCT_MAP_FILE}`);
    console.log(`🧭 Mapa de catálogo generado en: ${CATALOG_MAP_FILE}`);
    console.log(`📄 Total URLs procesadas: ${urls.length}`);
  } catch (err) {
    console.error("❌ Error al generar el sitemap:", err.message);

    const hasExistingSitemap =
      fs.existsSync(OUTPUT_FILE) && fs.statSync(OUTPUT_FILE).size > 0;

    if (hasExistingSitemap) {
      console.warn(
        "⚠️ La API no estuvo disponible. Se conservará el sitemap existente para completar la compilación."
      );
      return;
    }

    console.error(
      "❌ No existe un sitemap válido de respaldo. Se cancela la compilación para evitar una publicación SEO incompleta."
    );
    process.exitCode = 1;
  }
}

generateSitemap();
