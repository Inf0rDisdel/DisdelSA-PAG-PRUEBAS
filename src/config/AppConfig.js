const estoyEnModoLocal = false; 

const URLs = {
    local: {
        suscripcion: "http://localhost:56110/",
        ventas: "http://localhost:60839/",
        maestros: "http://localhost:51855/",
        compra: "http://localhost:65324/", 
        mobil : "http://localhost:56110/"
    },
    produccion: {
        ventas: "https://www.disdelsagt.com/MyWsOneVenta/",
        suscripcion: "https://www.disdelsagt.com/MyWsOneVenta/",
        maestros: "https://www.disdelsagt.com/MyWsMaestro/",
        compra: "https://www.disdelsagt.com/MyWsCompra/", 
        mobil: "https://www.disdelsagt.com/MyWsMobil/"
    }
};

export const AppConfig = {
    baseUrlVentas: estoyEnModoLocal ? URLs.local.ventas : URLs.produccion.ventas,
    baseUrlSuscripcion: estoyEnModoLocal ? URLs.local.suscripcion : URLs.produccion.suscripcion,
    baseUrlMaestros: estoyEnModoLocal ? URLs.local.maestros : URLs.produccion.maestros,
    baseUrlMobil: estoyEnModoLocal ? URLs.local.mobil : URLs.produccion.mobil,
    baseImageUrl: "https://disdelsa.com/imagenes/" 
};