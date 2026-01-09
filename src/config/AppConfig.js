const estoyEnModoLocal = true; 

const URLs = {
    local: {
        ventas: "http://localhost:60839/",
        maestros: "http://localhost:51855/",
        compra: "http://localhost:65324/"
    },
    produccion: {
        ventas: "https://www.disdelsagt.com/MyWsOneVenta/",
        maestros: "https://www.disdelsagt.com/MyWsMaestro/",
        compra: "https://www.disdelsagt.com/MyWsCompra/"
    }
};

export const AppConfig = {
    baseUrlVentas: estoyEnModoLocal ? URLs.local.ventas : URLs.produccion.ventas,
    baseUrlMaestros: estoyEnModoLocal ? URLs.local.maestros : URLs.produccion.maestros,
    baseImageUrl: "https://www.disdelsa.com/imagenes/productos/"
};