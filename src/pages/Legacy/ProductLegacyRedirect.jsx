import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProductDetail } from 'hooks/useProductDetail';
import { createSlug } from 'utils/slugify';
import ProductDetailSkeleton from 'components/ui/Skeleton/ProductDetailSkeleton';
import NotFoundLegacyRedirect from './NotFoundLegacyRedirect';

const ProductLegacyRedirect = () => {
  const { id } = useParams();
  const cleanId = id ? String(id).trim().toLowerCase() : '';

  const { data: product, isLoading, isError } = useProductDetail(cleanId);

  const targetSlug = useMemo(() => {
    if (!product || !product.Descripcion) return '';
    return createSlug(product.Descripcion);
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;

  // Si el producto existe, redirige a la URL canónica con slug
  if (product && product.IdProducto && targetSlug) {
    const canonicalId = String(product.IdProducto).trim().toLowerCase();
    return <Navigate to={`/producto/${canonicalId}/${targetSlug}`} replace />;
  }

  // Si no existe, muestra el 404 (Anti Soft-404)
  if (isError || !product || !product.IdProducto) {
    return <NotFoundLegacyRedirect />;
  }

  return null;
};

export default ProductLegacyRedirect;