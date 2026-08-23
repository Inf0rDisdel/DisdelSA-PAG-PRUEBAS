import React, { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useMenu } from 'hooks/useMenu';
import { createSlug } from 'utils/slugify';

import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import NotFoundLegacyRedirect from './NotFoundLegacyRedirect';

const BrandLegacyRedirect = () => {

    const { slug } = useParams();

    const { data: menuData, isLoading, isError } = useMenu();

    const targetPath = useMemo(() => {

        if (!menuData || !slug) return null;

        const searchSlug = createSlug(slug);

        if (searchSlug === 'kcp' || searchSlug === 'kimberly-clark-profesional') {
            return '/marca/kimberly-clark-professional';
        }

        for (const segmento of menuData) {

            for (const marca of segmento.Marcas || []) {

                const brandSlug = createSlug(marca.NombreMarca);

                if (brandSlug === searchSlug) {
                    return `/marca/${brandSlug}`;
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

export default BrandLegacyRedirect;
