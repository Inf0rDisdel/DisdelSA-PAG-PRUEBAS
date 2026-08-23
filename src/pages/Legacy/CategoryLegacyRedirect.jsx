import React, { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useMenu } from 'hooks/useMenu';
import { createSlug } from 'utils/slugify';

import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import NotFoundLegacyRedirect from './NotFoundLegacyRedirect';

const CategoryLegacyRedirect = () => {

    const { slug } = useParams();

    const { data: menuData, isLoading, isError } = useMenu();

    const targetPath = useMemo(() => {

        if (!menuData || !slug) return null;

        const searchSlug = createSlug(slug);

        if (searchSlug === 'decapante') {
            return '/categoria/quimicos-para-limpieza/removedores-y-solventes';
        }

        if (searchSlug === 'suavizante') {
            return '/categoria/quimicos-para-limpieza/lavanderia/para-ropa';
        }

        for (const segmento of menuData) {

            const segmentoSlug = createSlug(segmento.NombreSegmento);

            // SEGMENTO
            if (segmentoSlug === searchSlug) {
                return `/categoria/${segmentoSlug}`;
            }

            for (const categoria of segmento.Categorias || []) {

                const categoriaSlug = createSlug(categoria.NombreCategoria);

                // CATEGORÍA
                if (categoriaSlug === searchSlug) {
                    return `/categoria/${segmentoSlug}/${categoriaSlug}`;
                }

                for (const sub of categoria.SubCategorias || []) {

                    const subSlug = createSlug(sub.NombreSubCategoria);

                    // SUBCATEGORÍA
                    if (subSlug === searchSlug) {
                        return `/categoria/${segmentoSlug}/${categoriaSlug}/${subSlug}`;
                    }

                }

            }

        }

        return null;

    }, [menuData, slug]);

    if (isLoading) {
        return <CatalogSkeleton />;
    }

    if (targetPath) {
        return <Navigate replace to={targetPath} />;
    }

    if (isError || !targetPath) {
        return <NotFoundLegacyRedirect />;
    }

    return null;

};

export default CategoryLegacyRedirect;
