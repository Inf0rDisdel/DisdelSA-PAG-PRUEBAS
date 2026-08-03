import { AppConfig } from "config/AppConfig";
import { createSlug } from "utils/slugify";
import { getBreadcrumbs } from "./breadcrumbSchema";

export const getCategorySchema = ({ 
  title = "", 
  description = "", 
  url = "", 
  products = [], 
  segmentName = "", 
  categoryName = "", 
  subCategoryName = "" 
}) => {
  const safeProducts = Array.isArray(products) ? products : [];

  // Construcción dinámica de Breadcrumbs
  const breadcrumbsList = [
    { name: "Inicio", item: "https://disdelsa.com/" }
  ];

  if (segmentName) {
    breadcrumbsList.push({
      name: segmentName,
      item: `https://disdelsa.com/categoria/${createSlug(segmentName)}`
    });
  }

  if (categoryName && categoryName !== segmentName) {
    breadcrumbsList.push({
      name: categoryName,
      item: url
    });
  }

  if (subCategoryName) {
    breadcrumbsList.push({
      name: subCategoryName,
      item: url
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#category`,
        "url": url,
        "name": title,
        "description": description,
        "hasPart":{
          "@type":"ItemList",
          "@id":`${url}#products`,
          "numberOfItems":safeProducts.length
        },

        "keywords":[
          title,
          `${title} Guatemala`,
          `${title} por mayor`,
          `${title} mayoreo`,
          `${title} para empresas`,
          "productos de limpieza",
          "suministros de limpieza",
          "limpieza profesional",
          "limpieza industrial",
          "distribuidor de limpieza",
          "venta por mayor"
        ].join(", "),

        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":url
        },

        "breadcrumb":{
        "@id":`${url}#breadcrumb`
        },

        "about":{
          "@type":"DefinedTerm",
          "name":title,
          "description":
          description ||
          `Encuentra ${title.toLowerCase()} para empresas, industrias, hoteles, restaurantes e instituciones en Guatemala.`,
        },

        "isRelatedTo":[
        {
          "@type":"Thing",
          "name":"Productos de limpieza"
        },
        {
          "@type":"Thing",
          "name":"Limpieza profesional"
        },
        {
          "@type":"Thing",
          "name":"Venta por mayor"
        },
        {
          "@type":"Thing",
          "name":"Higiene institucional"
        }
        ],

        "audience":{
          "@type":"BusinessAudience",
          "audienceType":"Empresas, hoteles, industrias, restaurantes e instituciones"
        },

        "mentions":[
        {
            "@type":"Thing",
            "name":"Productos de limpieza"
        },
        {
            "@type":"Thing",
            "name":"Venta al por mayor"
        },
        {
            "@type":"Thing",
            "name":"Guatemala"
        }
        ],

        "isPartOf":{
        "@id":"https://disdelsa.com/#website"
        },

        "publisher":{
        "@id":"https://disdelsa.com/#organization"
        },

        "mainEntity":{
        "@type":"ItemList",
        "@id":`${url}#products`,
        "name":title,
        "itemListOrder":"https://schema.org/ItemListOrderAscending",
        "numberOfItems":safeProducts.length,
        "itemListElement": safeProducts.slice(0, 30).map((prod, index) => {
            const productUrl = `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}/${createSlug(prod.Descripcion)}`;
            
            // 🚀 VALIDACIÓN DEFENSIVA DE IMÁGENES: Filtra '0', 'undefined' y vacíos
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
                "@type": "Product",
                "category":title,
                "url": productUrl,
                "name": prod.Descripcion,
                "image": imageUrl,
                "@id":`${productUrl}#product`,
                "sku": prod.IdProducto,
                "brand":{
                "@type":"Brand",
                "@id":`https://disdelsa.com/marca/${createSlug(prod.Marca || "Disdel")}#brand`,
                "name":prod.Marca || "Disdel"
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
      getBreadcrumbs(breadcrumbsList)
    ]
  };
};