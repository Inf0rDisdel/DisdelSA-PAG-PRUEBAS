import { useQuery } from "@tanstack/react-query";
import { ApiMobil } from '../api/apiInstance'; // Tu instancia axios

const fetchProductDetail = async (id) => {
    // 1. Verificamos que el ID no sea undefined
    if (!id) throw new Error("ID de producto inválido");

    console.log("📡 Enviando petición para ID:", id); // Debug para ti

    // 2. Enviamos el objeto JSON exacto que espera C#
    const { data } = await ApiMobil.post('/api/PaginaWeb/GetProductoDetalle', 
        { idProducto: String(id) } // Aseguramos que sea string
    );
    
    if(!data) throw new Error("Producto no encontrado en DB");
    
    return data;
};

export const useProductDetail = (productId) => {
    return useQuery({
        queryKey: ['producto-detalle', productId],
        queryFn: () => fetchProductDetail(productId),
        enabled: !!productId && productId.length > 0, // Evita llamadas con ID vacío
        staleTime: 1000 * 60 * 30, // 30 minutos
        retry: 1, // Solo reintentar una vez si falla
        refetchOnWindowFocus: false // Evita parpadeos si el usuario cambia de pestaña
    });
};