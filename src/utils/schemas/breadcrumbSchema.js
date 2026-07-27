/**
 * Schema de Breadcrumbs (Rutas de navegación)
 */
export const getBreadcrumbs = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  // 🔥 FILTRO DEFENSIVO: Sanitizamos los ítems para asegurar que tengan nombre y URL válida
  const validItems = items.filter(
    item => item && 
    item.name && 
    item.item && 
    String(item.name).trim() !== "" && 
    String(item.item).trim() !== ""
  );

  // Si no hay al menos un ítem válido, retornamos null
  if (validItems.length === 0) return null;

  const lastItem = validItems[validItems.length - 1];

  return {
    "@type": "BreadcrumbList",
    "@id": `${lastItem.item}#breadcrumb`,
    "itemListElement": validItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
};