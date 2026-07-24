/**
 * Schema de Breadcrumbs (Rutas de navegación)
 */
export const getBreadcrumbs = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const lastItem = items[items.length - 1];

  return {
    "@type": "BreadcrumbList",
    "@id": `${lastItem.item}#breadcrumb`,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
};