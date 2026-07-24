import { useQuery } from "@tanstack/react-query";
import { ApiMobil } from "api/apiInstance";

const fetchMenu = async () => {

    const { data } = await ApiMobil.post("api/PaginaWeb/GetMenu/", {
        IdCompania: "1007", 
        Division: "1"
    });
    return data;
};

export const useMenu = () => {
    return useQuery({
        queryKey: ['menu-arbol'], // Se guarda en la cache 
        queryFn: fetchMenu, 
        gcTime: 1000* 60 *60 *24,
        staleTime: 1000 * 60 * 60, // Se mantiene en una hora 
        retry: 2,
        refetchOnReconnect:false,
        placeholderData:(prev)=>prev,
    });
}