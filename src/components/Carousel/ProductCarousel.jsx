import React,{useMemo, useState, useEffect} from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';
import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import ProductCard from 'components/ui/ProductCard/ProductCard';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import Skeleton from 'components/ui/Skeleton/Skeleton';

const ProductCarousel = ({ title, products = [], isLoading, variant = '' , viewAllUrl}) => {
  const{data: bannerData} = useBanners();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 480 : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 480 : false);
      setIsTablet(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const images = useMemo(() => {
    const getUrl = (imgName) => imgName ? `${AppConfig.baseImageUrl}${imgName}` : '';
    const fondoImagen = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "FondoCarousel")?.Imagen;
    return {
      fondoImagen: getUrl(fondoImagen)
    };
  }, [bannerData]);

  // 🚀 SKELETON RESPONSIVO: Dibuja únicamente las tarjetas visibles según el dispositivo
  if (isLoading) {
    const skeletonCount = isMobile ? 2 : (isTablet ? 3 : 5);

    return (
      <div className="product-carousel-container">
        <div style={{ padding: isMobile ? '0 10px' : '0 20px' }}>
          <Skeleton width="220px" height="36px" style={{ borderRadius: '18px', marginBottom: '22px' }} />
        </div>
        <div className="carousel-skeleton-grid">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`pdp-sk-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: products.length > 5, 
    speed: 800,
    slidesToShow: 5, 
    slidesToScroll: 4,
    autoplay: false,       // ACTIVADO
    autoplaySpeed: 3500,  // 3.5 segundos (el punto dulce del marketing)
    pauseOnHover: true,   // Crucial para UX: detiene el scroll al interactuar
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          infinite: products.length > 3
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 2, 
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          swipeToSlide: true,
          infinite: products.length>2,
          adaptiveHeight: false
        }
      },
      
    ]
  };

  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <section 
      className={`product-carousel-container ${variant}`}
      // 🚀 PROGRAMACIÓN DEFENSIVA: Solo aplicamos el fondo si la imagen ha sido cargada con éxito de la API
      style={images.fondoImagen ? { backgroundImage: `url(${images.fondoImagen})` } : undefined}
      aria-label={title}
    >
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {viewAllUrl && (
          <Link to={viewAllUrl} className='carousel-view-all-btn'>
            Ver todo &rarr;
          </Link>
        )}
      </div>
      
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={product.IdProducto || index} className="carousel-item-padding">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductCarousel;
