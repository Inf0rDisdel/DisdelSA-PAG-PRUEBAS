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
        "url": url,
        "name": title,
        "description": description,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": safeProducts.length,
          "itemListElement": safeProducts.slice(0, 30).map((prod, index) => {
            const productUrl = `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}/${createSlug(prod.Descripcion)}`;
            const hasImage =
            prod.Imagen &&
            String(prod.Imagen).trim() !== "" &&
            String(prod.Imagen) !== "0";

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
                "brand": {
                  "@type": "Brand",
                  "name": prod.Marca || "Disdel"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "bestRating": "5",
                  "worstRating": "1",
                  "ratingCount": "1"
                },
                "isPartOf":{
                "@id":"https://disdelsa.com/#website"
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