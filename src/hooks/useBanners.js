import { useQuery } from "@tanstack/react-query";
import { ApiMobil } from '../api/apiInstance';

const BANNER_GROUPS = {
    3: 'sliderPrincipal',
    26: 'lateralesPrincipal',
    1: 'promoNescafe',
    4: 'sliderMarcas',
    9: 'promoExtra',
    14: 'aliados',
    15: 'promoGrid',
    27: 'BannersMarcasInternos',
    28: 'QuienesSomos',
    29: 'Ubicaciones',
    30: 'ImagenPredeterminado',
    31: 'Logo',
    32: 'Iconos'
};

const createEmptyBannerGroups = () => ({
    sliderPrincipal: [],
    lateralesPrincipal: [],
    promoNescafe: [],
    sliderMarcas: [],
    promoExtra: [],
    aliados: [],
    promoGrid: [],
    BannersMarcasInternos: [],
    QuienesSomos: [],
    Ubicaciones: [],
    ImagenPredeterminado: [],
    Logo: [],
    Iconos: []
});

// Referencia estable: TanStack Query reutiliza el resultado mientras los
// datos no cambien, en lugar de reagrupar banners en cada observador/render.
const groupBanners = (data) => (
    (Array.isArray(data) ? data : []).reduce((groups, banner) => {
        const groupName = BANNER_GROUPS[banner.IdTipoBanner];
        if (groupName) groups[groupName].push(banner);
        return groups;
    }, createEmptyBannerGroups())
);

const fetchBanners = async () => {
    const preloadedBanners = typeof window !== 'undefined'
        ? window.__DISDEL_BANNERS_PROMISE__
        : null;

    if (preloadedBanners) {
        const preloadedData = await preloadedBanners;
        if (Array.isArray(preloadedData)) return preloadedData;
    }

    // 🔥 SOLUCIÓN ERROR 405: Usamos .post explícitamente y enviamos el JSON
    const { data } = await ApiMobil.post('api/PaginaWeb/GetBanners', {
        IdCompania: 1007,
        Division: "1"
    });
    return data;
};

export const useBanners = () => {
    return useQuery({
        queryKey: ['banners'],
        queryFn: fetchBanners,
        staleTime: 1000 * 60 * 30, 
        gcTime: 1000 * 60 * 30,
        retry: 1,
        placeholderData: (prev) => prev, 
        select: groupBanners
    });
};
