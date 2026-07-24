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
        "mainEntityOfPage":{
    "@type":"WebPage",
    "@id":url
        },

        "breadcrumb":{
        "@id":`${url}#breadcrumb`
        },

        "about":{
        "@type":"Thing",
        "name":title
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
                "url": productUrl,
                "name": prod.Descripcion,
                "image": imageUrl,
                "@id":`${productUrl}#product`,
                "sku": prod.IdProducto,
                "brand": {
                  "@type": "Brand",
                  "name": prod.Marca || "Disdel"
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