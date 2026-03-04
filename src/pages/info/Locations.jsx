import React from 'react';
import {FiClock, FiMapPin, FiNavigation, FiCheckCircle, FiPhone} from 'react-icons/fi';
import './Locations.css'; 

import imgOficina from 'assets/images/BannersUbicaciones/Disdel-Central.webp'; 
import imgTienda from 'assets/images/BannersUbicaciones/Z3-TIENDA.webp'; 
import imgLaboratorio from 'assets/images/BannersUbicaciones/Disdel-Plsnts.webp'; 
import imgTienda3 from 'assets/images/BannersUbicaciones/VistaTienda.webp'
import iconWaze from 'assets/icons/IconoUbicacion/waze.webp';
import iconMaps from 'assets/icons/IconoUbicacion/google-maps.webp';

const Locations = () => {
  const storesData = [
    {
      id: 1,
      badge: "Oficinas Administrativas",
      name: "Disdel Zona 1 (Oficina)",
      desc: "Nuestras oficinas centrales donde gestionamos la atención corporativa y administrativa para brindarte el mejor servicio.",
      address: "15 Calle 16-30, Zona 1",
      city: "Ciudad de Guatemala",
      phone:"2422-6120",
      hours: "7:00 AM - 5:00 PM",
      imgMain: imgOficina,
      imgSec: imgOficina,
      lat: 14.634915, 
      lng: -90.506882,
      maps: "https://www.google.com/maps/place/Disdel,+S.A./@14.634915,-90.506882,15z",
      features: ["Atención Mayorista", "Carga Segura"]
    },
    {
      id: 2,
      badge: "Tienda Central",
      name: "Disdel Zona 3 (Tienda)",
      desc: "Contamos con amplio stock y asesores expertos listos para atenderte. Puedes cotizar en línea y retirar tu pedido inmediatamente.",
      address: "27 Calle 1-41, Zona 3",
      city: "Ciudad de Guatemala",
      phone:"2247-1620",
      hours: "7:00 AM - 5:00 PM",
      imgMain: imgTienda3,
      imgSec: imgTienda,
      lat: 14.6243644,
      lng: -90.5255417,
      maps: "https://www.google.com/maps/place/Disdel,+S.+A./@14.6243644,-90.5255417,15z",
      features: ["Parqueo Disponible", "Retiro Inmediato"]
    },
    {
      id: 3,
      badge: "Producción y Calidad",
      name: "Disdel Zona 1 (Laboratorio)",
      desc: "Centro especializado en desarrollo y control de calidad de nuestros productos de limpieza profesional.",
      address: "15 Calle 18-08, Zona 1",
      city: "Ciudad de Guatemala",
      phone:"2422-6120",
      hours: "7:00 AM - 5:00 PM",
      imgMain: imgLaboratorio,
      imgSec: imgLaboratorio,
      lat: 14.6317623, 
      lng: -90.5021374,
      maps: "https://www.google.com/maps/place/L%26G+Representaciones+S.A./@14.6317623,-90.5021374,17z",
      features: ["Control de Calidad", "Despacho Logístico"]
    }
  ];

 return (
    <div className="loc-page-wrapper">
      {/* Eliminamos el Header vacío para ganar espacio inmediato */}
      
      {storesData.map((store, index) => (
        <section key={store.id} className={`loc-showcase-section ${index % 2 !== 0 ? 'loc-reverse' : ''}`}>
          <div className="loc-container">
            
            <div className="loc-images-col">
              <div className="loc-image-wrapper loc-main-img">
                <img src={store.imgMain} alt={store.name} />
              </div>
              <div className="loc-image-wrapper loc-secondary-img">
                <img src={store.imgSec} alt="Detalle" />
              </div>
              {store.id === 2 && (
                <div className="loc-floating-badge">
                  <span className="loc-years-number">50+</span>
                  <span className="loc-years-text">Años de Experiencia</span>
                </div>
              )}
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
                  <img src={iconWaze} alt="Waze" className="btn-icon-img" />
                  Ir con Waze
                </a>
                
                <a 
                  href={store.maps} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-loc-action btn-maps-grey"
                >
                  <img src={iconMaps} alt="Maps" className="btn-icon-img-small" />
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