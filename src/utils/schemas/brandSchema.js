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
        "description":description,

        "mainEntityOfPage":{
            "@type":"WebPage",
            "@id":url
        },

        "breadcrumb":{
            "@id":`${url}#breadcrumb`
        },

        "about":{
            "@type":"Brand",
            "name":brandName,
            "logo":logoUrl || "https://disdelsa.com/og-image.jpg"
        },

        "isPartOf":{
            "@id":"https://disdelsa.com/#website"
        },

        "publisher":{
            "@id":"https://disdelsa.com/#organization"
        },
        "mainEntity": {
          "@type": "ItemList",
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

                "name":prod.Descripcion,

                about:{
                "@type":"Brand",
                "@id":`${url}#brandEntity`,
                "name":brandName,
                "url":url
                },

                "image":imageUrl,

                "sku":prod.IdProducto,

                "brand":{
                    "@type":"Brand",
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