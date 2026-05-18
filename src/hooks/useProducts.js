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
        staleTime: 1000 * 60 * 60, // 30 min de datos "frescos"
        gcTime: 1000 * 60 * 60,    // Mantener en memoria 1 hora
        refetchOnWindowFocus: false, 
        refetchOnMount: false,     // 🔥 No volver a cargar si ya existen
        retry: 1,
        placeholderData: (previousData) => previousData, 
    });
};