/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN (SIN WWW para consistencia con .htaccess) ---
const BASE_URL = 'https://disdelsa.com'; 
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';
const OUTPUT_FILE = path.join(__dirname, 'sitemap.xml');

const MARCAS_TOP = ['KIMBERLY CLARK', '3M', 'WIESE', 'SILVER', 'LEONCITO'];
const CATEGORIAS_TOP = [
    'BAÑOS E HIGIENE', 'LIMPIEZA', 'HERRAMIENTAS PARA LIMPIEZA', 
    'EPP', 'QUIMICOS PARA LIMPIEZA', 'FERRETERIA', 'BOTIQUIN', 'CAFETERIA','PAPELERIA'
];

const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
};

const escapeXml = (str) =>
    str.replace(/[<>&'"]/g, c => ({
        '<': '&lt;', 'ReferenceError': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
    }[c]));

    async function generateSitemap() {
    console.log('🚀 Generando Sitemap Nivel GALAXIA...');
    const hoy = new Date().toISOString().split('T')[0];

    let urls = [
        { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/quienes-somos`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ubicaciones`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ayuda`, priority: '0.7', changefreq: 'monthly' }
    ];

    const config = { headers: { 'Content-Type': 'application/json' }, timeout: 15000};
    const payload = { IdCompania: 1007, Division: "1" };

    try {
        // 1. CATEGORÍAS (Nivel 1, 2 y 3)
        console.log('📂 Categorizando árbol jerárquico...');
        const resMenu = await axios.post(API_MENU, payload, config);

        if (resMenu.data && Array.isArray(resMenu.data)) {
            resMenu.data.forEach(seg => {
                const segSlug = createSlug(seg.NombreSegmento);
                const esDestacada = CATEGORIAS_TOP.some(top => seg.NombreSegmento.toUpperCase().includes(top));

                // Nivel 1: /categoria/limpieza
                urls.push({
                    loc: `${BASE_URL}/categoria/${segSlug}`,
                    priority: esDestacada ? '0.9' : '0.8',
                    changefreq: 'daily'
                });

                // Nivel 2: /categoria/limpieza/herramientas
                if (seg.Categorias && Array.isArray(seg.Categorias)) {
                    seg.Categorias.forEach(cat => {
                        const catSlug = createSlug(cat.NombreCategoria);
                        urls.push({
                            loc: `${BASE_URL}/categoria/${segSlug}/${catSlug}`,
                            priority: '0.7',
                            changefreq: 'daily'
                        });

                        // Nivel 3: /categoria/limpieza/herramientas/escobas
                        if (cat.SubCategorias && Array.isArray(cat.SubCategorias)) {
                            cat.SubCategorias.forEach(sub => {
                                urls.push({
                                    loc: `${BASE_URL}/categoria/${segSlug}/${catSlug}/${createSlug(sub.NombreSubCategoria)}`,
                                    priority: '0.6',
                                    changefreq: 'weekly'
                                });
                            });
                        }
                    });
                }
            });
        }

        // 2. PRODUCTOS (ID + SLUG)
        console.log('📦 Indexando Catálogo de Productos...');
        const resProd = await axios.post(API_PRODUCTOS, payload, config);
        const productos = resProd.data;

        if (productos && Array.isArray(productos)) {
            productos.forEach(prod => {
                const cleanId = (prod.IdProducto || '').trim().toLowerCase();
                const slugName = createSlug(prod.Descripcion || '');
                if(!cleanId || !slugName) return;

                urls.push({
                    loc: `${BASE_URL}/producto/${cleanId}/${slugName}`,
                    priority: '0.8', // Subimos prioridad porque es donde se vende
                    changefreq: 'weekly'
                });
            });
        }

        // 3. MARCAS CON FILTROS
        // Usamos el menú para encontrar los segmentos que son marcas
        const marcasMenu = resMenu.data.filter(seg => 
            MARCAS_TOP.some(m => seg.NombreSegmento.toUpperCase().includes(m))
        );

        marcasMenu.forEach(marca => {
            const marcaSlug = createSlug(marca.NombreSegmento);
            urls.push({
                loc: `${BASE_URL}/marca/${marcaSlug}`,
                priority: '0.9',
                changefreq: 'daily'
            });

            // Filtros de marca: /marca/3m/discos-de-piso
            if (marca.Categorias) {
                marca.Categorias.forEach(c => {
                    urls.push({
                        loc: `${BASE_URL}/marca/${marcaSlug}/${createSlug(c.NombreCategoria)}`,
                        priority: '0.8',
                        changefreq: 'daily'
                    });
                });
            }
        });

        // 4. CONSTRUIR XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, xml);

        console.log(`\n✅ ¡Sitemap NIVEL PRO completado!`);
        console.log(`📊 URLs Totales: ${urls.length} (Google las amará)`);
    } catch (error) {
        console.error('❌ Error fatal:', error.message);
    }
}
generateSitemap();