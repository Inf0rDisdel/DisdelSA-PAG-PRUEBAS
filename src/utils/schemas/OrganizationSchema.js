export const getOrganizationSchema = (companyInfo = {}) => {
    const info = companyInfo || {};

    const name =
    info.nombreEmpresa ||
    info.NombreEmpresa ||
    "Disdel, S.A.";

    const opening =
    info.horaApertura ||
    info.HoraApertura ||
    "07:00";

    const closing =
    info.horaCierre ||
    info.HoraCierre ||
    "17:00";

  const alternate = (info.nombreAlternativo || info.NombreAlternativo) 
    ? [info.nombreAlternativo || info.NombreAlternativo] 
    : ["Disdel", "Disdelsa", "Disdel Guatemala"];
  
  const description = 
    info.metaDescription || 
    info.MetaDescription || 
    info.descripcionCorta || 
    info.DescripcionCorta || 
    "Productos de limpieza profesional, higiene institucional, EPP y suministros empresariales con cobertura en toda Guatemala.";
  
  const telephone = (info.telefono || info.Telefono) 
    ? String(info.telefono || info.Telefono) 
    : "2422-6120";
    
  const email = info.correo || info.Correo || "info@disdelsa.com";
  const address = info.direccion || info.Direccion || "15 Calle 16-30 Zona 1";
  const url = info.url || info.URL || "https://disdelsa.com/";
  const locality = info.ciudad || info.Ciudad || "Ciudad de Guatemala";
  const postalCode = info.codigoPostal || info.CodigoPostal || "01001";
  const country = info.pais || info.Pais || "GT";

  const cleanPhone = telephone.startsWith("+502") ? telephone : `+502-${telephone}`;

  const keywords = [
    info.metaKeyword,
    info.MetaKeyword,
    info.metaTags,
    info.MetaTags
  ]
    .filter(Boolean)
    .join(", ");


  // --- ESTRUCTURA DE SUCURSALES (Multi-Location) ---
  // Sucursal 1: Oficina Central (Zona 1) - Traída dinámicamente de tu Base de Datos
  const sucursalZona1 = {
    "@type": ["Organization", "LocalBusiness", "WholesaleStore"],
    "@id": "https://disdelsa.com/#store-zona1",
    "name": name,
    "telephone": cleanPhone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": locality,
      "addressRegion": "Guatemala",
      "postalCode": postalCode,
      "addressCountry": country
    }
  };

  // Sucursal 2: Sucursal Zona 3 - Configurada de forma segura
  const sucursalZona3 = {
    "@type": "WholesaleStore",
    "@id": "https://disdelsa.com/#store-zona3",
    "name": "Disdel - Zona 3",
    "telephone": "+502 2247-1620", 
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "27 Calle 1-41 Zona 3",
      "addressLocality": "Ciudad de Guatemala",
      "addressRegion": "Guatemala",
      "postalCode": "01003",
      "addressCountry": "GT"
      }
    };

    return {
        "@type": "Organization",
        "@id": "https://disdelsa.com/#organization",

        "name": name,
        "alternateName": alternate,
        "url": url,

        "logo": {
          "@type": "ImageObject",
          "@id":"https://disdelsa.com/#logo",
          "url":"https://disdelsa.com/logo-disdel.png"
        },

        "image": "https://disdelsa.com/og-image.jpg",

        "description": description,
        "telephone": cleanPhone,
        "email": email,

        "brand":{
          "@type":"Brand",
          "@id":"https://disdelsa.com/marca/disdel#brand",
          "name":"Disdel"
        },

        "keywords": [
          ...keywords.split(",").map(k => k.trim()).filter(Boolean),
          "Disdel",
          "Suministros de limpieza",
          "Productos de limpieza Guatemala",
          "Mantenimiento institucional",
          "Mayorista limpieza Guatemala",
          "Empresa de limpieza Guatemala",
          "Higiene institucional",
          "Disdel Guatemala"
        ],

        "priceRange": "$$",

        "department": [
          sucursalZona1,
          sucursalZona3
        ],

        "address": {
          "@type": "PostalAddress",
          "streetAddress": address,
          "addressLocality": locality,
          "addressRegion": "Guatemala",
          "postalCode": postalCode,
          "addressCountry": country
        },
        
        "foundingDate":"1995",

        "slogan":"Distribuidor líder en productos de limpieza en Guatemala",

        "knowsAbout":[
            "Productos de limpieza",
            "Higiene institucional",
            "Seguridad industrial",
            "Productos para cafetería",
            "Mantenimiento"
        ],

        "makesOffer":[
        {
            "@type":"Offer",
            "itemOffered":{
                "@type":"Service",
                "name":"Venta mayorista"
            }
        }
        ],

        "hasOfferCatalog":{
          "@type":"OfferCatalog",
          "name":"Catálogo de productos Disdel",
          "url":"https://disdelsa.com/"
        },

        "hasMap":
          "https://maps.google.com/?q=15+Calle+16-30+Zona+1+Ciudad+de+Guatemala",

        "areaServed": {
          "@type": "Country",
          "name": "Guatemala"
        },

        "openingHours": [
          `Mo-Fr ${opening}-${closing}`
        ],

        "foundingLocation": {
          "@type": "Place",
          "name": "Ciudad de Guatemala"
        },

        "contactPoint": {
          "@type": "ContactPoint",
          "telephone":cleanPhone,
          "contactType": "Ventas",
          "availableLanguage": ["Spanish"]
        },

        "sameAs": [
          "https://www.facebook.com/disdelsagt",
          "https://www.instagram.com/disdelsagt",
          "https://www.linkedin.com/company/disdelsa"
        ]
    };
};