import React,{useMemo} from 'react';
//import { Link } from 'react-router-dom'; 
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';
import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import ProductCard from 'components/ui/ProductCard/ProductCard';

const ProductCarousel = ({ title, products = [],isLoading, addToCart, variant = '' }) => {

  const{data: bannerData} = useBanners();

  const images = useMemo(() => {
    const getUrl = (imgName) => imgName? `${AppConfig.baseImageUrl}${imgName}` : '';

    const fondoImagen = bannerData?.ImagenPredeterminado?.find(i=> i.Titulo?.trim() === "FondoCarousel")?.Imagen;

    return {
      fondoImagen: getUrl(fondoImagen)
    };
  }, [bannerData]);

   if (isLoading) {
    return (
      <div className="product-carousel-container">
        <div className="skeleton-box" style={{ width: '200px', height: '30px', borderRadius: '50px', marginBottom: '20px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[1, 2].map((n) => (
            <div key={n} className="product-card" style={{ border: '1px solid #eee' }}>
              <div className="skeleton-box" style={{ width: '100%', height: '120px', borderRadius: '10px' }}></div>
              <div className="skeleton-box" style={{ width: '80%', height: '15px', marginTop: '15px' }}></div>
              <div className="skeleton-box" style={{ width: '60%', height: '12px', marginTop: '10px' }}></div>
              <div className="skeleton-box" style={{ width: '90%', height: '40px', marginTop: 'auto', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: products && products.length > 5, 
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          infinite: products && products.length > 3
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 2, 
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite:products && products.length>2,
          adaptiveHeight: false
        }
      },
      
    ]
  };

  if (!products || products.length === 0) {
    return null; 
  }

   return (
    <div className={`product-carousel-container ${variant}`}
      style={{ backgroundImage: `url(${images.fondoImagen})` }} 
    >
      <h2 className="carousel-title">{title}</h2>
      <Slider {...settings}>
        {products.map((product, index) => {
          // Validamos con IdProducto (que es el que viene de tu API)
          if (!product || (!product.IdProducto && !product.id)) return null;

          return (
            <div key={product.IdProducto || product.id} className="carousel-item-padding">
              <ProductCard product={product} index={index} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
