import { AppConfig } from "config/AppConfig";
import { createSlug } from "utils/slugify";
import { getBreadcrumbs } from "./breadcrumbSchema";

export const getBrandSchema = ({ 
  brandName = "Disdel", 
  title = "", 
  description = "", 
  url = "", 
  logoUrl = "", 
  products = [] 
}) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":"CollectionPage",
        "@id":`${url}#brand`,
        "url":url,
        "name":title,
        "description":
        description ||
        `Encuentra productos ${brandName} para empresas e instituciones en Guatemala.`,

        "hasPart":{
          "@type":"ItemList",
          "@id":`${url}#products`,
          "numberOfItems":safeProducts.length
        },

        "about":{
          "@type":"Brand",
          "@id":`${url}#brandEntity`,
          "name":brandName,
          "url":url,

          "logo":{
            "@type":"ImageObject",
            "url":logoUrl || "https://disdelsa.com/logo-disdel.png"
          },

          "description":
          description ||
          `Productos ${brandName} distribuidos por Disdel para empresas e instituciones en Guatemala.`,

          "isPartOf":{
              "@id":"https://disdelsa.com/#organization"
          }
        },

        "keywords":[
          brandName,
          `${brandName} Guatemala`,
          `${brandName} por mayor`,
          `${brandName} mayoreo`,
          `${brandName} distribuidores`,
          `${brandName} productos`,
          `${brandName} limpieza`,
          "productos de limpieza",
          "suministros de limpieza",
          "venta por mayor"
        ].join(", "),

        "audience":{
          "@type":"BusinessAudience",
          "audienceType":"Empresas, industrias, hoteles, restaurantes e instituciones"
        },

        "isRelatedTo":[
        {
        "@type":"Brand",
        "@id":`${url}#brandEntity`
        },
        {
          "@type":"Thing",
          "name":"Productos de limpieza"
        },
        {
          "@type":"Thing",
          "name":"Suministros de limpieza"
        },
        {
          "@type":"Thing",
          "name":"Higiene institucional"
        }
        ],

        "mentions":[
        {
        "@type":"Thing",
        "name":"Limpieza institucional"
        },
        {
        "@type":"Thing",
        "name":"Productos para empresas"
        },
        {
        "@type":"Thing",
        "name":"Distribución mayorista"
        }
        ],

        "mainEntityOfPage":{
            "@type":"WebPage",
            "@id":url
        },

        "breadcrumb":{
            "@id":`${url}#breadcrumb`
        },

        "isPartOf":{
            "@id":"https://disdelsa.com/#website"
        },

        "publisher":{
            "@id":"https://disdelsa.com/#organization"
        },
        "mainEntity": {
          "@type": "ItemList",
          "@id":`${url}#products`,
          "url":url,
          "name":`${brandName} productos`,
          "itemListOrder":"https://schema.org/ItemListOrderAscending",
          "numberOfItems": safeProducts.length,
          "itemListElement": safeProducts.slice(0, 30).map((prod, index) => {
            const productUrl = `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}/${createSlug(prod.Descripcion)}`;
            
            // Validation defensiva para evitar URLs del tipo 'productos/0'
            const hasImage = prod?.Imagen && 
              String(prod.Imagen).trim() !== "" && 
              String(prod.Imagen) !== "0" && 
              String(prod.Imagen).toLowerCase() !== "undefined";

            const imageUrl = hasImage 
              ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` 
              : "https://disdelsa.com/og-image.jpg";

            return {
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type":"Product",

                "@id":`${productUrl}#product`,

                "url":productUrl,

                "isPartOf":{
                "@id":`${url}#brand`
                },

                "name":prod.Descripcion,
                "category":
                prod.SubCategoria ||
                prod.Categoria ||
                brandName,

                "image":imageUrl,

                "sku":prod.IdProducto,

                "brand":{
                  "@type":"Brand",
                  "@id":`${url}#brandEntity`,
                  "name":brandName
                },

                "aggregateRating":{
                    "@type":"AggregateRating",
                    "ratingValue":"5",
                    "bestRating":"5",
                    "worstRating":"1",
                    "ratingCount":"1",
                    "reviewCount":"1"
                }
              }
            };
          })
        }
      },
      getBreadcrumbs([
        { name: "Inicio", item: "https://disdelsa.com/" },
        { name: `Marca: ${brandName}`, item: url }
      ])
    ]
  };
};