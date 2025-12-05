import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './HeroSlider.css';

import bannerCotiza from 'assets/images/banners/COTIZA.jpg';
import bannerCredito from 'assets/images/banners/CREDITO.jpg';
import bannerEntregaGT from 'assets/images/banners/ENTREGAGT.jpg';

import bannerWiese from 'assets/images/banners/BANNERWIESEAEROSOL.jpg'; 
import bannerNescafe from 'assets/images/banners/BANNERNESCAFE.jpg'; 

const slideData = [
  { image: bannerCotiza, title: 'Cotiza' },
  { image: bannerCredito, title: 'Credito' },
  { image: bannerEntregaGT, title: 'Entrega' }
];

const HeroSlider = () => {
  return (

    <div className="main-container">

      <div className="banners-container">
        <div className="banner-item">
          <img src={bannerWiese} alt="Wiese y Glade" />
        </div>
        <div className="banner-item">
          <img src={bannerNescafe} alt="Nescafé y Coffee-Mate" />
        </div>
      </div>

      <div className="slider-container">
        <div className="carousel-wrapper">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
          >
            {slideData.map((slide, index) => (
              <div key={index}>
                <img src={slide.image} alt={slide.title} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

    </div>
  );
};

export default HeroSlider;