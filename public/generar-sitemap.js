/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN (SIN WWW para consistencia con .htaccess) ---
const BASE_URL = 'https://disdelsa.com'; 
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';
// Forzamos que se guarde en la raíz de public
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9 -]/g, '') // Quita caracteres especiales
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    async function generateSitemap() {
    console.log('🚀 Generando Sitemap Nivel Master...');
    const hoy = new Date().toISOString().split('T')[0];

    let urls = [
        { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/quienes-somos`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ubicaciones`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ayuda`, priority: '0.7', changefreq: 'monthly' }
    ];

    const config = { headers: { 'Content-Type': 'application/json' } };
    const payload = { IdCompania: 1007, Division: "1" };

    try {
        // 1. CATEGORÍAS
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

        const resProd = await axios.post(API_PRODUCTOS, payload, config);
        const productos = resProd.data;

        if (productos && Array.isArray(productos)) {
            const marcasUnicas = new Set();

            productos.forEach(prod => {
                const cleanId = prod.IdProducto.trim().toLowerCase();
                const slugName = createSlug(prod.Descripcion);
                
                // URL AMIGABLE: ID + NOMBRE (Oro puro para Google)
                urls.push({
                    loc: `${BASE_URL}/producto/${cleanId}/${slugName}`,
                    priority: '0.8',
                    changefreq: 'weekly'
                });

                if (prod.Marca && prod.Marca !== "SIN MARCA") {
                    marcasUnicas.add(prod.Marca.trim());
                }
            });

            marcasUnicas.forEach(marca => {
                urls.push({
                    loc: `${BASE_URL}/marca/${createSlug(marca)}`,
                    priority: '0.9',
                    changefreq: 'weekly'
                });
            });
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
        console.log(`🎉 Sitemap creado con ${urls.length} URLs en /public/sitemap.xml`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}
generateSitemap();