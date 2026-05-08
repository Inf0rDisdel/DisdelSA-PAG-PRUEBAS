import { createSlug } from "utils/slugify";

export const generateProductTitle = (product) => {
    const nombre = product.Descripcion;
    const marca = product.Marca ? ` ${product.Marca}` : "";

    const suffixes = [
    `| Mayoreo en Guatemala | Disdel`,
    `| Distribuidor Industrial Guatemala`,
    `| Suministro Institucional | Disdel`,
    `| Precio Mayorista Guatemala`
  ];
  
  // Usamos el ID del producto para elegir siempre el mismo sufijo para ese producto
  const index = (product.IdProducto?.length || 0) % suffixes.length;
  return `${nombre}${marca} ${suffixes[index]}`;
};

export const generateProductDescription = (product) => {
    const nombre = product.Descripcion || "producto";
    const marca = product.Marca ? ` de la marca ${product.Marca}` : "";
    const categoria = product.Categoria || "suministros";
    const id = product.IdProducto;

    const templates = [
    `Cotiza ahora ${nombre}${marca} en Disdel Guatemala. Somos expertos en abastecimiento para empresas y oficinas. Solución profesional en la categoría ${categoria} con entrega rápida.`,
    
    `Adquiere ${nombre}${marca} al mejor precio mayorista. Distribución institucional en toda Guatemala ideal para negocios y sector Horeca. Referencia Disdel #${id}.`,
    
    `¿Buscas ${nombre}${marca}? En Disdel te ofrecemos suministros de ${categoria} con garantía de calidad y precios competitivos para el sector corporativo guatemalteco.`,
    
    `Potencia tu empresa con ${nombre}${marca}. Suministro institucional confiable en Guatemala. Realizamos envíos a toda la república. ¡Solicita tu cotización de ${categoria} hoy!`
  ];

  // Elegimos un template basado en el ID para que sea consistente pero variado entre productos
  const index = (id?.length || 0) % templates.length;
  return templates[index];
};

export const getProductSeoData = (product) => {
    if(!product) return {};
    return {
        title: generateProductTitle(product),
        description: generateProductDescription(product),
        canonical: `https://disdelsa.com/producto/${product.IdProducto}/${createSlug(product.Descripcion)}`
    };
};