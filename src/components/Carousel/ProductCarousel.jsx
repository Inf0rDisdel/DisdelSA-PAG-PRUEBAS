import React,{useMemo} from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';
import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import ProductCard from 'components/ui/ProductCard/ProductCard';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import Skeleton from 'components/ui/Skeleton/Skeleton';

const ProductCarousel = ({ title, products = [], isLoading, variant = '' }) => {

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
        <div style={{ padding: '0 20px' }}>
          {/* Título en esqueleto */}
          <Skeleton width="250px" height="30px" style={{ marginBottom: '25px' }} />
        </div>
        <div style={{ 
          display: 'grid', 
          // Ajustamos a 5 columnas para que sea igual al slider real
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '15px',
          padding: '0 20px',
          overflow: 'hidden'
        }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <ProductCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
}
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
