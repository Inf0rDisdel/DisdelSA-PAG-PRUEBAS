export const normalizeCompanyInfo = (company) => {
  if (!company) return {};

  return {
    entityID:
      company.EntityID ??
      company["<EntityID>k__BackingField"],

    idCompania:
      company.IdCompania ??
      company["<IdCompania>k__BackingField"],

    nombreEmpresa:
      company.NombreEmpresa ??
      company["<NombreEmpresa>k__BackingField"],

    nombreAlternativo:
      company.NombreAlternativo ??
      company["<NombreAlternativo>k__BackingField"],

    descripcionLarga:
      company.DescripcionLarga ??
      company["<DescripcionLarga>k__BackingField"],

    descripcionCorta:
      company.DescripcionCorta ??
      company["<DescripcionCorta>k__BackingField"],

    metaTitle:
      company.MetaTitle ??
      company["<MetaTitle>k__BackingField"],

    metaDescription:
      company.MetaDescription ??
      company["<MetaDescription>k__BackingField"],

    metaKeyword:
      company.MetaKeyword ??
      company["<MetaKeyword>k__BackingField"],

    metaTags:
      company.MetaTags ??
      company["<MetaTags>k__BackingField"],

    telefono:
      company.Telefono ??
      company["<Telefono>k__BackingField"],

    correo:
      company.Correo ??
      company["<Correo>k__BackingField"],

    pais:
      company.Pais ??
      company["<Pais>k__BackingField"],

    ciudad:
      company.Ciudad ??
      company["<Ciudad>k__BackingField"],

    direccion:
      company.Direccion ??
      company["<Direccion>k__BackingField"],

    url:
      company.URL ??
      company["<URL>k__BackingField"],

    categoriaNegocio:
      company.CategoriaNegocio ??
      company["<CategoriaNegocio>k__BackingField"],
  };
};