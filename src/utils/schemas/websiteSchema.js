export const getWebsiteSchema = (companyInfo = {}) => {

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

      "@type":"WebSite",

      "@id":"https://disdelsa.com/#website",

      "url":"https://disdelsa.com/",

      "name":metaTitle,

      "description":metaDescription,

      "sameAs":[
      "https://www.facebook.com/disdelsagt",
      "https://www.instagram.com/disdelsagt",
      "https://www.linkedin.com/company/disdelsa"
      ],

      "publisher":{
          "@id":"https://disdelsa.com/#organization"
      },

      "potentialAction":{
        "@type":"SearchAction",
        "target":{
            "@type":"EntryPoint",
            "urlTemplate":"https://disdelsa.com/buscar?q={search_term_string}"
        },
        "query-input":"required name=search_term_string"
        },

      "copyrightHolder":{
        "@id":"https://disdelsa.com/#organization"
        },

        "copyrightYear":"2026",

        "alternateName":"Disdelsa"

   };

}