
export const VentasModels = {
    crearDocAuxDTO: () => ({
        Encabezado: {},
        Detalle: [],
        Adjuntos: [],
        Autorizacion: {}
    }),

    crearDocDTO: (formData) => ({
        U_DoctoNIT: formData.nit || "",
        NombreCliente: formData.nombre || "",
        CardCode: formData.cardCode || "C9999", 
        Comentario: formData.comentario || "Pedido desde Web Ecommerce",
        Email: formData.email || "",
        TipoCliente: "1", 
        Recaptcha_key: formData.recaptchaToken || "manual_token", 
        PaginaProvenienteRecaptcha: window.location.hostname,
        BaseDatos: "SBO_DISDELSA_2013",
        Almacen: "03"
    }),

    crearDocDetalleDTO: (item) => ({
        CodProducto: item.id || item.code, 
        Cantidad: item.quantity || 1,
        PrecioIVA: item.price || 0,
        Base: "1",
        Almacen: "03"
    })
};