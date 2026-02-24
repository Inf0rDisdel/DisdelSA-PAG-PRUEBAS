const fs = require('fs');
const axios = require('axios');

const BASE_URL = 'https://www.disdelsa.com';
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos';

async function generateSitemap() {
    try {
        console.log('🚀 Generando Sitemap con Categorías Manuales...');

        // 1. Lista Manual de Categorías (Las que me pasaste)
        const categoriasManuales = [
            '/categoria/banos-e-higiene',
            '/categoria/botiquin',
            '/categoria/cafeteria',
            '/categoria/epp',
            '/categoria/herramientas-para-limpieza',
            '/categoria/ferreteria',
            '/categoria/papeleria',
            '/categoria/quimicos-para-limpieza'
        ];

        // 2. Lista Manual de Marcas
        const marcasManuales = [
            '/marca/kimberly-clark-professional',
            '/marca/3m',
            '/marca/wiese',
            '/marca/silver'
        ];

        // 3. Rutas Estáticas básicas
        const rutasEstaticas = ['', '/carrito', '/quienes-somos', '/ayuda', '/ubicaciones'];

        // 4. Obtener todos los productos de la API
        const res = await axios.post(API_PRODUCTOS, { IdCompania: 1007, Division: "1" });
        const productos = res.data;

        // --- CONSTRUCCIÓN DEL XML ---
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Añadir Estáticas (Prioridad 1.0)
        rutasEstaticas.forEach(path => {
            xml += `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <priority>1.0</priority>\n  </url>\n`;
        });

        // Añadir Categorías (Prioridad 0.9)
        categoriasManuales.forEach(path => {
            xml += `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <priority>0.9</priority>\n  </url>\n`;
        });

        // Añadir Marcas (Prioridad 0.9)
        marcasManuales.forEach(path => {
            xml += `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <priority>0.9</priority>\n  </url>\n`;
        });

        // Añadir Productos (Prioridad 0.7)
        productos.forEach(prod => {
            xml += `  <url>\n    <loc>${BASE_URL}/producto/${prod.IdProducto}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        xml += `</urlset>`;

        // Guardar en la carpeta public
        fs.writeFileSync('./public/sitemap.xml', xml);
        console.log(`✅ ¡Sitemap creado! Se incluyeron ${productos.length} productos, ${categoriasManuales.length} categorías y ${marcasManuales.length} marcas.`);

    } catch (error) {
        console.error('❌ Error generando el sitemap:', error.message);
    }
}

generateSitemap();