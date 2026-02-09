export const VentasModels = {
    // --- Funciones nuevas que pedía el Store ---
    crearDocAuxDTO: () => ({
        Encabezado: {},
        Detalle: [],
        Adjuntos: [],
        Autorizacion: {}
    }),

    crearDocDTO: () => ({
        U_DoctoNIT: "",
        NombreCliente: "",
        CardCode: " ", 
        Empresa: "Disdel, S.A.",
        Comments: "",
        U_Correo: "",
        U_NumTel: "",
        TipoCliente: "1",
        Autor: "",
        DireccionEntrega: "",
        Recaptcha_key: "N/A", 
        PaginaProvenienteRecaptcha: window.location.hostname,
        BaseDatos: "SBO_DISDELSA_2013",
        Almacen: "03"
    }),

    // --- Ajustamos esta para recibir parámetros sueltos (como lo hace el store) ---
    crearDocDetalleDTO: (id, quantity, price, unitType) => ({
        CodProducto: id, 
        Cantidad: parseFloat(quantity || 1),
        PrecioIVA: parseFloat(price || 0),
        Base: unitType || "Y", 
        Almacen: "03"
    }),

    // --- Tus funciones originales (se mantienen intactas) ---
    prepararCotizacion: (formData, cart) => {
        return {
            Encabezado: VentasModels.crearEncabezado(formData),
            Detalle: cart.map(item => VentasModels.crearDocDetalleDTO(item.IdProducto, item.quantity, item.Precio, item.unitType)),
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
        Recaptcha_key: "N/A", 
        PaginaProvenienteRecaptcha: window.location.hostname,
        BaseDatos: "SBO_DISDELSA_2013",
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