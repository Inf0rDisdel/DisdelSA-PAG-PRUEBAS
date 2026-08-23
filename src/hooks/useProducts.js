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

const normalizeProducts = (products) => (
    (Array.isArray(products) ? products : []).map((product) => ({
        ...product,
        IdProducto: String(product.IdProducto).trim(),
        Marca: product.Marca?.trim() || "",
        Categoria: product.Categoria?.trim() || "",
        SubCategoria: product.SubCategoria?.trim() || "",
        Segmento: product.Segmento?.trim() || "",
        Imagen: product.Imagen?.trim() || ""
    }))
);

export const useProducts = ({ enabled = true } = {}) => {
    return useQuery({
        queryKey: ['productos-all'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 60, // 30 min de datos "frescos"
        gcTime: 1000 * 60 * 60,    // Mantener en memoria 1 hora
        retry: 1,
        refetchOnWindowFocus: false, 
        refetchOnMount: false,     
        placeholderData: (previousData) => previousData,
        enabled,

        select: normalizeProducts
    });
};
