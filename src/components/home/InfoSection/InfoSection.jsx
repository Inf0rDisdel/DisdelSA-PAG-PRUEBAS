import React, {useMemo } from 'react';
import './InfoSection.css';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';

const InfoSection = () => {
    const { data: bannerData } = useBanners();

    const getUrl = (dbTitle) => {
        const found = bannerData?.Iconos?.find(i => i.Titulo?.trim() === dbTitle);

        return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
    };

    const infoItems = useMemo(() => [
        { 
            icon: getUrl("IconoAtencion"), 
            title: "Asesoría personalizada", 
            text: "Visitamos tu empresa y te ofrecemos la mejor solución. ¡Cotiza con nosotros!" 
        },
        { 
            icon: getUrl("IconoOpciones"), 
            title: "Opciones de pago", 
            text: "Efectivo, transferencia o crédito para empresas hasta 30 días" 
        },
        { 
            icon: getUrl("IconoRecojeTienda"), 
            title: "Entregas a toda Guatemala", 
            text: "Nuestros vehículos aseguran entregas rápidas y eficientes" 
        },
        { 
            icon: getUrl("Prueba"), 
            title: "Prueba el producto", 
            text: "Prueba Scott y Kleenex en tu empresa y comprueba su eficacia." 
        },
        { 
            icon: getUrl("IconoBeneficios"), 
            title: "Recoge en tienda", 
            text: "Confirma tu pedido y pasa a tienda. 27 calle 1-41, Zona 3 Ciudad de Guatemala" 
        }
    ], [bannerData]);

    return (
        <div className='info-section-container'>
            {infoItems.map((item, index) => (
                <div key={index} className='info-item'>
                    <div className="icon-wrapper">
                        {/* Solo renderizamos la imagen si la URL no está vacía */}
                        {item.icon ? (
                            <img src={item.icon} alt={item.title} loading="lazy" />
                        ) : (
                            <div className="icon-placeholder" /> // Espacio vacío o spinner mientras carga
                        )}
                    </div>
                    <div className="info-content">
                        <h3 className="info-title">{item.title}</h3>
                        <p className="info-text">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default InfoSection;