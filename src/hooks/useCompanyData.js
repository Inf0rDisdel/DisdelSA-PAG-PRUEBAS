import { useQuery } from "@tanstack/react-query";
import { apiVentas } from "api/apiInstance"; 

const fetchCompanyData = async () => {
    //Consumimos el puerto de venta 60839 
    const { data } = await apiVentas.get('api/DatosPagina/GetDatosCompania/1007');
    return data;
};

export const useCompanyData = () => {
    return useQuery({
        queryKey: ['company-data'],
        queryFn: fetchCompanyData,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 60 *24,
        retry:1,
        refetchOnWindowFocus:false,
        refetchOnReconnect:false,
    });
};