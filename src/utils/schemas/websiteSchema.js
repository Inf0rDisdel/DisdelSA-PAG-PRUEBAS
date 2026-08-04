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
    "Productos de limpieza profesional, higiene institucional, EPP y suministros empresariales con cobertura en toda Guatemala.";

   return {

      "@type":"WebSite",

      "@id":"https://disdelsa.com/#website",

      "url":"https://disdelsa.com/",

      "name":metaTitle,

      "description":metaDescription,

      "about":{
      "@type":"Thing",
      "name":"Productos de limpieza profesional"
      },

      "audience":{
      "@type":"BusinessAudience",
      "audienceType":"Empresas, hoteles, industrias, restaurantes e instituciones"
      },

      "isPartOf":{
      "@id":"https://disdelsa.com/#organization"
      },

      "hasPart":[
         {
            "@type":"WebPage",
            "name":"Categorías"
         },
         {
            "@type":"WebPage",
            "name":"Marcas"
         },
         {
            "@type":"WebPage",
            "name":"Productos"
         }
      ],

      "keywords":[
         "productos de limpieza",
         "limpieza profesional",
         "venta por mayor",
         "suministros de limpieza",
         "empresa de limpieza Guatemala",
         "Disdel"
      ].join(", "),

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

        "alternateName":[
            "Disdel",
            "Disdelsa",
            "Disdel Guatemala"
         ],

   };

}