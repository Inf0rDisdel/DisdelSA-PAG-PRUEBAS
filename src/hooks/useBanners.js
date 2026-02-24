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
        retry: 1, // Si falla, que intente solo 1 vez más
        select: (data) => {
            return {
                sliderPrincipal: data.filter(b => b.IdTipoBanner === 3),
                lateralesPrincipal: data.filter(b => b.IdTipoBanner === 26),
                promoNescafe: data.filter(b => b.IdTipoBanner === 1),
                sliderMarcas: data.filter(b => b.IdTipoBanner === 4),
                aliados: data.filter(b => b.IdTipoBanner === 14), 
                promoGrid: data.filter(b => b.IdTipoBanner === 15)
            };
        }
    });
};