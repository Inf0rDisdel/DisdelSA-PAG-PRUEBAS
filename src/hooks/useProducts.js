import { useQuery } from "@tanstack/react-query";
import { ApiMobil } from '../api/apiInstance';

const fetchProducts = async () => {
    // Llamamos a tu API de productos
    const { data } = await ApiMobil.post('/api/PaginaWeb/GetProductos', {
        IdCompania: 1007,
        Division: "1"
    });
    return data;
};

export const useProducts = () => {
    return useQuery({
        queryKey: ['productos-all'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 60, // 1 hora de caché (para no saturar)
        retry: 2
    });
};