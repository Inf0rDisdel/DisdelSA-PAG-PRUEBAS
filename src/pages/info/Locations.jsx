import React from 'react';
import './Locations.css'; 

import imgTienda1 from 'assets/images/banners/Disdel-Central.jpg'; 
import imgTienda2 from 'assets/images/banners/Z3-TIENDA.jpg'; 
import imgTienda3 from 'assets/images/banners/Disdel-Plsnts.jpg'; 
import iconWaze from 'assets/icons/waze.png';
import iconMaps from 'assets/icons/google-maps.png';

const Locations = () => {

  const storesData = [
    // ... tus datos siguen igual ...
    {
      id: 1,
      name: "DISDEL ZONA 1 (OFICINA)",
      address: "15 Calle 16-30, Zona 1, Ciudad de Guatemala",
      hours: "Lunes a Viernes: 7:00 AM - 5:00 PM",
      img: imgTienda1,
      lat: 14.634915, 
      lng: -90.506882,
      googleMapsLink: "https://www.google.com/maps/place/Disdel,+S.A./..."
    },
    // ... (resto de tiendas) ...
    {
      id: 2,
      name: "DISDEL ZONA 3 (TIENDA)",
      address: "27 Calle a-41, Zona 3, Ciudad de Guatemala",
      hours: "Lunes a Viernes: 7:00 AM - 5:00 PM",
      img: imgTienda2,
      lat: 14.603456, 
      lng: -90.528765,
      googleMapsLink: "https://goo.gl/maps/..." 
    },
    {
      id: 3,
      name: "DISDEL ZONA 1 (LABORATORIO)",
      address: "15 Calle 18-08, Zona 1, Ciudad de Guatemala",
      hours: "Lunes a Viernes: 7:00 AM - 5:00 PM",
      img: imgTienda3,
      lat: 14.567890, 
      lng: -90.456789,
      googleMapsLink: "https://goo.gl/maps/..."
    }
  ];

  return (
    <div className="locations-page">
      
      {/* --- CAMBIO AQUÍ: ENVOLVEMOS EL HEADER --- */}
      <div className="locations-header">
        {/* Agregamos esta clase para que respete los márgenes iguales a las tarjetas */}
        <div className="main-layout-container">
            <h1>Nuestras Ubicaciones</h1>
            <p>Visítanos en tu sucursal más cercana. ¡Te esperamos!</p>
        </div>
      </div>

      <div className="main-layout-container">
        {/* GRILLA DE TARJETAS */}
        <div className="locations-grid">
          {storesData.map((store) => (
            <div key={store.id} className="location-card">
              <div className="card-image-wrapper">
                <img src={store.img} alt={store.name} />
              </div>
              <div className="card-content">
                <h3>{store.name}</h3>
                <p className="address-text">{store.address}</p>
                <p className="hours-text">
                  {store.hours.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </p>
              </div>
              <div className="card-actions">
                <a 
                  href={`https://waze.com/ul?ll=${store.lat},${store.lng}&navigate=yes`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-app btn-waze"
                >
                <img src={iconWaze} alt='Waze' className='icon-waze' /> 
                  Ir con Waze
                </a>

                <a 
                  href={store.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-app btn-maps"
                >
                  <img src={iconMaps} alt='Maaps' className='icon-maps' /> 
                   Ir o ver con Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;