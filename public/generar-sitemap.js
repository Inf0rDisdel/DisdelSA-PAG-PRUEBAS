/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN (SIN WWW para consistencia con .htaccess) ---
const BASE_URL = 'https://disdelsa.com'; 
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

const MARCAS_TOP = ['KIMBERLY CLARK', '3M', 'WIESE', 'SILVER', 'LEONCITO'];
const CATEGORIAS_TOP = [
    'BAÑOS E HIGIENE', 'LIMPIEZA', 'HERRAMIENTAS PARA LIMPIEZA', 
    'EPP', 'QUIMICOS PARA LIMPIEZA', 'FERRETERIA', 'BOTIQUIN', 'CAFETERIA','PAPELERIA'
];

const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9 -]/g, '') // Quita símbolos raros
        .replace(/\s+/g, '-') // Espacios por guiones
        .replace(/-+/g, '-'); // Evita guiones dobles
    }   ;

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
        console.log('📂 Categorizando Segmentos...');
        const resMenu = await axios.post(API_MENU, payload, config);

        if (resMenu.data && Array.isArray(resMenu.data)) {
            resMenu.data.forEach(seg => {

                const nombre = seg.NombreSegmento.toUpperCase().trim();
                const esDestacada = CATEGORIAS_TOP.some(top => nombre.includes(top));

                urls.push({
                    loc: `${BASE_URL}/categoria/${createSlug(seg.NombreSegmento)}`,
                    priority: esDestacada ? '0.9' : '0.8',
                    changefreq: 'daily'
                });
            });
        }

        console.log('📦 Indexando Catálogo de Productos...');
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
                    priority: '0.7', // Los productos individuales tienen prioridad base
                    changefreq: 'weekly'
                });

                if (prod.Marca && prod.Marca !== "SIN MARCA") {
                    marcasUnicas.add(prod.Marca.trim());
                }
            });

            console.log(`🏷️  Optimizando ${marcasUnicas.size} Marcas únicas.`);
            marcasUnicas.forEach(marca => {
                const nombreMarca = marca.toUpperCase().trim();
                const esMarcaTop = MARCAS_TOP.some(top => nombreMarca.includes(top));

                urls.push({
                    loc: `${BASE_URL}/marca/${createSlug(marca)}`,
                    // 🔥 Lógica Master: Marcas Top puntúan 0.9 (Igual que categorías principales)
                    priority: esMarcaTop ? '0.9' : '0.8',
                    changefreq: 'daily'
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
        console.log(`\n✅ ¡Sitemap MASTER completado!`);
        console.log(`📊 URLs Totales: ${urls.length}`);
        console.log(`📍 Guardado en: public/sitemap.xml`);

    } catch (error) {
        console.error('❌ Error fatal generando sitemap:', error.message);
    }
}

generateSitemap();