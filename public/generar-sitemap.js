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
    const config = { headers: { 'Content-Type': 'application/json' }, timeout: 15000};
    const payload = { IdCompania: 1007, Division: "1" };

    let urls = [
        { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/quienes-somos`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ubicaciones`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${BASE_URL}/ayuda`, priority: '0.7', changefreq: 'monthly' }
    ];

    try {
        // 1. CATEGORÍAS (Nivel 1, 2 y 3)
        /*console.log('📂 Categorizando árbol jerárquico...');*/
        const [resMenu, resProd] = await Promise.all([
            axios.post(API_MENU, payload, config),
            axios.post(API_PRODUCTOS, payload, config)
        ]);

        // 2. PROCESAR MENÚ (Categorías Niveles 1, 2, 3 y Marcas)
        if (resMenu.data && Array.isArray(resMenu.data)) {
            resMenu.data.forEach(seg => {
                const segSlug = createSlug(seg.NombreSegmento);
                const esDestacada = CATEGORIAS_TOP.some(top => seg.NombreSegmento.toUpperCase().includes(top));
                const esMarca = MARCAS_TOP.some(m => seg.NombreSegmento.toUpperCase().includes(m));

                // Determinar ruta base (/categoria/ o /marca/)
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

                        if (cat.SubCategorias) {
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

        // 3. PROCESAR PRODUCTOS CON IMÁGENES 📸
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

        // 2. PRODUCTOS (ID + SLUG)
        /*console.log('📦 Indexando Catálogo de Productos...');*/
        const resProd = await axios.post(API_PRODUCTOS, payload, config);
        const productos = resProd.data;

        if (productos && Array.isArray(productos)) {
            productos.forEach(prod => {
                const cleanId = String(prod.IdProducto || '').trim().toLowerCase();
                const slugName = createSlug(prod.Descripcion || '');
                if(!cleanId || !slugName) return;

                urls.push({
                    loc: `${BASE_URL}/producto/${cleanId}/${slugName}`,
                    priority: '0.8',
                    changefreq: 'weekly',
                    image: `${IMG_BASE_URL}${prod.Imagen}`, // 🚀 Vitaminas SEO
                    title: prod.Descripcion
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
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                ${urls.map(u => `  <url>
                <loc>${escapeXml(u.loc)}</loc>
                <lastmod>${hoy}</lastmod>
                <changefreq>${u.changefreq || 'daily'}</changefreq>
                <priority>${u.priority}</priority>${u.image ? `
                <image:image>
                <image:loc>${escapeXml(u.image)}</image:loc>
                <image:title>${escapeXml(u.title)}</image:title>
                </image:image>` : ''}
            </url>`).join('\n')}
        </urlset>`;

        urls.push({
            loc: `${BASE_URL}/producto/${cleanId}/${slugName}`,
            priority: '0.8',
            changefreq: 'weekly',
            image: `https://disdelsa.com/imagenes/productos/${prod.Imagen}`, // 🚀 Crucial
            title: prod.Descripcion
        });

        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, xml);

        /*console.log(`\n✅ ¡Sitemap NIVEL PRO completado!`);
        console.log(`📊 URLs Totales: ${urls.length} (Google las amará)`);*/
    } catch (error) {
        /*console.error('❌ Error fatal:', error.message);*/
    }
}
generateSitemap();