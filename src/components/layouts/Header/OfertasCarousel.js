import React from 'react';
import Slider from 'react-slick';
// MUY IMPORTANTE: Usa .module.css para que los estilos no afecten a otros componentes
import styles from './OfertasCarousel.module.css'; 

// Importa los estilos de la librería
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa tus imágenes
import oferta1 from 'assets/images/banners/oferta.jpg';
import oferta2 from 'assets/images/banners/oferta.jpg';
import oferta3 from 'assets/images/banners/oferta.jpg';
import oferta4 from 'assets/images/banners/oferta.jpg';
import oferta5 from 'assets/images/banners/oferta.jpg';

const ofertasData = [
  { id: 1, image: oferta1, title: 'Producto Asombroso 1', price: 'Q 99.99' },
  { id: 2, image: oferta2, title: 'Limpiador Multiusos', price: 'Q 45.50' },
  { id: 3, image: oferta3, title: 'Pack Ahorro Especial', price: 'Q 150.00' },
  { id: 4, image: oferta4, title: 'Desinfectante Pro', price: 'Q 75.00' },
  { id: 5, image: oferta5, title: 'Otro Producto Genial', price: 'Q 125.00' },
];

const OfertasCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // <-- AJUSTADO A 4 PARA APROVECHAR MEJOR EL ESPACIO
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // 3 en tablets
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // 2 en móviles
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // 1 en móviles muy pequeños
        }
      }
    ]
  };

  return (
    <div className={styles.ofertasDropdown}>
      <h4>🔥 ¡Ofertas que no te puedes perder! 🔥</h4>
      <Slider {...settings}>
        {ofertasData.map((oferta) => (
          <div key={oferta.id} className={styles.ofertaSlide}>
            <img src={oferta.image} alt={oferta.title} className={styles.ofertaImage} />
            <h5 className={styles.ofertaTitle}>{oferta.title}</h5>
            <p className={styles.ofertaPrice}>{oferta.price}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default OfertasCarousel;