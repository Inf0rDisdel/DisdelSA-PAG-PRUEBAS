export const getFAQSchema = (categoryName) => {
  return {
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `¿Dónde comprar ${categoryName} por mayoreo en Guatemala?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Puede adquirir ${categoryName} de grado profesional en Disdel. Somos distribuidores líderes con entrega en toda Guatemala y atención especial a empresas e instituciones.`
      }
    },
    {
      "@type": "Question",
      "name": `¿Tienen venta de ${categoryName} por unidad?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Sí, en Disdel atendemos pedidos desde una unidad hasta volúmenes industriales, garantizando siempre el mejor precio técnico del mercado.`
      }
    }]
  };
};