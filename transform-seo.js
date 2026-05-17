const fs = require('fs');
const path = require('path');

// RUTAS (Asegúrate de que coincidan con tu estructura)
const INPUT_FILE = path.join(__dirname, 'data-raw/legacySeoData.json'); 
const OUTPUT_FILE = path.join(__dirname, 'src/utils/SEO/optimizedSeo.js');

try {
    console.log('--- 🚀 Iniciando Transformación Senior de SEO Data ---');

    const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    const optimized = {};

    rawData.forEach(item => {
        if (!item.IdProducto) return;

        const id = String(item.IdProducto).toLowerCase();
        const seo = item.Seo || {};

        // Solo guardamos lo que impacta en el ranking y velocidad
        optimized[id] = {
            // t: Title Page (Crucial para el click en Google)
            t: seo.titlePage || `${item.Descripcion} | Disdel Guatemala`,
            
            // d: Meta Description (Lo que el usuario lee en el buscador)
            d: seo.descripcion || item.DescripcionAux || "",
            
            // k: Keywords + Tags (Combinamos ambos para máxima autoridad)
            k: `${seo.keywords || ""}, ${seo.Tags || ""}`.replace(/, ,/g, ",").trim()
        };
    });

    // Exportamos como constante para acceso O(1)
    const fileContent = `// Archivo generado automáticamente - No editar
export const optimizedSeoData = ${JSON.stringify(optimized)};`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);

    console.log(`✅ ¡Optimización completada!`);
    console.log(`📊 Productos procesados: ${Object.keys(optimized).length}`);
    console.log(`📍 Archivo listo en: ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Error:', error.message);
}