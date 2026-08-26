import { AppConfig } from "config/AppConfig";
import { createSlug } from "../slugify";
import { getBreadcrumbs } from "./breadcrumbSchema";

const getCleanText = (...values) => {
  const value = values.find((item) => String(item || "").trim());
  return value ? String(value).replace(/\s+/g, " ").trim() : "";
};

const getValidGtin = (value) => {
  const gtin = String(value || "").trim();

  if (!/^\d+$/.test(gtin) || ![8, 12, 13, 14].includes(gtin.length) || /^0+$/.test(gtin)) {
    return null;
  }

  const digits = gtin.split("").map(Number);
  const expectedCheckDigit = digits.pop();
  const sum = digits
    .reverse()
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  return calculatedCheckDigit === expectedCheckDigit ? gtin : null;
};

export const getProductSchema = (product = {}, currentUrl = "", productImages = [], legacySeo = {}, defaultImage = "") => {
  const brandName = product.Marca || "Disdel";

  const finalTitle = getCleanText(
    legacySeo?.t,
    product?.Descripcion,
    "Producto Disdel"
  );
  const finalDesc = getCleanText(
    legacySeo?.d,
    product?.DescripcionAux,
    product?.Descripcion,
    "Suministros de limpieza profesional en Guatemala."
  );
  const semanticKeywords = [
    product.Descripcion,
    product.Categoria,
    product.SubCategoria,
    `${product.Descripcion} mayoreo`,
    `${product.Descripcion} por mayor`,
    `${product.Descripcion} Guatemala`,
    `${product.Categoria} por mayor`,
    "productos de limpieza",
    "limpieza industrial",
    "limpieza profesional",
    "higiene institucional",
    "distribuidor de limpieza",
    "mayoreo",
    "venta por mayor",
    brandName
    ]
    .filter(Boolean)
    .join(", ");

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

  // Publica únicamente GTIN numéricos con longitud y dígito verificador válidos.
  // Los códigos internos permanecen representados por sku/mpn y no se confunden con GTIN.
  const gtinProperties = [product.CodigoBarras, product.UPC].reduce((properties, value) => {
    const gtin = getValidGtin(value);
    if (!gtin) return properties;

    const property = `gtin${gtin.length}`;
    if (!properties[property]) properties[property] = gtin;
    return properties;
  }, {});

  const toPositiveNumber = (value) => {
    if (value === null || value === undefined || String(value).trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const reviews = Array.isArray(product.Reviews) ? product.Reviews : [];
  const reviewRatings = reviews
    .map((review) => toPositiveNumber(review?.Rating ?? review?.Puntuacion ?? review?.ratingValue))
    .filter(Boolean);
  const explicitRating = toPositiveNumber(product.Puntuacion ?? product.Rating ?? product.RatingValue);
  const explicitRatingCount = toPositiveNumber(
    product.CantidadResenas ?? product.ReviewCount ?? product.RatingCount
  );
  const ratingValue = explicitRating || (
    reviewRatings.length > 0
      ? reviewRatings.reduce((total, rating) => total + rating, 0) / reviewRatings.length
      : null
  );
  const ratingCount = explicitRatingCount || reviewRatings.length;
  const aggregateRating = ratingValue && ratingCount > 0
    ? {
        "@type": "AggregateRating",
        "ratingValue": Number(ratingValue.toFixed(1)),
        "bestRating": 5,
        "worstRating": 1,
        "ratingCount": ratingCount
      }
    : null;

  return {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${currentUrl}#product`,
        "name": finalTitle, // <-- Google usará este nombre en el resultado
        "description": finalDesc,
        "disambiguatingDescription":finalDesc,

        "category":
        product.SubCategoria ||
        product.Categoria ||
        "Suministros de limpieza",

        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":currentUrl
        },

        "manufacturer":{
          "@type":"Organization",
          "@id":"https://disdelsa.com/#organization"
        },

        "image": finalImages.filter(Boolean),
        "sku": product.IdProducto,
        "mpn": product.SkuCaja || product.IdProducto,

        "audience":{
          "@type":"BusinessAudience",
          "audienceType":"Empresas, hoteles, restaurantes, industrias, instituciones"
        },

        "additionalProperty":[
        {
        "@type":"PropertyValue",
        "name":"Aplicación",
        "value":product.Categoria || "Limpieza profesional"
        },
        {
        "@type":"PropertyValue",
        "name":"Marca",
        "value":brandName
        },
        {
        "@type":"PropertyValue",
        "name":"Tipo de venta",
        "value":"Venta al por mayor"
        },
        {
        "@type":"PropertyValue",
        "name":"Mercado",
        "value":"Empresas, industrias, hoteles, restaurantes"
        }
        ],

        "isRelatedTo":[
        {
        "@type":"Thing",
        "name":"Productos de limpieza"
        },
        {
        "@type":"Thing",
        "name":"Limpieza industrial"
        },
        {
        "@type":"Thing",
        "name":"Venta por mayor"
        }
        ],

        "isSimilarTo":[
        {
        "@type":"Thing",
        "name":product.Categoria
        }
        ],

        "keywords": semanticKeywords,
        ...gtinProperties,
        "brand":{
          "@type":"Brand",
          "@id":`https://disdelsa.com/marca/${createSlug(brandName)}#brand`,
          "name":brandName
        },

        "weight": product.Peso && product.Peso !== "0" ? { "@type": "QuantitativeValue", "value": product.Peso, "unitCode": "KGM" } : undefined,
        "height": product.Altura && product.Altura !== "0" ? { "@type": "QuantitativeValue", "value": product.Altura, "unitCode": "CMT" } : undefined,
        "width": product.Ancho && product.Ancho !== "0" ? { "@type": "QuantitativeValue", "value": product.Ancho, "unitCode": "CMT" } : undefined,
        "depth": product.Longitud && product.Longitud !== "0" ? { "@type": "QuantitativeValue", "value": product.Longitud, "unitCode": "CMT" } : undefined,

        // Este catálogo B2B solicita cotizaciones. No se publica Offer hasta que
        // exista un precio de compra visible y políticas comerciales verificadas.

        "isPartOf": {
          "@id": "https://disdelsa.com/#website"
        },
        "url": currentUrl,

        // Las valoraciones solo se publican cuando proceden de reseñas reales.
        // Inventarlas puede generar resultados enriquecidos engañosos.
        ...(aggregateRating ? { "aggregateRating": aggregateRating } : {})
      },
      getBreadcrumbs([
        { name: "Inicio", item: "https://disdelsa.com/" },
        { name: product.Categoria, item: `https://disdelsa.com/categoria/${createSlug(product.Categoria)}` },
        { name: product.Descripcion, item: currentUrl }
      ]),
      {
      "@type":"FAQPage",
      "mainEntity":[
        {
            "@type":"Question",
            "name":`¿Dónde comprar ${product.Descripcion} por mayor?`,
            "acceptedAnswer":{
              "@type":"Answer",
              "text":`En Disdel puedes solicitar cotizaciones para ${product.Descripcion} por volumen en cualquier parte de Guatemala.`
            }
        },
        {
            "@type":"Question",
            "name":`¿${product.Descripcion} está disponible para empresas?`,
            "acceptedAnswer":{
              "@type":"Answer",
              "text":"Sí. Atendemos empresas, industrias, hoteles, restaurantes e instituciones."
            }
        },
        {
            "@type":"Question",
            "name":`¿Realizan envíos de ${product.Descripcion}?`,
            "acceptedAnswer":{
              "@type":"Answer",
              "text":"Realizamos envíos a toda Guatemala."
            }
        },
        {
            "@type":"Question",
            "name":`¿Cómo solicitar una cotización?`,
            "acceptedAnswer":{
              "@type":"Answer",
              "text":"Puedes solicitar una cotización directamente desde la página del producto o contactando a nuestros asesores."
            }
        },
        {
        "@type":"Question",
        "name":`¿Qué usos tiene ${product.Descripcion}?`,
        "acceptedAnswer":{
            "@type":"Answer",
            "text":`${product.Descripcion} está diseñado para aplicaciones profesionales de limpieza e higiene institucional.`
        }
        }
      ]
      }
    ]
  };
};
