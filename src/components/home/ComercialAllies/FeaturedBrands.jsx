import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedBrands.css'; 

import { useBanners } from '../../../hooks/useBanners';
import { createSlug } from 'utils/slugify';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const FeaturedBrands = ({ isLoading: isLoadingProp }) => {
  const { data: banners, isLoading: isLoadingBanners, isError } = useBanners();
  const loading = isLoadingProp || isLoadingBanners;
  
  // Skeleton Loader
  if (loading) {
    return (
      <section className="featured-brands-section">
        <div className="section-title-skeleton"></div>
        <div className='brands-container-skeleton'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="brand-item-skeleton"></div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !banners?.aliados?.length) return null;

  return (
    <section className="featured-brands-section" aria-label="Nuestras Marcas Aliadas">
      <h2 className="section-title">Aliados Comerciales</h2>
      
      <div className="brands-content-wrapper">
        <div className="brands-container" aria-label="Marcas aliadas">
          {banners.aliados.map((ban) => (
            <Link
              key={ban.EntityID}
              to={`/marca/${createSlug(ban.Titulo)}`}
              className="brand-item"
              aria-label={`Ver productos de ${ban.Titulo}`}
            >
              <OptimizedImage
                src={getDisdelImageUrl(ban.Imagen)}
                alt=""
                aria-hidden="true"
                widths={[160, 240, 360]}
                targetWidth={360}
                quality={78}
                sizes="(min-width: 1025px) 321px, (min-width: 481px) 24vw, 31vw"
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
