export const getWebPageSchema = (companyInfo = {}) => {
   const info = companyInfo || {};

   const metaTitle =
      info.metaTitle ||
      info.MetaTitle ||
      "Disdel Guatemala";

   const metaDescription =
    info.metaDescription ||
    info.MetaDescription ||
    info.descripcionCorta ||
    info.DescripcionCorta ||
    "Productos de limpieza profesional, higiene institucional, EPP y suministros empresariales con cobertura en toda Guatemala.";

   return {

      "@type":"WebPage",

      "@id":"https://disdelsa.com/#webpage",

      "url":"https://disdelsa.com/",

      "name":metaTitle,

      "description":metaDescription,

      "isPartOf":{
         "@id":"https://disdelsa.com/#website"
      },

      "about":{
         "@id":"https://disdelsa.com/#organization"
      },

      "primaryImageOfPage":{
         "@type":"ImageObject",
         "url":"https://disdelsa.com/og-image.jpg"
      },

      "publisher":{
         "@id":"https://disdelsa.com/#organization"
      }

   };

}