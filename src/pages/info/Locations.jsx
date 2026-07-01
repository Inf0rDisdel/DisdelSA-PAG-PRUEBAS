import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiClock, FiMapPin, FiCheckCircle, FiPhone } from 'react-icons/fi';
import './Locations.css'; 

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';

const Locations = () => {
  const { data: bannerData, isLoading } = useBanners();

  const images = useMemo(() => {
    const buildUrl = (fileName) => fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';

    // --- 1. UBICACIONES (ID 29) -> Buscamos en la columna .Imagen ---
    const oficinaObj = bannerData?.Ubicaciones?.[0];
    const tienda1Obj = bannerData?.Ubicaciones?.find(i => i.Titulo?.trim() === "VistaDentroTienda");
    const tienda2Obj = bannerData?.Ubicaciones?.find(i => i.Titulo?.trim() === "VistaFueraZ3");
    const labObj     = bannerData?.Ubicaciones?.find(i => i.Titulo?.trim() === "laboratorio");

    // --- 2. ICONOS (ID 32) -> Buscamos en la columna .BannerImagenMovil ---
    const wazeObj    = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconoWaze");
    const mapsObj    = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconoMaps");

    return {
      oficina: buildUrl(oficinaObj?.Imagen),
      tienda1: buildUrl(tienda1Obj?.Imagen),
      tienda2: buildUrl(tienda2Obj?.Imagen),
      laboratorio: buildUrl(labObj?.Imagen),
      // Usamos BannerImagenMovil para los iconos como pediste
      waze: buildUrl(wazeObj?.BannerImagenMovil || wazeObj?.Imagen),
      maps: buildUrl(mapsObj?.BannerImagenMovil || mapsObj?.Imagen),
    };
  }, [bannerData]);

  const storesData = useMemo(() => [
    {
      id: 1,
      badge: "Oficinas Administrativas",
      name: "Disdel Zona 1 (Oficina)",
      desc: "Nuestras oficinas centrales donde gestionamos la atención corporativa y administrativa para brindarte el mejor servicio.",
      address: "15 Calle 16-30, Zona 1",
      city: "Ciudad de Guatemala",
      phone: "2422-6120",
      hours: "7:00 AM - 5:00 PM",
      imgMain: images.oficina,
      imgSec: images.oficina,
      lat: 14.6319306, 
      lng: -90.5036954,
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Disdel+SA+Zona+1",
      features: ["Atención Mayorista", "Carga Segura"]
    },
    {
      id: 2,
      badge: "Tienda Central",
      name: "Disdel Zona 3 (Tienda)",
      desc: "Contamos con amplio stock y asesores expertos listos para atenderte. Puedes cotizar en línea y retirar tu pedido inmediatamente.",
      address: "27 Calle 1-41, Zona 3",
      city: "Ciudad de Guatemala",
      phone: "2247-1620",
      hours: "7:00 AM - 5:00 PM",
      imgMain: images.tienda1,
      imgSec: images.tienda2,
      lat: 14.6243644,
      lng: -90.5255417,
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Disdel+SA+Zona+3",
      features: ["Parqueo Disponible", "Retiro Inmediato"]
    },
    {
      id: 3,
      badge: "Producción y Calidad",
      name: "Disdel Zona 1 (Laboratorio)",
      desc: "Centro especializado en desarrollo y control de calidad de nuestros productos de limpieza profesional.",
      address: "15 Calle 18-08, Zona 1",
      city: "Ciudad de Guatemala",
      phone: "2422-6120",
      hours: "7:00 AM - 5:00 PM",
      imgMain: images.laboratorio,
      imgSec: images.laboratorio,
      lat: 14.6317623, 
      lng: -90.5021374,
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=L%26G+Representaciones+SA",
      features: ["Control de Calidad", "Despacho Logístico"]
    }
  ], [images]);

  if (isLoading) return null;

  return (
    <div className="loc-page-wrapper">
      
      <Helmet>
        <title>Nuestras Ubicaciones y Teléfonos | Disdel Guatemala</title>
        <meta name="description" content="Encuentra los números de teléfono, direcciones y horarios de atención de nuestras oficinas de Zona 1, sala de ventas de Zona 3 y laboratorio en Ciudad de Guatemala." />
        <link rel="canonical" href="https://disdelsa.com/ubicaciones" />
      </Helmet>

      {storesData.map((store, index) => (
        <section key={store.id} className={`loc-showcase-section ${index % 2 !== 0 ? 'loc-reverse' : ''}`}>
          <div className="loc-container">
            
            <div className="loc-images-col">
              <div className="loc-image-wrapper loc-main-img">
                <img src={store.imgMain} alt={store.name} />
              </div>
              <div className="loc-image-wrapper loc-secondary-img">
                <img src={store.imgSec} alt="Detalle Ubicación" />
              </div>
            </div>

            <div className="loc-info-col">
              <div className="loc-badge-tag">{store.badge}</div>
              <h2 className="loc-title">
                Visita nuestra {store.id === 1 ? 'oficina' : store.id === 3 ? 'planta' : 'tienda'} <br/>
                <span className="loc-highlight-text">{store.name}</span>
              </h2>
              <p className="loc-desc">{store.desc}</p>

              <div className="loc-details-grid">
                <div className="loc-detail-card">
                  <div className="loc-icon-box"><FiClock /></div>
                  <div>
                    <h4>Horario</h4>
                    <p className="loc-time-highlight">{store.hours}</p>
                  </div>
                </div>

                <div className="loc-detail-card">
                  <div className="loc-icon-box"><FiPhone /></div>
                  <div>
                    <h4>Teléfono</h4>
                    <p className="loc-time-highlight">{store.phone}</p>
                  </div>
                </div>

                <div className="loc-detail-card loc-full-width-detail">
                  <div className="loc-icon-box"><FiMapPin /></div>
                  <div>
                    <h4>Ubicación</h4>
                    <p>{store.address}, {store.city}</p>
                  </div>
                </div>
              </div>

              <div className="loc-actions-group">
                <a 
                  href={`https://waze.com/ul?ll=${store.lat},${store.lng}&navigate=yes`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-loc-action btn-waze"
                >
                  {/* Si existe la URL de Waze, mostramos la imagen */}
                  {images.waze && <img src={images.waze} alt="Waze" className="btn-icon-img" />}
                  Ir con Waze
                </a>
                
                <a 
                  href={store.mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-loc-action btn-maps-grey"
                >
                  {/* Si existe la URL de Maps, mostramos la imagen */}
                  {images.maps && <img src={images.maps} alt="Maps" className="btn-icon-img-small" />}
                  Ir o ver con Google Maps
                </a>

                <div className="loc-features-mini">
                  {store.features.map((feat, i) => (
                    <span key={i}><FiCheckCircle color="#28a745"/> {feat}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Locations;