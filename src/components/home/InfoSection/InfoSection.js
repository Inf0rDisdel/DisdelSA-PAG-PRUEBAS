import React from 'react';
import './InfoSection.css';

// Importa tus iconos
import Banner1Icon from 'assets/icons/ATENCION-PERSONALIZADA.png';
import Banner2Icon from 'assets/icons/OPCIONES-DE-PAGO.png';
import Banner3Icon from 'assets/icons/RECOGER-EN-TIENDA.png'; // Asegúrate que este sea el del camión si es el orden correcto
import Banner4Icon from 'assets/icons/PRUEBA-DE-PRODUCTO.png';
import Banner5Icon from 'assets/icons/RECOGER-EN-TIENDA-NBENEFICIOS.png';

const InfoSection = () => {

    // Aquí ponemos toda la info: Icono, Título y Descripción
    const infoItems = [
        {
            icon: Banner1Icon,
            title: "Asesoría personalizada",
            text: "Visitamos tu empresa y te ofrecemos la mejor solución. ¡Cotiza con nosotros!"
        },
        {
            icon: Banner2Icon,
            title: "Opciones de pago",
            text: "Efectivo, transferencia o crédito para empresas hasta 30 días"
        },
        {
            icon: Banner3Icon, // Asegúrate de poner aquí el icono del camión
            title: "Entregas a toda Guatemala",
            text: "Nuestros vehículos aseguran entregas rápidas y eficientes"
        },
        {
            icon: Banner4Icon,
            title: "Prueba el producto",
            text: "Prueba Scott y Kleenex en tu empresa y comprueba su eficacia. ¡Comunícate con un asesor!"
        },
        {
            icon: Banner5Icon,
            title: "Recoge en tienda",
            text: "Confirma tu pedido y pasa a tienda. 27 calle 1-41, Zona 3 Ciudad de Guatemala"
        }
    ];

    return (
        <div className='info-section-container'>
            {infoItems.map((item, index) => (
                <div key={index} className='info-item'>
                    <div className="icon-wrapper">
                        <img src={item.icon} alt={item.title} />
                    </div>
                    <h3 className="info-title">{item.title}</h3>
                    <p className="info-text">{item.text}</p>
                </div>
            ))}
        </div>
    );
}

export default InfoSection;