import React from 'react';
import './InfoSection.css';

import Banner1Icon from 'assets/icons/IconoInformacion/ATENCION-PERSONALIZADA.webp';
import Banner2Icon from 'assets/icons/IconoInformacion/OPCIONES-DE-PAGO.webp';
import Banner3Icon from 'assets/icons/IconoInformacion/RECOGER-EN-TIENDA.webp'; 
import Banner4Icon from 'assets/icons/IconoInformacion/PRUEBA-DE-PRODUCTO.webp';
import Banner5Icon from 'assets/icons/IconoInformacion/RECOGER-EN-TIENDA-NBENEFICIOS.webp';

const InfoSection = () => {
    const infoItems = [
        { icon: Banner1Icon, title: "Asesoría personalizada", text: "Visitamos tu empresa y te ofrecemos la mejor solución. ¡Cotiza con nosotros!" },
        { icon: Banner2Icon, title: "Opciones de pago", text: "Efectivo, transferencia o crédito para empresas hasta 30 días" },
        { icon: Banner3Icon, title: "Entregas a toda Guatemala", text: "Nuestros vehículos aseguran entregas rápidas y eficientes" },
        { icon: Banner4Icon, title: "Prueba el producto", text: "Prueba Scott y Kleenex en tu empresa y comprueba su eficacia." },
        { icon: Banner5Icon, title: "Recoge en tienda", text: "Confirma tu pedido y pasa a tienda. 27 calle 1-41, Zona 3 Ciudad de Guatemala" }
    ];

    return (
        <div className='info-section-container'>
            {infoItems.map((item, index) => (
                <div key={index} className='info-item'>
                    <div className="icon-wrapper">
                        <img src={item.icon} alt={item.title} />
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