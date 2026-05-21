import { createSlug } from '../slugify';
import { AppConfig } from 'config/AppConfig';

export const getMainGraphSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "WholesaleStore"],
        "@id": "https://disdelsa.com/#organization",

        "name": "Disdel, S.A.",
        "alternateName": [
          "Disdel",
          "Disdelsa",
          "Disdel Guatemala"
        ],

        "url": "https://disdelsa.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://disdelsa.com/logo-disdel.png"
        },

        "image": "https://disdelsa.com/og-image.jpg",

        "description": "Empresa líder en Guatemala especializada en suministros de limpieza profesional, mantenimiento institucional, higiene, cafetería y equipo de protección personal para empresas.",

        "keywords": [
          "Disdel",
          "Suministros de limpieza",
          "Productos de limpieza Guatemala",
          "Mantenimiento institucional",
          "Mayorista limpieza Guatemala",
          "Empresa de limpieza Guatemala",
          "Higiene institucional",
          "Disdel Guatemala"
        ],

        "telephone": "+502-2422-6120",

        "priceRange": "$$",

        "address": {
          "@type": "PostalAddress",
          "streetAddress": "15 Calle 16-30 Zona 1",
          "addressLocality": "Ciudad de Guatemala",
          "addressRegion": "Guatemala",
          "postalCode": "01001",
          "addressCountry": "GT"
        },

        "areaServed": {
          "@type": "Country",
          "name": "Guatemala"
        },

        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+502-2422-6120",
          "contactType": "Ventas",
          "availableLanguage": ["Spanish"]
        },

        "sameAs": [
          "https://www.facebook.com/disdelsagt",
          "https://www.instagram.com/disdelsagt",
          "https://www.linkedin.com/company/disdelsa"
        ]
      },

      {
        "@type": "WebSite",
        "@id": "https://disdelsa.com/#website",
        "url": "https://disdelsa.com/",
        "name": "Disdel Guatemala",
        "publisher": {
          "@id": "https://disdelsa.com/#organization"
        },

        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://disdelsa.com/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "sameAs": [
        "https://www.facebook.com/disdelsagt",
        "https://www.instagram.com/disdelsagt",
        "https://www.linkedin.com/company/disdelsa"
        ]
      }
    ]
  };
};
/**
 * 1. SCHEMA DE PRODUCTO (Detalle)
 */
export const getProductSchema = (product, currentUrl, productImages, legacySeo = {}) => {
  const brandName = product.Marca || "Disdel";

  const finalTitle = legacySeo?.t || product.Descripcion;
  const finalDesc = legacySeo?.d || product.DescripcionAux || product.Descripcion;
  const finalKeywords = legacySeo?.k || `${product.Categoria}, ${product.Marca}`;

  return {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${currentUrl}#product`,
        "name": finalTitle, // <-- Google usará este nombre en el resultado
        "description": finalDesc,
        "image": productImages.map(img => img.includes('http') ? img : `${AppConfig.baseImageUrl}productos/${img}`),
        "sku": product.IdProducto,
        "mpn": product.SkuCaja || product.IdProducto,
        "keywords": finalKeywords,
        "gtin13": product.CodigoBarras || undefined,
        "gtin": product.UPC || undefined,
        "brand": { "@type": "Brand", "name": brandName },
        "weight": product.Peso && product.Peso !== "0" ? { "@type": "QuantitativeValue", "value": product.Peso, "unitCode": "KGM" } : undefined,
        "height": product.Altura && product.Altura !== "0" ? { "@type": "QuantitativeValue", "value": product.Altura, "unitCode": "CMT" } : undefined,
        "width": product.Ancho && product.Ancho !== "0" ? { "@type": "QuantitativeValue", "value": product.Ancho, "unitCode": "CMT" } : undefined,
        "depth": product.Longitud && product.Longitud !== "0" ? { "@type": "QuantitativeValue", "value": product.Longitud, "unitCode": "CMT" } : undefined,
        "offers": {
          "@type": "Offer",
          "url": currentUrl,
          "priceCurrency": "GTQ",
          "price": product.Precio && product.Precio !== "0" ? product.Precio : undefined,
          "availability": product.Stock > 0 ? "https://schema.org/InStock" : "https://schema.org",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "@id": "https://disdelsa.com/#organization",
            "name": "Disdel, S.A."
          }
        }
      },
      getBreadcrumbs([
        { name: "Inicio", item: "https://disdelsa.com/" },
        { name: product.Categoria, item: `https://disdelsa.com/categoria/${createSlug(product.Categoria)}` },
        { name: product.Descripcion, item: currentUrl }
      ]),
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `¿Cómo comprar ${product.Descripcion} por mayoreo?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `En Disdel puedes solicitar una cotización por volumen de ${product.Descripcion} directamente en nuestro portal B2B o contactando a un asesor.`
            }
          }
        ]
      }
    ]
  };
};

/**
 * 2. SCHEMA DE COLECCIONES (Categorías y Marcas)
 */
export const getCollectionSchema = (title, description, url, products) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        "url": url,
        "name": title,
        "description": description,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": products.length,
          "itemListElement": products.slice(0, 40).map((prod, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}/${createSlug(prod.Descripcion)}`,
            "name": prod.Descripcion,
            "image": `${AppConfig.baseImageUrl}productos/${prod.Imagen}`
          }))
        }
      },
      getBreadcrumbs([
        { name: "Inicio", item: "https://disdelsa.com/" },
        { name: title, item: url }
      ])
    ]
  };
};

/**
 * 3. SCHEMA DE BREADCRUMBS (Rutas de navegación)
 */
export const getBreadcrumbs = (items) => ({
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.item
  }))
});

/**
 * 4. SCHEMA DE BÚSQUEDA
 */
export const getSearchSchema = (query, totalResults) => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SearchResultsPage",
            "mainEntity": {
                "@type": "ItemList",
                "name": `Resultados de búsqueda para ${query}`,
                "numberOfItems": totalResults
            }
        },
        getBreadcrumbs([
            { name: "Inicio", item: "https://disdelsa.com/" },
            { name: "Búsqueda", item: `https://disdelsa.com/buscar?q=${query}` }
        ])
    ]
});

export const getFAQSchema = (categoryName) => {
  return {
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `¿Dónde comprar ${categoryName} por mayoreo en Guatemala?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Puede adquirir ${categoryName} de grado profesional en Disdel. Somos distribuidores líderes con entrega en toda Guatemala y atención especial a empresas e instituciones.`
      }
    },
    {
      "@type": "Question",
      "name": `¿Tienen venta de ${categoryName} por unidad?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Sí, en Disdel atendemos pedidos desde una unidad hasta volúmenes industriales, garantizando siempre el mejor precio técnico del mercado.`
      }
    }]
  };
};