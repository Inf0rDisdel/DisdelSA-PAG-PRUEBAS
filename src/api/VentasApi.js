import apiInstance from './apiInstance';

export const solicitarCotizador = async (datos) => {
    try {
        // Axios ya sabe que la base es baseUrlVentas y que es JSON
        const response = await apiInstance.post('api/doc/SolicitarCotizador', datos);
        
        // Axios devuelve la respuesta en .data automáticamente
        return response.data; 
    } catch (error) {
        console.error("Error en la petición:", error.response?.data || error.message);
        throw error;
    }
};