/* eslint-disable */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- CONFIGURACIÓN ---
const BASE_URL = 'https://www.disdelsa.com';
const API_PRODUCTOS = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetProductos'; 
const API_MENU = 'https://www.disdelsagt.com/MyWsMobil/api/PaginaWeb/GetMenu';

const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

// Función para limpiar texto (SEO amigable)
const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-');
};

async function generateSitemap() {
    console.log('🚀 Iniciando Generador de Sitemap Final...');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 1. PÁGINAS ESTÁTICAS -->
  <url><loc>${BASE_URL}/</loc><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/quienes-somos</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/ubicaciones</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/ayuda</loc><priority>0.7</priority></url>
  
  <!-- 2. MARCAS PRINCIPALES -->
  <url><loc>${BASE_URL}/marca/kimberly-clark-professional</loc><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/marca/tork</loc><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/marca/3m</loc><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/marca/wiese</loc><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/marca/silver</loc><priority>0.9</priority></url>
`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
        // --- 3. CATEGORÍAS (MENÚ) ---
        console.log('📂 Descargando Categorías...');
        try {
            // El menú suele no pedir parámetros o pedir los mismos
            const payloadMenu = { IdCompania: 1007, Division: "1" };
            const resMenu = await axios.post(API_MENU, payloadMenu, config);
            const menu = resMenu.data;
            
            if (menu && menu.length > 0) {
                menu.forEach(segmento => {
                    const slug = createSlug(segmento.NombreSegmento);
                    xml += `  <url><loc>${BASE_URL}/categoria/${slug}</loc><priority>0.9</priority></url>\n`;
                });
                console.log(`✅ ${menu.length} Categorías agregadas.`);
            }
        } catch (errMenu) {
            console.warn('⚠️ No se pudo descargar el menú (se omiten):', errMenu.message);
        }

        // --- 4. PRODUCTOS (LA MAGIA) ---
        console.log('📦 Descargando 4000+ Productos...');
        
        // 🔥 AQUÍ ESTÁ EL SECRETO QUE FALTABA 🔥
        const payloadProductos = {
            IdCompania: 1007,
            Division: "1"
        }; 

        const resProd = await axios.post(API_PRODUCTOS, payloadProductos, config);
        const productos = resProd.data;

        if (productos && productos.length > 0) {
            productos.forEach(prod => {
                // Minúsculas estrictas para Google
                const cleanId = prod.IdProducto.trim().toLowerCase();
                xml += `  <url><loc>${BASE_URL}/producto/${cleanId}</loc><priority>0.8</priority></url>\n`;
            });
            console.log(`✅ ${productos.length} Productos agregados al sitemap.`);
        } else {
            console.error('❌ La API devolvió 0 productos a pesar de enviar la compañía.');
        }

        xml += `</urlset>`;
        
        // Guardar el archivo en la carpeta public
        fs.writeFileSync(OUTPUT_FILE, xml);
        console.log(`🎉 ¡ÉXITO TOTAL! Sitemap creado correctamente.`);
        console.log(`📍 Revisa tu archivo en: public/sitemap.xml`);

    } catch (error) {
        console.error('❌ Error fatal en la petición:');
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

generateSitemap();