import { useQuery } from "@tanstack/react-query";
import { apiVentas } from "api/apiInstance";
import { useParams } from "react-router-dom";

const fetchCatalogSeo = async (params) => {
    //Removemos llaves vacias, nulas o ceros para enviar una URL limpia a C#
    const clearParams = Object.keys(params).reduce((acc, key) => {
        const val = params[key];
        if (val !== null && val !== undefined && val !== 0 && String(val).trim() !=="") {
            acc[key] = val;
        }
        return acc;
    }, {});

    //Si no hay ID válido, evitamos realizar la petición de red
    if (Object.key(clearParams).lenght === 0) return null;

    //Realizamos la petición GET al controlador de C#
    const { data } = await apiVentas.get('api/CatalogoSEO/GetSeo' ,{
        params: clearParams
    });

    return data;
};

export const useCatalogSeo = (params = {}) => {
    const hasParams = Object.values(params).some(
        val => val !== null && val !== undefined && val !== 0 && String(val).trim() !== ""
    );

    return useQuery({
        //Generamos una queryKey única basada en los parámetros que cambien (ej: idCategoria)
        queryKey: ['catalog-seo', params],
        queryFn: () => fetchCatalogSeo(params),
        enabled: hasParams, //Evita disparar la petición si no hay IDs válidos
        staleTime: 1000 * 60 * 60 * 24 , //Conserva en caché por 24 horas para máximo rendimiento
        refetchOnWindowFocus: false,
    });
};