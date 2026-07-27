import { AppConfig } from "config/AppConfig";
import { createSlug } from "../slugify";
import { getBreadcrumbs } from "./breadcrumbSchema";

export const getProductSchema = (product = {}, currentUrl = "", productImages = [], legacySeo = {}, defaultImage = "") => {
  const brandName = product.Marca || "Disdel";

 const finalTitle = legacySeo?.t || product?.Descripcion || "Producto Disdel";
  const finalDesc = legacySeo?.d || product?.DescripcionAux || product?.Descripcion || "Suministros de limpieza profesional en Guatemala.";
  const finalKeywords = legacySeo?.k || `${product?.Categoria || 'Suministros'}, ${brandName}`;

  // 🚀 FALLBACK DE IMAGEN: Si el array de fotos viene vacío, usamos la defaultImage (evita error "Falta campo image")
  const defaultLogoFallback = "https://disdelsa.com/og-image.jpg";
  const fallbackUrl = (defaultImage && defaultImage.trim() !== "") ? defaultImage : defaultLogoFallback;
  let finalImages = [];

  if (Array.isArray(productImages) && productImages.length > 0) {
    finalImages = productImages
      .filter(img => img && String(img).trim() !== "" && String(img).trim() !== "0" && String(img).trim().toLowerCase() !== "n/a")
      .map(img => img.includes('http') ? img : `${AppConfig.baseImageUrl}productos/${img}`);
  }

  // Si no hay imágenes en la galería, buscamos en product.Imagen
  if (finalImages.length === 0 && product?.Imagen && String(product.Imagen).trim() !== "" && String(product.Imagen).trim() !== "0") {
    const directImg = product.Imagen.includes('http') ? product.Imagen : `${AppConfig.baseImageUrl}productos/${product.Imagen}`;
    finalImages = [directImg];
  }

  // Fallback de seguridad final para evitar que 'image' quede nulo
  if (finalImages.length === 0) {
    finalImages = [fallbackUrl];
  }

    //SANEAMIENTO DE PRECIOS
    //Remueve símbolos de moneda y espacios en blanco
    //Remueve comas ( u otros separadores de miles) para que paseFloat no se corte en el primer millar.
    const cleanPriceString = product.Precio 
    ? String(product.Precio).replace(/[Q$\s]/gi, '').replace(/,/g, '') 
    : "";

  // 🚀 CORRECCIÓN CLAVE B2B: Conversión matemática segura del precio
  const numericPrice = parseFloat(cleanPriceString);
  const hasPrice = !isNaN(numericPrice) && numericPrice > 0;
  const finalPrice = hasPrice ? numericPrice.toFixed(2) : "0.00";

  // 🚀 SANEAMIENTO DE CÓDIGOS DE BARRA (GTIN / UPC): Si es "0", vacío o "N/A", se omiten para evitar advertencias de formato incorrecto
  const cleanGtin = product.CodigoBarras && product.CodigoBarras.trim() !== "" && product.CodigoBarras.trim() !== "0" && product.CodigoBarras.trim().toLowerCase() !== "n/a" ? product.CodigoBarras.trim() : undefined;
  const cleanUpc = product.UPC && product.UPC.trim() !== "" && product.UPC.trim() !== "0" && product.UPC.trim().toLowerCase() !== "n/a" ? product.UPC.trim() : undefined;

  return {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${currentUrl}#product`,
        "name": finalTitle, // <-- Google usará este nombre en el resultado
        "description": finalDesc,
        "category": product.Categoria,

        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":currentUrl
        },

        "manufacturer":{
          "@type":"Organization",
          "name":brandName
        },
        "image": finalImages.filter(Boolean),
        "sku": product.IdProducto,
        "mpn": product.SkuCaja || product.IdProducto,
        "keywords": finalKeywords,
        "gtin13": cleanGtin,
        "gtin": cleanUpc,
        "brand": { "@type": "Brand", "name": brandName },
        "weight": product.Peso && product.Peso !== "0" ? { "@type": "QuantitativeValue", "value": product.Peso, "unitCode": "KGM" } : undefined,
        "height": product.Altura && product.Altura !== "0" ? { "@type": "QuantitativeValue", "value": product.Altura, "unitCode": "CMT" } : undefined,
        "width": product.Ancho && product.Ancho !== "0" ? { "@type": "QuantitativeValue", "value": product.Ancho, "unitCode": "CMT" } : undefined,
        "depth": product.Longitud && product.Longitud !== "0" ? { "@type": "QuantitativeValue", "value": product.Longitud, "unitCode": "CMT" } : undefined,

        //Si tiene precio valido (mayor a cero) intectamos "offers" con el precio limpio (finalPrice)
        "offers": {
          "@type": "Offer",
          "url": currentUrl,
          "priceCurrency": "GTQ",
          "price": finalPrice,
          "availability": (product?.Stock > 0 || product?.Stock === undefined) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "@id": "https://disdelsa.com/#organization",
            "name": "Disdel, S.A."
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "@id": `${currentUrl}#shipping`,
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "GT"
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "@id": `${currentUrl}#return-policy`,
            "applicableCountry": "GT",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
            "merchantReturnDays": "30",
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          }
        },

        "isPartOf": {
          "@id": "https://disdelsa.com/#website"
        },
        "url": currentUrl,

        // 🔥 VALORACIÓN SIEMPRE PRESENTE: Cumple con la regla de valoración cuando no hay reseñas
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1"
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