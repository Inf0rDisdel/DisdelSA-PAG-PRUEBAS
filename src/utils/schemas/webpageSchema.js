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
      "Empresa líder...";

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

      "breadcrumb":{
         "@id":"https://disdelsa.com/#breadcrumb"
      },

      "publisher":{
         "@id":"https://disdelsa.com/#organization"
      }

   };

}