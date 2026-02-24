import React from 'react';
import { VentasModels } from 'api/ventasModels';
import { solicitarCotizador } from 'api/VentasApi';

const Cotizador = () => {

    const enviarADisdelsa = async () => {
    
        let miDocumento = VentasModels.crearDocAuxDTO();
        
        miDocumento.Encabezado = VentasModels.crearDocDTO();
        miDocumento.Encabezado.U_DoctoNIT = "1234567-8";
        miDocumento.Encabezado.NombreCliente = "JUAN PEREZ";
        miDocumento.Encabezado.Recaptcha_key = "TOKEN_AQUÍ"; 
        miDocumento.Encabezado.PaginaProvenienteRecaptcha = "localhost";

        miDocumento.Detalle.push(VentasModels.crearDocDetalleDTO("PROD01", 5, 100.00));
        miDocumento.Detalle.push(VentasModels.crearDocDetalleDTO("PROD02", 1, 50.00));

        try {
            const res = await solicitarCotizador(miDocumento);
            if(res.Resultado) {
                alert("¡Éxito! Número de documento: " + res.DocEntry);
            } else {
                alert("Error del servidor: " + res.Mensaje);
            }
        } catch (e) {
            alert("Error de conexión");
        }
    };

    return (
        <button onClick={enviarADisdelsa}>Finalizar Cotización</button>
    );
};

export default Cotizador;