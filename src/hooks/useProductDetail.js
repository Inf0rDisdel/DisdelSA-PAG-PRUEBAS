import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiMobil } from '../api/apiInstance'; // Tu instancia axios

const fetchProductDetail = async (id) => {
    // 1. Verificamos que el ID no sea undefined
    if (!id) throw new Error("ID de producto inválido");

    const idLimpioParaAPI = String(id).trim().toUpperCase();

    console.log("📡 Enviando petición para ID:", id); // Debug para ti

    // 2. Enviamos el objeto JSON exacto que espera C#
    const { data } = await ApiMobil.post('/api/PaginaWeb/GetProductoDetalle', 
        { idProducto: idLimpioParaAPI }
    );
    
    if(!data) throw new Error("Producto no encontrado en DB");
    
    return data;
};

export const useProductDetail = (productId) => {

    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['producto-detalle', productId],
        queryFn: () => fetchProductDetail(productId),
        // No disparamos la petición si el ID está vacío
        enabled: !!productId && productId.length > 0, 
        staleTime: 1000 * 60 * 30, // 30 minutos en caché
        retry: 1, 
        refetchOnWindowFocus: false ,
        placeholderData: () => {
            return queryClient.getQueryData(['productos-lista'])?.find(
                p => String(p.IdProducto) === String(productId)
            );
        }
    });
};