/**
 * Genera una descripción comercial y técnica única para el producto.
 * @param {Object} product - Los datos del producto que vienen de la API.
 * @param {Object} legacySeo - El objeto optimizado del JSON (t, d, k, ld).
 */

export const generateProductInsight = (product = null) => {
  if (!product) return "";

  const { Descripcion, Marca, Categoria } = product;
  const nombre = `<strong>${Descripcion}</strong>`;
  const marca = `<strong>${Marca || "Disdel"}</strong>`;
  const cat = `<strong>${Categoria}</strong>`;

  const categoriaLower = Categoria.toLowerCase();

  // 🚀 LÓGICA POR SEGMENTO (Corta, Directa y Llamativa)
  
  // 1. Químicos y Limpieza Líquida
  if (categoriaLower.includes("quimico") || categoriaLower.includes("limpieza") || categoriaLower.includes("desinfectante")) {
    return `Potencie la higiene con ${nombre}. Formulación de alto rendimiento de ${marca} en la línea de ${cat}, diseñada para eliminar suciedad difícil y proteger sus superficies.`;
  }

  // 2. Cuidado de Muebles / Especialidades
  if (categoriaLower.includes("mueble") || categoriaLower.includes("aceite") || categoriaLower.includes("superficie")) {
    return `Renueve y proteja con ${nombre}. La solución líder de ${marca} en ${cat} para un acabado profesional, brillo duradero y cuidado profundo de sus activos.`;
  }

  // 3. Gestión de Residuos / Reciclaje
  if (categoriaLower.includes("basura") || categoriaLower.includes("contenedor") || categoriaLower.includes("desecho")) {
    return `Optimice la gestión de residuos con ${nombre}. Durabilidad garantizada de ${marca} en la categoría de ${cat}, ideal para mantener áreas limpias y organizadas.`;
  }

  // 4. Papelería e Higiene (Papel, Toallas)
  if (categoriaLower.includes("papel") || categoriaLower.includes("higienico") || categoriaLower.includes("toalla")) {
    return `Máximo rendimiento y suavidad con ${nombre}. Un artículo esencial de ${cat} con el respaldo de ${marca}, optimizado para alto tráfico institucional.`;
  }

  // 5. Herramientas de limpieza (Mopas, Escobas)
  if (categoriaLower.includes("herramienta") || categoriaLower.includes("mopa") || categoriaLower.includes("cepillo")) {
    return `Eficiencia operativa con ${nombre}. Ergonomía y resistencia de ${marca} en la línea ${cat}, facilitando las tareas de mantenimiento profesional.`;
  }

  // Fallback Genérico Profesional (Si no cae en ninguna categoría)
  return `Abastecimiento técnico con ${nombre}. Calidad garantizada de ${marca} en la gama de ${cat}, seleccionada bajo estándares institucionales para Guatemala.`;
};



export const generateProductSeoDescription = (product, legacySeo = null) => {
  if (!product) return "";

  const { Descripcion, Marca, Categoria, IdProducto } = product;
  const baseDescription = legacySeo?.ld || legacySeo?.description || ""; 
  
  // Ganchos sin HTML (Google prefiere texto plano en meta tags)
  const hooks = [
    `Optimice los estándares de su empresa con ${Descripcion}.`,
    `Garantice resultados de grado institucional utilizando ${Descripcion}.`,
    `El ${Descripcion} es la solución técnica líder de ${Marca || "Disdel"} para su negocio.`,
    `Abastecimiento profesional de alto rendimiento con ${Descripcion}.`
  ];
  const selectedHook = hooks[String(IdProducto).length % hooks.length];

  let body = baseDescription;
  if (!body || body.length < 15) {
    const catLower = Categoria.toLowerCase();
    if (catLower.includes("quimico") || catLower.includes("limpieza")) {
      body = `Esta formulación de alta concentración en la línea de ${Categoria} está diseñada para desinfección profunda en entornos industriales de Guatemala.`;
    } else {
      body = `Este producto seleccionado de la gama ${Categoria} cumple con los requisitos técnicos exigidos para el mantenimiento institucional.`;
    }
  }

  const closure = `Adquiera calidad garantizada con Disdel. Solicite su cotización institucional por mayoreo para el código ${IdProducto}.`;

  return `${selectedHook} ${body} ${closure}`.replace(/<[^>]*>?/gm, ''); // Limpiamos cualquier HTML por si acaso
};