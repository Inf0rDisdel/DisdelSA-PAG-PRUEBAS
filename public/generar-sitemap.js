/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN (SIN WWW para consistencia con .htaccess) ---
const BASE_URL = 'https://disdelsa.com'; 
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml'); 
const IMG_BASE_URL = 'https://disdelsa.com/imagenes/productos/';

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
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
};

const escapeXml = (str) =>
    str.replace(/[<>&'"]/g, c => ({
        '<': '&lt;', 
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;', 
        '"': '&quot;'
    }[c]));

    async function generateSitemap() {
    /*console.log('🚀 Generando Sitemap Nivel GALAXIA...');*/
    const hoy = new Date().toISOString().split('T')[0];
    const payload = { IdCompania: 1007, Division: "1" };
    const config = { headers: { 'Content-Type': 'application/json' }, timeout: 15000 };

    let urls = [
        { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/quienes-somos`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ubicaciones`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ayuda`, priority: '0.7', changefreq: 'monthly' }
    ];

    try {
        // 1. CATEGORÍAS (Nivel 1, 2 y 3)
        const [resMenu, resProd] = await Promise.all([
            axios.post(API_MENU, payload, config),
            axios.post(API_PRODUCTOS, payload, config)
        ]);

        // 2. PROCESAR MENÚ (Categorías Niveles 1, 2, 3 y Marcas)
        if (resMenu.data && Array.isArray(resMenu.data)) {
            resMenu.data.forEach(seg => {
                const segNameUpper = seg.NombreSegmento.toUpperCase();
                const segSlug = createSlug(seg.NombreSegmento);
                const esMarca = MARCAS_TOP.some(m => segNameUpper.includes(m));
                const esDestacada = CATEGORIAS_TOP.some(top => segNameUpper.includes(top));
                
                const folder = esMarca ? 'marca' : 'categoria';

                urls.push({
                    loc: `${BASE_URL}/${folder}/${segSlug}`,
                    priority: (esDestacada || esMarca) ? '0.9' : '0.8',
                    changefreq: 'daily'
                });

                // Nivel 2: /categoria/limpieza/herramientas
                if (seg.Categorias) {
                    seg.Categorias.forEach(cat => {
                        const catSlug = createSlug(cat.NombreCategoria);
                        urls.push({
                            loc: `${BASE_URL}/${folder}/${segSlug}/${catSlug}`,
                            priority: '0.7',
                            changefreq: 'daily'
                        });

                        // Subcategorías (solo si no es marca, para mantener rutas limpias)
                        if (cat.SubCategorias && !esMarca) {
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

        if (resProd.data && Array.isArray(resProd.data)) {
            resProd.data.forEach(prod => {
                const cleanId = String(prod.IdProducto || '').trim().toLowerCase();
                const slugName = createSlug(prod.Descripcion || '');
                if(!cleanId || !slugName) return;

                urls.push({
                    loc: `${BASE_URL}/producto/${cleanId}/${slugName}`,
                    priority: '0.8',
                    changefreq: 'weekly',
                    image: `${IMG_BASE_URL}${prod.Imagen}`, 
                    title: prod.Descripcion
                });
            });
        }

        // 4. CONSTRUIR XML
        const xmlEntries = urls.map(u => `
        <url>
            <loc>${escapeXml(u.loc)}</loc>
            <lastmod>${hoy}</lastmod>
            <changefreq>${u.changefreq || 'daily'}</changefreq>
            <priority>${u.priority}</priority>${u.image ? `
            <image:image>
            <image:loc>${escapeXml(u.image)}</image:loc>
            <image:title>${escapeXml(u.title)}</image:title>
            </image:image>` : ''}
        </url>`).join('');

                const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${xmlEntries}
        </urlset>`;

        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, xml);

        /*console.log(`\n✅ ¡Sitemap NIVEL PRO completado!`);
        console.log(`📊 URLs Totales: ${urls.length} (Google las amará)`);*/
    } catch (error) {
        /*console.error('❌ Error fatal:', error.message);*/
    }
}
generateSitemap();