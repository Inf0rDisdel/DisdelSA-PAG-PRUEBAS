/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN ---
const BASE_URL = 'https://www.disdelsa.com';
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-');
};

async function generateSitemap() {
    console.log('🚀 Iniciando Generador de Sitemap Inteligente...');
    const hoy = new Date().toISOString().split('T')[0];

    let urls = [
        { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/quienes-somos`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ubicaciones`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ayuda`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${BASE_URL}/opiniones`, priority: '0.7', changefreq: 'weekly' }
    ];

    const config = { headers: { 'Content-Type': 'application/json' } };
    const payload = { IdCompania: 1007, Division: "1" };

    try {
        // 1. DESCARGAR CATEGORÍAS (SEGMENTOS)
        console.log('📂 Procesando Categorías...');
        const resMenu = await axios.post(API_MENU, payload, config);
        if (resMenu.data && Array.isArray(resMenu.data)) {
            resMenu.data.forEach(seg => {
                urls.push({
                    loc: `${BASE_URL}/categoria/${createSlug(seg.NombreSegmento)}`,
                    priority: '0.9',
                    changefreq: 'weekly'
                });
            });
        }

        // 2. DESCARGAR PRODUCTOS Y EXTRAER MARCAS DINÁMICAMENTE
        console.log('📦 Procesando Productos y Marcas...');
        const resProd = await axios.post(API_PRODUCTOS, payload, config);
        const productos = resProd.data;

        if (productos && Array.isArray(productos)) {
            const marcasUnicas = new Set();

            productos.forEach(prod => {
                // Agregar Producto
                const cleanId = prod.IdProducto.trim().toLowerCase();
                urls.push({
                    loc: `${BASE_URL}/producto/${cleanId}`,
                    priority: '0.8',
                    changefreq: 'weekly'
                });

                // Guardar Marca para procesar después (evita duplicados)
                if (prod.Marca && prod.Marca !== "SIN MARCA") {
                    marcasUnicas.add(prod.Marca.trim());
                }
            });

            // Agregar Marcas dinámicas al Sitemap
            console.log(`🏷️  Detectadas ${marcasUnicas.size} marcas únicas.`);
            marcasUnicas.forEach(marca => {
                urls.push({
                    loc: `${BASE_URL}/marca/${createSlug(marca)}`,
                    priority: '0.9',
                    changefreq: 'weekly'
                });
            });

            console.log(`✅ ${productos.length} Productos agregados.`);
        }

        // 3. CONSTRUIR EL XML FINAL
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(OUTPUT_FILE, xml);
        console.log(`🎉 ¡ÉXITO! Sitemap creado con ${urls.length} URLs totales.`);
        console.log(`📍 Ubicación: public/sitemap.xml`);

    } catch (error) {
        console.error('❌ Error fatal:', error.message);
    }
}

generateSitemap();