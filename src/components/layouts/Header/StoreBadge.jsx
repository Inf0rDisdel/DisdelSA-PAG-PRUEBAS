import React from 'react';
import { FiClock, FiMapPin, FiNavigation, FiCheckCircle } from 'react-icons/fi';
import './StoreBadge.css';

 import StoreImg1 from 'assets/images/banners/tienda-Z3.jpg'; 
 import StoreImg2 from 'assets/images/banners/Z3-TIENDA.jpg';

const StoreShowcase = () => {
  const mapUrl = "https://www.google.com/maps/place/Disdel,+S.+A./@14.6282923,-90.535314,15z/data=!4m10!1m2!2m1!1stienda+disdel!3m6!1s0x8589a2410996aaab:0x888aca1dddc38f6f!8m2!3d14.6243644!4d-90.5255417!15sCg10aWVuZGEgZGlzZGVskgEaY2xlYW5pbmdfcHJvZHVjdHNfc3VwcGxpZXLgAQA!16s%2Fg%2F11f_428swk?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D";

  return (
    <section className="ssc-section">
      <div className="ssc-container">
        
        {/* COLUMNA DE INFORMACIÓN */}
        <div className="ssc-info-col"> {/* Nota: Agregué esta clase implícita en CSS */}
          <div className="ssc-badge-tag">Tienda Central</div>
          
          <h2 className="ssc-title">
            Visita nuestra tienda <span className="ssc-highlight-text">Disdel Zona 3</span>
          </h2>
          
          <p className="ssc-desc">
            Contamos con amplio stock y asesores expertos listos para atenderte. 
            Puedes cotizar en línea y retirar tu pedido inmediatamente en nuestras instalaciones.
          </p>

          <div className="ssc-details-grid">
            {/* Horario */}
            <div className="ssc-detail-card">
              <div className="ssc-icon-box"><FiClock /></div>
              <div>
                <h4>Horario de Atención</h4>
                <p>Lunes a Viernes</p>
                <p className="ssc-time-highlight">7:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Dirección Rápida */}
            <div className="ssc-detail-card">
              <div className="ssc-icon-box"><FiMapPin /></div>
              <div>
                <h4>Ubicación</h4>
                <p>27 Calle 1-41, Zona 3</p>
                <p>Ciudad de Guatemala</p>
              </div>
            </div>
          </div>

          <div className="ssc-actions">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="ssc-btn-maps">
              <FiNavigation size={20} />
              Ver ubicación en Google Maps
            </a>
            
            <div className="ssc-features-list">
              <span><FiCheckCircle color="#28a745"/> Parqueo Disponible</span>
              <span><FiCheckCircle color="#28a745"/> Carga Segura</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DE IMÁGENES */}
        <div className="ssc-images-col">
          <div className="ssc-image-wrapper ssc-main-img">
            <img src={StoreImg1} alt="Fachada Tienda Disdel" />
          </div>
          <div className="ssc-image-wrapper ssc-secondary-img">
            <img src={StoreImg2} alt="Interior y Atención al Cliente" />
          </div>
          <div className="ssc-floating-badge">
            <span className="ssc-years-number">50+</span>
            <span className="ssc-years-text">Años de<br/>Experiencia</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StoreShowcase;




