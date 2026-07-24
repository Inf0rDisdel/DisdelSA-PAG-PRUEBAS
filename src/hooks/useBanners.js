import { useQuery } from "@tanstack/react-query";
import { ApiMobil } from '../api/apiInstance';

const fetchBanners = async () => {
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
        select: (data) => {
            // EFICIENCIA: Mapeo en una sola pasada O(n)
            const initialGroups = {
                sliderPrincipal: [], lateralesPrincipal: [], promoNescafe: [],
                sliderMarcas: [], promoExtra: [], aliados: [], promoGrid: [],
                BannersMarcasInternos: [], QuienesSomos: [], Ubicaciones: [],
                ImagenPredeterminado: [], Logo: [], Iconos: []
            };

            const mapping = {
                3: 'sliderPrincipal', 26: 'lateralesPrincipal', 1: 'promoNescafe',
                4: 'sliderMarcas', 9: 'promoExtra', 14: 'aliados', 15: 'promoGrid',
                27: 'BannersMarcasInternos', 28: 'QuienesSomos', 29: 'Ubicaciones',
                30: 'ImagenPredeterminado', 31: 'Logo', 32: 'Iconos'
            };

            return data.reduce((acc, banner) => {
                const key = mapping[banner.IdTipoBanner];
                if (key) acc[key].push(banner);
                return acc;
            }, initialGroups);
        }
    });
};