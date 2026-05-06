import { useMemo } from 'react';

/**
 * Hook para centralizar la lógica de filtrado y de-duplicación de productos.
 * @param {Array} productsData - Lista completa de productos desde la API.
 * @param {Object} currentSegment - El segmento (Marca o Categoría principal) actual.
 * @param {String|Number} activeCatId - ID de la categoría seleccionada.
 * @param {String|Number} activeSubCatId - ID de la subcategoría seleccionada.
 */
export const useFilterProducts = (productsData, currentSegment, activeCatId, activeSubCatId) => {
  
  // Función auxiliar de normalización para evitar errores de tipos (string vs number)
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  return useMemo(() => {
    if (!productsData || !currentSegment) return [];

    // 1. Filtrado Lógico
    const filtered = productsData.filter(prod => {
      if (norm(prod.IdSegmento) !== norm(currentSegment.IdSegmento)) return false;
      if (activeCatId && norm(prod.IdCategoria) !== norm(activeCatId)) return false;
      if (activeSubCatId && norm(prod.IdSubCategoria) !== norm(activeSubCatId)) return false;
      return true;
    });

    // 2. De-duplicación (Eficiencia: Usamos Set para O(1) en búsqueda)
    const seenIds = new Set();
    return filtered.filter(prod => {
      if (seenIds.has(prod.IdProducto)) return false;
      seenIds.add(prod.IdProducto);
      return true;
    });

  }, [productsData, currentSegment, activeCatId, activeSubCatId]);
};