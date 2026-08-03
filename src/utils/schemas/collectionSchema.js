import { AppConfig } from "config/AppConfig";
import { createSlug } from "utils/slugify";
import { getBreadcrumbs } from "./breadcrumbSchema";

export const getCollectionSchema = (title, description, url, products = []) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,

        "breadcrumb":{
        "@id":`${url}#breadcrumb`
        },
        "url": url,
        "name": title,
        "description":
        description ||
        `${title} para empresas, industrias e instituciones en Guatemala.`,

        "isRelatedTo":[
        {
        "@type":"Thing",
        "name":"Productos de limpieza"
        },
        {
        "@type":"Thing",
        "name":"Venta por mayor"
        },
        {
        "@type":"Thing",
        "name":"Limpieza profesional"
        }
        ],

        "keywords":[
          title,
          `${title} Guatemala`,
          `${title} por mayor`,
          `${title} mayoreo`,
          `${title} empresas`,
          "productos de limpieza",
          "suministros de limpieza",
          "limpieza industrial",
          "venta por mayor",
          "distribuidor Guatemala"
        ].join(", "),

        "hasPart":{
          "@type":"ItemList",
          "@id":`${url}#products`,
          "numberOfItems":safeProducts.length
        },

        "about":{
        "@type":"Collection",
        "@id":`${url}#about`,
        "name":title,
        "description":
            description ||
            `${title} para empresas e instituciones en Guatemala.`
        },

        "audience":{
          "@type":"BusinessAudience",
          "audienceType":"Empresas, hoteles, industrias, restaurantes e instituciones"
        },

        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":url
        },

        "publisher":{
          "@id":"https://disdelsa.com/#organization"
        },

        "isPartOf":{
          "@id":"https://disdelsa.com/#website"
        },

        "mainEntity": {
          "@type": "ItemList",
          "@id":`${url}#products`,
          "url":url,
          "name":title,
          "itemListOrder":"https://schema.org/ItemListOrderAscending",
          "numberOfItems": safeProducts.length,
          "itemListElement": safeProducts.slice(0, 30).map((prod, index) => {
            const productUrl = `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}/${createSlug(prod.Descripcion)}`;
            const hasImage =
            prod?.Imagen &&
            String(prod.Imagen).trim() !== "" &&
            String(prod.Imagen).trim() !== "0" &&
            String(prod.Imagen).trim().toLowerCase() !== "undefined" &&
            String(prod.Imagen).trim().toLowerCase() !== "n/a";

            const imageUrl = hasImage
            ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}`
            : "https://disdelsa.com/og-image.jpg";

            return {
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "url": productUrl,
                "name": prod.Descripcion,
                "image": imageUrl,
                "sku": prod.IdProducto,
                "brand":{
                  "@type":"Brand",
                  "@id":`https://disdelsa.com/marca/${createSlug(prod.Marca || "Disdel")}#brand`,
                  "name":prod.Marca || "Disdel"
                },

                "@id":`${productUrl}#product`,
                "category":title,

                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1",
                  "ratingCount": "1",
                  "reviewCount":"1"
                },
                "isPartOf":{
                  "@id":`${url}#collection`
                },
              }
            };
          })
        }
      },
      getBreadcrumbs([
        { name: "Inicio", item: "https://disdelsa.com/" },
        { name: title, item: url }
      ])
    ]
  };
};