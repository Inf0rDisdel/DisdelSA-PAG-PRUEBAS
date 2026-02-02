export const VentasModels = {
    // Función principal para armar todo el paquete
    prepararCotizacion: (formData, cart) => {
        return {
            Encabezado: VentasModels.crearEncabezado(formData),
            Detalle: cart.map(item => VentasModels.crearDocDetalleDTO(item)),
            Adjuntos: [],
            Autorizacion: {}
        };
    },

    crearEncabezado: (formData) => ({
        U_DoctoNIT: formData.nit || "C/F",
        NombreCliente: formData.company || `${formData.name} ${formData.lastname}`,
        CardCode: " ", 
        Empresa: "Disdel, S.A.",
        Comentario: `Tel: ${formData.phone}. Email: ${formData.email}. Obs: ${formData.address}`,
        Correo: formData.email,
        TipoCliente: "1",
        Autor: `${formData.name} ${formData.lastname}`,
        DireccionEntrega: formData.address || "",
        // Campos técnicos para el API
        Recaptcha_key: "N/A", 
        PaginaProvenienteRecaptcha: window.location.hostname,
        BaseDatos: "SBO_DISDELSA_2013",
        Almacen: "03"
    }),

    crearDocDetalleDTO: (item) => ({
        // Usamos IdProducto que es tu SKU real de SAP
        CodProducto: item.IdProducto || item.id, 
        Cantidad: parseFloat(item.quantity || 1),
        PrecioIVA: parseFloat(item.Precio || 0),
        Base: item.unitType || "Y", 
        Almacen: "03"
    }),
    crearSuscripcionDTO: (correo) => ({
        Correo:correo,
        Tipo:'Suscripción',
        Log: {
            Activo: true
        }
    })
};
