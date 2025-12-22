import React from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import bannerBanos from 'assets/images/banners/BANCategoria.jpg';
/*BAÑOS E HIGIENE*/
import iconAROMATIZANTES from 'assets/images/brands/AROMATIZANTESPARABAÑO.jpg'
import iconCABELLOCUERPO from 'assets/images/brands/CUIDADODECABELLOYCUERPO.jpg'
import iconDISPENSADORES from 'assets/images/brands/DISPENSADORESYACCESORIOS.jpg'
import iconBAÑO from 'assets/images/brands/HERRAMIENTASPARABAÑO.jpg'
import iconJABONMANOS from 'assets/images/brands/JABONPARAMANOS.jpg'
import iconPAPELHIGIENICO from 'assets/images/brands/PAPELHIGIENICO.jpg'
import iconPAÑUELOS from 'assets/images/brands/TOALLASYPAÑUELOS.jpg'
import iconTOALLASBAÑO from 'assets/images/brands/TOALLAPARABAÑO.jpg'
/*HERRAMIENTAS PARA LIMPIEZA*/
import iconALFOMBRAS from 'assets/images/brands/ALFOMBRAS.jpg'
import iconBASURA from 'assets/images/brands/BASURAYRECICLAJE.jpg'
import iconCEPILLOS from 'assets/images/brands/CEPILLOSYPALOSMULTIUSOS.jpg'
import iconBIODESECHABLE from 'assets/images/brands/DESECHABLEBIO.jpg'
import iconDISCOSDEPIZO from 'assets/images/brands/DISCOSDEPIZO.jpg'
import iconESCOBAS from 'assets/images/brands/ESCOBAS.jpg'
import iconESPONJAS from 'assets/images/brands/ESPONJAYACCESORIO.jpg'
import iconTRAPEADORES from 'assets/images/brands/TRAPEADORES.jpg'
import iconMULTILIMPIADOR from 'assets/images/brands/LIMPIADORESMULTIUSOS.jpg'
import iconMOPA from 'assets/images/brands/MOPAYMECHA.jpg'
import iconRECIPIENTES from 'assets/images/brands/RECIPIENTES.jpg'
/*QUIMICOS PARA LIMPIEZA*/
import iconAMBIENTES from 'assets/images/brands/CONTROLDEAMBIENTES.jpg'
import iconPLAGAS from 'assets/images/brands/CONTROLDEPLAGAS.jpg'
import iconCUIDADOPIZO from 'assets/images/brands/CUIDADODEPISOS.jpg'
import iconLAVANDERIA from 'assets/images/brands/LAVANDERIA.jpg'
import iconMULTISUPERFICIES from 'assets/images/brands/MULTISUPERFICIES.jpg'
import iconPARACARRO from 'assets/images/brands/PARACARRO.jpg'
import iconREMOVEDORES from 'assets/images/brands/REMOVEDORES.jpg'
/*EPP*/
import iconCORPORAL from 'assets/images/brands/PROTECCIONCORPORAL.jpg'
import iconCALZADO from 'assets/images/brands/PROTECCIONCALZADO.jpg'
import iconMANOS from 'assets/images/brands/PROTECCIONMANOS.jpg'
import iconFACIAL from 'assets/images/brands/PROTECCIONFACIAL.jpg'
import iconCABEZA from 'assets/images/brands/PROTECCIONPARALACABEZA.jpg'
import iconSEÑALIZACION from 'assets/images/brands/SEÑALIZACION.jpg'
/*CAFETERIA*/
import iconBEBIDAS from 'assets/images/brands/BEBIDAS.jpg'
import iconCAFE from 'assets/images/brands/CAFE.jpg'
import iconENDULZANTES from 'assets/images/brands/ENDULZANTES.jpg'
import iconDESECHABLES from 'assets/images/brands/DESECHABLES.jpg'
import iconMDISPENSADOR from 'assets/images/brands/MAQUINASDISPENSADORES.jpg'
import iconSERVILLETAS from 'assets/images/brands/SERVILLETASYMAYORDOMO.jpg'
/*FERRETERIA*/
import iconHERRAMIENTAS from 'assets/images/brands/HERRAMIENTAS.jpg'
import iconJARDIN from 'assets/images/brands/JARDIN.jpg'
import iconBATERIAS from 'assets/images/brands/BATERIAS.jpg'
/*BOTIQUIN*/
import iconANALGESICOS from 'assets/images/brands/ANALGESICOS.jpg'
import iconESTOMACALES from 'assets/images/brands/ESTOMACALES.jpg'
import iconCURACION from 'assets/images/brands/CURACION.jpg'
import iconRESPIRATORIOS from 'assets/images/brands/RESPIRATORIOS.jpg'
/*MATERIAL DE OFICINA*/
import iconOFICINA from 'assets/images/brands/ACCESORIOSOFICINA.jpg'
import iconADHESIVOS from 'assets/images/brands/ADHESIVOS.jpg'
import iconESCRITURA from 'assets/images/brands/ESCRITURA.jpg'
import iconARCHIVO from 'assets/images/brands/ARCHIVO.jpg'
import iconPAPEL from 'assets/images/brands/PAPEL.jpg'
const CategoryPage = () => {
const { slug } = useParams();

const categoriesData = {
"baños-e-higiene": {
title: "Baños e Higiene",
banner: bannerBanos,
subcategories: [
{ name: "Aromatizantes Para Baño", img: iconAROMATIZANTES },
{ name: "Cuidaddo de Cabello y Cuerpo", img: iconCABELLOCUERPO},
{ name: "Dispensadores y Accesorios", img: iconDISPENSADORES },
{ name: "Herramientas Para Baño", img: iconBAÑO},
{ name: "Jabón y Alcohol Para Manos", img: iconJABONMANOS },
{ name: "Papel Higienico", img: iconPAPELHIGIENICO },
{ name: "Toalla de Papel y Pañuelos", img: iconPAÑUELOS },
{ name: "Toalla Para Baño", img: iconTOALLASBAÑO },
]
},

"herramientas-para-limpieza": {
  title: "Herramientas para Limpieza",
  banner: bannerBanos, 
  subcategories: [
    { name: "Alfombras", img: iconALFOMBRAS },
    { name: "Basura y Reciclaje", img: iconBASURA },
    { name: "Cepillos y PalOS Multiusos", img: iconCEPILLOS },
    { name: "Desechable Bio", img: iconBIODESECHABLE },
    { name: "Discos de Piso Y Socalo", img: iconDISCOSDEPIZO},
    { name: "Escobas y Recojedores", img: iconESCOBAS },
    { name: "Esponja y Accesorios", img: iconESPONJAS},
    { name: "Jaladoers y Trapeadores", img: iconTRAPEADORES },
    { name: "Limpiadores Multisupercies", img: iconMULTILIMPIADOR },
    { name: "Mopa y Mecha", img: iconMOPA },
    { name: "Organizadores y Recipientes", img: iconRECIPIENTES},
  ]
},

"químicos-para-limpieza": {
  title: "Químicos para Limpieza",
  banner: bannerBanos, 
  subcategories: [
    { name: "Control de Ambiente", img: iconAMBIENTES },
    { name: "Control de Plagas", img: iconPLAGAS },
    { name: "Cuidado de Pisos y Superficies", img: iconCUIDADOPIZO },
    { name: "Lavanderia", img: iconLAVANDERIA },
    { name: "MultiSuperficies", img: iconMULTISUPERFICIES },
    { name: "Para Carro", img: iconPARACARRO },
    { name: "Removedores y Solventes", img: iconREMOVEDORES },
  ]
},

"epp": {
  title: "Equipo de Protección Personal",
  banner: bannerBanos,
  subcategories: [
    { name: "Protección Corporal", img: iconCORPORAL },
    { name: "Protección de Calzado", img: iconCALZADO },
    { name: "Protección Facial", img: iconFACIAL },
    { name: "Protección Facial y Auditivo", img: iconMANOS},
    { name: "Protección Para la Cabeza", img: iconCABEZA },
    { name: "Señalización Vial", img: iconSEÑALIZACION },
  ]
},

"cafetería": { 
  title: "Cafetería para tu alacena",
  banner: bannerBanos,
  subcategories: [
    { name: "Bebidas", img: iconBEBIDAS },
    { name: "Café y Complementos", img: iconCAFE },
    { name: "Condimentos Endulzantes", img: iconENDULZANTES },
    { name: "Desechables Biodegradables", img: iconDESECHABLES},
    { name: "Maquinas y Dispensadores", img: iconMDISPENSADOR },
    { name: "Servilletas y Mayordomo", img: iconSERVILLETAS},
  ]
},

"ferretería": { 
  title: "Ferretería",
  banner: bannerBanos,
  subcategories: [
    { name: "Accesorios y Herramientas", img: iconHERRAMIENTAS },
    { name: "Jardín", img: iconJARDIN },
    { name: "Pilas y Baterías", img: iconBATERIAS },
  ]
},

"botiquín": { 
  title: "Botiquín y Primeros Auxilios",
  banner: bannerBanos,
  subcategories: [
    { name: "Analgesicos", img: iconANALGESICOS },
    { name: "Estomacales", img: iconESTOMACALES },
    { name: "Primeros Auxilios", img: iconCURACION },
    { name: "Respiratorios", img: iconRESPIRATORIOS },
  ]
},

"material-de-oficina": { 
  title: "Material de Oficina",
  banner: bannerBanos,
  subcategories: [
    { name: "Accesorios Escolares y Oficina", img: iconOFICINA },
    { name: "Adhesivos y y Pegamentos", img: iconADHESIVOS},
    { name: "Accesorios de Escritura", img: iconESCRITURA },
    { name: "Organizació de Archivo", img: iconARCHIVO},
    { name: "Hojas Para Usos Multiples", img: iconPAPEL },
  ]
},
};

const currentCategory = categoriesData[slug] || {
title: "Categoría",
banner: null,
subcategories: []
};
const products = [
{ id: 1, name: "Producto Demo 1", img: "https://disdelsa.com/imagenes/productos/1890.5-imgS-14-4-2023-121019-.jpg?w=380&h=380" },
{ id: 2, name: "Producto Demo 2", img: "https://disdelsa.com/imagenes/productos/35157.jpg?w=380&h=380" },
{ id: 3, name: "Producto Demo 3", img: "https://disdelsa.com/imagenes/productos/6070-imgS-13-9-2023-151724-.jpg?w=380&h=380" },
{ id: 4, name: "Producto Demo 4", img: "https://disdelsa.com/imagenes/productos/6104-imgS-11-4-2024-113739-.jpg?w=380&h=380" },
];
return (
<div className="cat-page-container">

  <div className="cat-banner">
    {currentCategory.banner ? (
      <img src={currentCategory.banner} alt="Banner Categoría" />
    ) : (
      <div style={{height: '250px', background: '#eee'}}><h2>Banner</h2></div>
    )}
  </div>

  <div className="cat-content">
    
    {/* --- NUEVA ESTRUCTURA: TÍTULO IZQUIERDA | CARRUSEL DERECHA --- */}
    <div className="cat-header-split">
      
      {/* LADO IZQUIERDO: TÍTULO */}
      <div className="cat-title-section">
        <h1 className="cat-main-title">{currentCategory.title}</h1>
      </div>

      {/* LADO DERECHO: CARRUSEL */}
      <div className="cat-carousel-section">
        <p className="sub-title-label">Los usuarios también buscaron</p>
        
        {currentCategory.subcategories.length > 0 ? (
          <div className="subcategory-scroll">
            {currentCategory.subcategories.map((sub, index) => (
              <div key={index} className="subcat-card-chip">
                <div className="subcat-img-wrapper">
                  <img src={sub.img} alt={sub.name} />
                </div>
                <span className="subcat-name">{sub.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay subcategorías.</p>
        )}
      </div>

    </div>

    {/* 3. GRILLA DE PRODUCTOS */}
    <div className="products-grid-section">
      <div className="products-grid">
        {products.map((prod) => (
          <div key={prod.id} className="simple-product-card">
            <div className="card-img-top">
               <img src={prod.img} alt={prod.name} />
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>
);
};
export default CategoryPage;