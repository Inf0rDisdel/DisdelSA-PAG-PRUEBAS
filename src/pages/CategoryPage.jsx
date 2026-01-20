import React, { useState, useMemo } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import useCartStore from 'store/useCartStore';
import { categoryMap } from 'data/products/productsCategories';
import './CategoryPage.css';

import bannerBanos from 'assets/images/banners/BANCategoria.jpg';
import IconInicio from 'assets/icons/icon-inicio-removebg-preview.png'

import iconAROMATIZANTES from 'assets/images/brands/AROMATIZANTESPARABAÑO.jpg'
import iconCABELLOCUERPO from 'assets/images/brands/CUIDADODECABELLOYCUERPO.jpg'
import iconDISPENSADORES from 'assets/images/brands/DISPENSADORESYACCESORIOS.jpg'
import iconBAÑO from 'assets/images/brands/HERRAMIENTASPARABAÑO.jpg'
import iconJABONMANOS from 'assets/images/brands/JABONPARAMANOS.jpg'
import iconPAPELHIGIENICO from 'assets/images/brands/PAPELHIGIENICO.jpg'
import iconPAÑUELOS from 'assets/images/brands/TOALLASYPAÑUELOS.jpg'
import iconTOALLASBAÑO from 'assets/images/brands/TOALLAPARABAÑO.jpg'
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
import iconAMBIENTES from 'assets/images/brands/CONTROLDEAMBIENTES.jpg'
import iconPLAGAS from 'assets/images/brands/CONTROLDEPLAGAS.jpg'
import iconCUIDADOPIZO from 'assets/images/brands/CUIDADODEPISOS.jpg'
import iconLAVANDERIA from 'assets/images/brands/LAVANDERIA.jpg'
import iconMULTISUPERFICIES from 'assets/images/brands/MULTISUPERFICIES.jpg'
import iconPARACARRO from 'assets/images/brands/PARACARRO.jpg'
import iconREMOVEDORES from 'assets/images/brands/REMOVEDORES.jpg'
import iconCORPORAL from 'assets/images/brands/PROTECCIONCORPORAL.jpg'
import iconCALZADO from 'assets/images/brands/PROTECCIONCALZADO.jpg'
import iconMANOS from 'assets/images/brands/PROTECCIONMANOS.jpg'
import iconFACIAL from 'assets/images/brands/PROTECCIONFACIAL.jpg'
import iconCABEZA from 'assets/images/brands/PROTECCIONPARALACABEZA.jpg'
import iconSEÑALIZACION from 'assets/images/brands/SEÑALIZACION.jpg'
import iconBEBIDAS from 'assets/images/brands/BEBIDAS.jpg'
import iconCAFE from 'assets/images/brands/CAFE.jpg'
import iconENDULZANTES from 'assets/images/brands/ENDULZANTES.jpg'
import iconDESECHABLES from 'assets/images/brands/DESECHABLES.jpg'
import iconMDISPENSADOR from 'assets/images/brands/MAQUINASDISPENSADORES.jpg'
import iconSERVILLETAS from 'assets/images/brands/SERVILLETASYMAYORDOMO.jpg'
import iconHERRAMIENTAS from 'assets/images/brands/HERRAMIENTAS.jpg'
import iconJARDIN from 'assets/images/brands/JARDIN.jpg'
import iconBATERIAS from 'assets/images/brands/BATERIAS.jpg'
import iconANALGESICOS from 'assets/images/brands/ANALGESICOS.jpg'
import iconESTOMACALES from 'assets/images/brands/ESTOMACALES.jpg'
import iconCURACION from 'assets/images/brands/CURACION.jpg'
import iconRESPIRATORIOS from 'assets/images/brands/RESPIRATORIOS.jpg'
import iconOFICINA from 'assets/images/brands/ACCESORIOSOFICINA.jpg'
import iconADHESIVOS from 'assets/images/brands/ADHESIVOS.jpg'
import iconESCRITURA from 'assets/images/brands/ESCRITURA.jpg'
import iconARCHIVO from 'assets/images/brands/ARCHIVO.jpg'
import iconPAPEL from 'assets/images/brands/PAPEL.jpg'

const categoryConfig = {
  "baños-e-higiene": { name: "Baños e Higiene", color: "#00A1DE" }, // Celeste Higiene
  "herramientas-para-limpieza": { name: "Herramientas para Limpieza", color: "#76BD1D" }, // Verde Limpieza
  "químicos-para-limpieza": { name: "Químicos para Limpieza", color: "#F26522" }, // Naranja Industrial
  "epp": { name: "EPP", color: "#FFD100" }, // Amarillo Seguridad
  "cafetería": { name: "Cafetería", color: "#6F4E37" }, // Café
  "ferretería": { name: "Ferretería", color: "#58595B" }, // Gris Acero
  "botiquín": { name: "Botiquín", color: "#b6383c" }, // Rojo Médico
  "material-de-oficina": { name: "Material de Oficina", color: "#00558C" }, // Azul Corporativo
};

const CategoryPage = () => {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [activeSubcat, setActiveSubcat] = useState(null); 

  const currentConfig = categoryConfig[slug] || { name: "Categoría", color: "#135eab" };

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
        { name: "Cepillos y Palos Multiusos", img: iconCEPILLOS },
        { name: "Desechable Bio", img: iconBIODESECHABLE },
        { name: "Discos de Piso Y Socalo", img: iconDISCOSDEPIZO},
        { name: "Escobas y Recojedores", img: iconESCOBAS },
        { name: "Esponja y Accesorios", img: iconESPONJAS},
        { name: "Jaladores y Trapeadores", img: iconTRAPEADORES },
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

  const currentCategory = categoriesData[slug] || { title: "Categoría", banner: bannerBanos, subcategories: [] };
  const allProducts = categoryMap[slug] || [];
  
  const filteredProducts = useMemo(() => {
    if (!activeSubcat) return allProducts;
    return allProducts.filter(prod => prod.subcategory === activeSubcat);
  }, [activeSubcat, allProducts]);

  return (
    // INYECTAMOS LA VARIABLE DE COLOR AQUÍ
    <div className="cat-master-wrapper" style={{ '--cat-color': currentConfig.color }}>
      <div className="cat-container">
        
        <header className="cat-main-banner">
          <img src={currentCategory.banner} alt="Banner" />
        </header>

        <div className="cat-content-layout">
          
          <aside className="cat-sidebar-left">
            <h2 className="cat-sidebar-title">Subcategorías</h2>
            
            <div className="cat-sidebar-nav">
              <div 
                className={`cat-nav-item ${!activeSubcat ? 'active-filter' : ''}`}
                onClick={() => setActiveSubcat(null)}
              >
                <div className="cat-nav-icon">
                  <img src={IconInicio} alt="Inicio" />
                </div>
                <span className="cat-nav-text">Inicio</span>
              </div>

              {currentCategory.subcategories.map((sub, index) => (
                <div 
                  key={index} 
                  className={`cat-nav-item ${activeSubcat === sub.name ? 'active-filter' : ''}`}
                  onClick={() => setActiveSubcat(sub.name)}
                >
                  <div className="cat-nav-icon">
                    <img src={sub.img} alt={sub.name} />
                  </div>
                  <span className="cat-nav-text">{sub.name}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="cat-products-column">
            <div className="cat-grid-3-cols">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <div key={prod.id} className="cat-product-card">
                    <Link to={`/producto/${prod.id}`} state={{ product: prod }} className="cat-card-link">
                      <div className="cat-card-img">
                        <img src={prod.image} alt={prod.name} />
                      </div>
                      <div className="cat-card-info">
                        <span className="cat-card-tag">{prod.tag}</span>
                        <h3 className="cat-card-name">{prod.name}</h3>
                      </div>
                    </Link>
                    <div className="cat-card-footer">
                      <button className="cat-btn-detalles" onClick={() => addItem(prod)}>
                        Cotizar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products"><p>No hay productos disponibles.</p></div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;