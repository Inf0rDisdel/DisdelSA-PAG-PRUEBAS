// src/api/VentasApi.js
import { apiVentas, apiSuscripcion, ApiMobil } from './apiInstance';

/**
 * ENVIAR COTIZACIÓN (Puerto 60839)
 */
export const solicitarCotizador = async (datos) => {
    try {
        // Usamos apiVentas
        const response = await apiVentas.post('api/doc/SolicitarCotizador', datos);
        return response.data; 
    } catch (error) {
        console.error("Error en cotización:", error.response?.data || error.message);
        throw error;
    }
};    

/**
 * SUSCRIPCIÓN NEWSLETTER (Puerto 56110)
 */
export const suscribiNewsLetter = async (datosSuscripcion) => {
    try {
        const payload = {
            Correo: datosSuscripcion.email,
            Tipo: "Suscripcion",
            AceptoTerminos: datosSuscripcion.acepto,
            AceptoPoliticas: datosSuscripcion.acepto,
            Log: { 
                Activo: true, 
                IdHostCreacion: "192.168.16.7", 
                FechaCreacion: new Date().toISOString() 
            },
            BaseDatos: "SBO_DISDELSA_2013"
        };

        // Usamos apiSuscripcion para que vaya al puerto 56110
        // Mantenemos la ruta limpia sin '/' al inicio
        const response = await apiSuscripcion.post('api/SolicitudUsuarioWeb/SolicitarInfo', payload);
        return response.data; 
    } catch (error) {
        console.error("Error detallado en suscripción:", error.response?.data || error.message);
        throw error;
    }
};

//DATOS COMPANIA EN GENERAL
export const CompaniaWeb = async () => {
    try{
        const response = await ApiMobil.get('api/DatosPagina/GetDatosCompania/1007');
        return response.data;
    } catch (error) {
        console.error("Error al obtener la iformación de la empresa:" , error.response?.data || error.message);
        throw error;
    }
};