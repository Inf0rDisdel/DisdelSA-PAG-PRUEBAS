// src/data/products/productsCategories.js

// --- IMPORTACIONES DE IMÁGENES ---
import DispensadorKCP from 'assets/images/products/DispensadorKCP.jpg';
import DispensadorWiese from 'assets/images/products/DispensadorWiese.jpg';
import JabonEspumaKCP from 'assets/images/products/JabonEspumaKCP.jpg';
import JabonGelManzana from 'assets/images/products/JabonGelManzana.jpg';
import DesengrasanteMegax from 'assets/images/products/DesengrasanteMegax.png';
import DesinfectanteLeoncito from 'assets/images/products/DesinfectanteLeoncito.jpg';

import CafeInstantaneo from 'assets/images/products/CafeInstantaneo.jpg';
import CafeMolidoLeonDorado from 'assets/images/products/CafeMolidoLeonDorado.jpg';
import Cremora from 'assets/images/products/Cremora.jpg';
import CremoraBordenOriginal from 'assets/images/products/CremoraBordenOriginal.jpg';
import ToallaMayordomo from 'assets/images/products/ToallaMayordomo.jpg';
import ServilletasKitchen from 'assets/images/products/ServilletasKitchen.jpg';

import CepilloEscobaPInodoro from 'assets/images/products/CepilloEscobaPInodoro.jpg';
import PastillasDeBañoWiese from 'assets/images/products/PastillasDeBañoWiese.jpg';
import TapeteWiese from 'assets/images/products/TapeteWiese.jpg';
import GuanteLatexDomesticoAmarrilo from 'assets/images/products/GuanteLatexDomesticoAmarrilo.jpg';
import BasureroPReciclajeVerdeOrganico from 'assets/images/products/BasureroPReciclajeVerdeOrganico.jpg';
import ToallaPBañoUnica from 'assets/images/products/ToallaPBañoUnica.jpg';

// 1. BAÑOS E HIGIENE
export const banosProducts = [
    { id: 101, name: "Dispensador KCP", subcategory: "Dispensadores y Accesorios", disdelId: 'Disdel # 6071', image: DispensadorKCP, tag: 'DISPENSADOR', brand: 'Kimberly-Clark', sku: 'SKU-B01', Description: 'Solución ideal para alto tráfico, máxima suavidad y resistencia.' },
    { id: 102, name: "Dispensador Wiese", subcategory: "Dispensadores y Accesorios", disdelId: 'Disdel # plq-4104', image: DispensadorWiese, tag: 'DISPENSADOR', brand: 'Wiese', sku: 'SKU-B02', Description: 'Diseño elegante y funcional para ambientes modernos.' },
    { id: 103, name: "Jabón Espuma KCP", subcategory: "Jabón y Alcohol Para Manos", disdelId: 'Disdel # 6072', image: JabonEspumaKCP, tag: 'HIGIENE', brand: 'Kimberly-Clark', sku: 'SKU-B03', Description: 'Jabón en espuma de alta calidad, rinde más y cuida la piel.' },
    { id: 104, name: "Pastillas de Baño Wiese", subcategory: "Aromatizantes Para Baño", disdelId: 'Disdel # 6104', image: PastillasDeBañoWiese, tag: 'HIGIENE', brand: 'Wiese', sku: 'SKU-B04', Description: 'Mantiene el inodoro limpio y con aroma fresco por más tiempo.' }
];

// 2. HERRAMIENTAS PARA LIMPIEZA
export const limpiezaProducts = [
    { id: 201, name: "Cepillo Inodoro", subcategory: "Cepillos y Palos Multiusos", disdelId: 'Disdel # 7001', image: CepilloEscobaPInodoro, tag: 'LIMPIEZA', brand: 'Genérico', sku: 'SKU-L01', Description: 'Herramienta esencial para la limpieza profunda del sanitario.' },
    { id: 202, name: "Tapete Wiese", subcategory: "Alfombras", disdelId: 'Disdel # 7002', image: TapeteWiese, tag: 'LIMPIEZA', brand: 'Wiese', sku: 'SKU-L02', Description: 'Tapete atrapa mugre de alta durabilidad para entradas.' },
    { id: 203, name: "Basurero Orgánico", subcategory: "Basura y Reciclaje", disdelId: 'Disdel # 7003', image: BasureroPReciclajeVerdeOrganico, tag: 'RECICLAJE', brand: 'Genérico', sku: 'SKU-L03', Description: 'Ideal para la clasificación de residuos sólidos en empresas.' },
    { id: 204, name: "Desengrasante MEGAX", subcategory: "Limpiadores Multisupercies", disdelId: 'Disdel # 7004', image: DesengrasanteMegax, tag: 'QUÍMICO', brand: 'MEGAX', sku: 'SKU-L04', Description: 'Poderosa fórmula para remover grasa pesada en superficies.' }
];

// 3. QUÍMICOS PARA LIMPIEZA
export const quimicosProducts = [
    { id: 301, name: "Desinfectante Leoncito", subcategory: "Cuidado de Pisos y Superficies", disdelId: 'Disdel # 8001', image: DesinfectanteLeoncito, tag: 'QUÍMICO', brand: 'Leoncito', sku: 'SKU-Q01', Description: 'Elimina el 99.9% de bacterias con un aroma agradable.' },
    { id: 302, name: "Jabón Gel Manzana", subcategory: "Control de Ambiente", disdelId: 'Disdel # 8002', image: JabonGelManzana, tag: 'HIGIENE', brand: 'Genérico', sku: 'SKU-Q02', Description: 'Jabón líquido con fragancia refrescante a manzana.' },
    { id: 303, name: "Desengrasante MEGAX", subcategory: "MultiSuperficies", disdelId: 'Disdel # 8003', image: DesengrasanteMegax, tag: 'QUÍMICO', brand: 'MEGAX', sku: 'SKU-Q03', Description: 'Removedor de grasa industrial de alta eficiencia.' },
    { id: 304, name: "Desinfectante Galón", subcategory: "Lavanderia", disdelId: 'Disdel # 8004', image: DesinfectanteLeoncito, tag: 'QUÍMICO', brand: 'Leoncito', sku: 'SKU-Q04', Description: 'Presentación económica para limpieza de grandes superficies.' }
];

// 4. EPP (EQUIPO DE PROTECCIÓN)
export const eppProducts = [
    { id: 401, name: "Guantes Látex Amarillo", subcategory: "Protección Facial y Auditivo", disdelId: 'Disdel # 9001', image: GuanteLatexDomesticoAmarrilo, tag: 'EPP', brand: 'Genérico', sku: 'SKU-E01', Description: 'Protección para manos en labores domésticas e industriales ligeras.' },
    { id: 402, name: "Toalla Mayordomo", subcategory: "Protección Corporal", disdelId: 'Disdel # 9002', image: ToallaMayordomo, tag: 'PAPEL', brand: 'Genérico', sku: 'SKU-E02', Description: 'Papel absorbente multiusos para secado rápido.' },
    { id: 403, name: "Guantes de Protección", subcategory: "Protección Facial y Auditivo", disdelId: 'Disdel # 9003', image: GuanteLatexDomesticoAmarrilo, tag: 'EPP', brand: 'Genérico', sku: 'SKU-E03', Description: 'Guantes resistentes a químicos suaves.' },
    { id: 404, name: "Toalla Secado Única", subcategory: "Protección Corporal", disdelId: 'Disdel # 9004', image: ToallaPBañoUnica, tag: 'PAPEL', brand: 'Genérico', sku: 'SKU-E04', Description: 'Toalla de papel desechable para higiene garantizada.' }
];

// 5. CAFETERÍA
export const cafeteriaProducts = [
    { id: 501, name: "Café Instantáneo", subcategory: "Café y Complementos", disdelId: 'Disdel # 2001', image: CafeInstantaneo, tag: 'CAFETERÍA', brand: 'Genérico', sku: 'SKU-C01', Description: 'Café soluble de gran sabor para pausas rápidas.' },
    { id: 502, name: "Café Molido León", subcategory: "Café y Complementos", disdelId: 'Disdel # 2002', image: CafeMolidoLeonDorado, tag: 'CAFETERÍA', brand: 'León', sku: 'SKU-C02', Description: 'Café puro molido con aroma y cuerpo equilibrado.' },
    { id: 503, name: "Cremora Original", subcategory: "Café y Complementos", disdelId: 'Disdel # 2003', image: Cremora, tag: 'CAFETERÍA', brand: 'Cremora', sku: 'SKU-C03', Description: 'Sustituto de crema para café, textura suave.' },
    { id: 504, name: "Cremora Borden", subcategory: "Café y Complementos", disdelId: 'Disdel # 2004', image: CremoraBordenOriginal, tag: 'CAFETERÍA', brand: 'Borden', sku: 'SKU-C04', Description: 'Crema en polvo premium para un café más cremoso.' }
];

// 6. FERRETERÍA
export const ferreteriaProducts = [
    { id: 601, name: "Dispensador de Jabón", subcategory: "Accesorios y Herramientas", disdelId: 'Disdel # 3001', image: DispensadorWiese, tag: 'INSTALACIÓN', brand: 'Wiese', sku: 'SKU-F01', Description: 'Dispensador para montaje en pared de alta resistencia.' },
    { id: 602, name: "Basurero Industrial", subcategory: "Accesorios y Herramientas", disdelId: 'Disdel # 3002', image: BasureroPReciclajeVerdeOrganico, tag: 'MANEJO', brand: 'Genérico', sku: 'SKU-F02', Description: 'Contenedor robusto para herramientas o desechos.' },
    { id: 603, name: "Guantes de Trabajo", subcategory: "Accesorios y Herramientas", disdelId: 'Disdel # 3003', image: GuanteLatexDomesticoAmarrilo, tag: 'SEGURIDAD', brand: 'Genérico', sku: 'SKU-F03', Description: 'Guantes para labores de mantenimiento general.' },
    { id: 604, name: "Tapete de Entrada", subcategory: "Accesorios y Herramientas", disdelId: 'Disdel # 3004', image: TapeteWiese, tag: 'EQUIPAMIENTO', brand: 'Wiese', sku: 'SKU-F04', Description: 'Protección para suelos en áreas de mantenimiento.' }
];

// 7. BOTIQUÍN
export const botiquinProducts = [
    { id: 701, name: "Jabón Desinfectante", subcategory: "Primeros Auxilios", disdelId: 'Disdel # 4001', image: JabonEspumaKCP, tag: 'PRIMEROS AUXILIOS', brand: 'Kimberly-Clark', sku: 'SKU-BT01', Description: 'Limpieza antiséptica para manos.' },
    { id: 702, name: "Toallas Desechables", subcategory: "Primeros Auxilios", disdelId: 'Disdel # 4002', image: ToallaMayordomo, tag: 'CURACIÓN', brand: 'Genérico', sku: 'SKU-BT02', Description: 'Papel absorbente para curaciones básicas.' },
    { id: 703, name: "Jabón Antibacterial", subcategory: "Primeros Auxilios", disdelId: 'Disdel # 4003', image: JabonGelManzana, tag: 'HIGIENE', brand: 'Genérico', sku: 'SKU-BT03', Description: 'Limpieza de manos con acción germicida.' },
    { id: 704, name: "Papel de Limpieza", subcategory: "Primeros Auxilios", disdelId: 'Disdel # 4004', image: ToallaPBañoUnica, tag: 'PRIMEROS AUXILIOS', brand: 'Genérico', sku: 'SKU-BT04', Description: 'Ideal para limpieza en estaciones de emergencia.' }
];

// 8. MATERIAL DE OFICINA
export const oficinaProducts = [
    { id: 801, name: "Servilletas Kitchen", subcategory: "Hojas Para Usos Multiples", disdelId: 'Disdel # 5001', image: ServilletasKitchen, tag: 'OFICINA', brand: 'Kitchen', sku: 'SKU-O01', Description: 'Servilletas absorbentes para áreas de cocina de oficina.' },
    { id: 802, name: "Toalla Mayordomo", subcategory: "Accesorios Escolares y Oficina", disdelId: 'Disdel # 5002', image: ToallaMayordomo, tag: 'OFICINA', brand: 'Genérico', sku: 'SKU-O02', Description: 'Papel multiusos para limpieza de escritorios y cafetería.' },
    { id: 803, name: "Toalla Única", subcategory: "Hojas Para Usos Multiples", disdelId: 'Disdel # 5003', image: ToallaPBañoUnica, tag: 'OFICINA', brand: 'Genérico', sku: 'SKU-O03', Description: 'Papel de manos individual para dispensadores de oficina.' },
    { id: 804, name: "Basurero de Oficina", subcategory: "Accesorios Escolares y Oficina", disdelId: 'Disdel # 5004', image: BasureroPReciclajeVerdeOrganico, tag: 'OFICINA', brand: 'Genérico', sku: 'SKU-O04', Description: 'Contenedor estético para clasificación de desechos.' }
];

// MAPA DE CATEGORÍAS
export const categoryMap = {
  "baños-e-higiene": banosProducts,
  "herramientas-para-limpieza": limpiezaProducts,
  "químicos-para-limpieza": quimicosProducts,
  "epp": eppProducts,
  "cafetería": cafeteriaProducts,
  "ferretería": ferreteriaProducts,
  "botiquín": botiquinProducts,
  "material-de-oficina": oficinaProducts
};