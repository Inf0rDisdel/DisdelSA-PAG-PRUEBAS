/* eslint-disable */
const fs = require("fs");
const axios = require("axios");
const path = require("path");

// ---------------- 1. CONFIGURACIÓN DE DOMINIO Y ENDPOINTS ----------------
const BASE_URL = "https://disdelsa.com"; 
const API_PRODUCTOS = "https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos";
const API_MENU = "https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu";
const OUTPUT_FILE = path.join(__dirname, "sitemap.xml");
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

// ---------------- 4. GENERADOR PRINCIPAL ----------------
async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const urls = [];
  const uniqueUrls = new Set();
  const uniqueProducts = new Set();

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
      axios.post(API_MENU, payload, config),
      axios.post(API_PRODUCTOS, payload, config),
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

        addUrl({
          loc: `${BASE_URL}/${folder}/${segmentSlug}`,
          priority: isBrand || isTop ? "0.9" : "0.8",
          changefreq: "daily",
        });

        if (!Array.isArray(segmento.Categorias)) return;

        segmento.Categorias.forEach((categoria) => {
          const categorySlug = createSlug(categoria.NombreCategoria);

          addUrl({
            loc: `${BASE_URL}/${folder}/${segmentSlug}/${categorySlug}`,
            priority: "0.8",
            changefreq: "daily",
          });

          // Subcategorías (Nivel 3)
          if (!isBrand && Array.isArray(categoria.SubCategorias)) {
            categoria.SubCategorias.forEach((sub) => {
              const subSlug = createSlug(sub.NombreSubCategoria);

              addUrl({
                loc: `${BASE_URL}/categoria/${segmentSlug}/${categorySlug}/${subSlug}`,
                priority: "0.7",
                changefreq: "weekly",
              });
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

        addUrl({
          loc: `${BASE_URL}/producto/${id}/${slug}`,
          priority: "0.8",
          changefreq: "weekly",
          image: hasValidImage(product.Imagen)
            ? `${IMG_BASE_URL}${product.Imagen}`
            : null,
          title: product.Descripcion,
        });
      });
    }

    // --- ORDENAMIENTO Y GENERACIÓN XML ---
    urls.sort((a, b) => a.loc.localeCompare(b.loc));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
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

    console.log(`✅ Sitemap generado en: ${OUTPUT_FILE}`);
    console.log(`📄 Total URLs procesadas: ${urls.length}`);
  } catch (err) {
    console.error("❌ Error al generar el sitemap:", err.message);
  }
}

generateSitemap();