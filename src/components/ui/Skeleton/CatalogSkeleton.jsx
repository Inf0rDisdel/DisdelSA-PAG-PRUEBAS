import React from 'react';
import Skeleton from 'components/ui/Skeleton/Skeleton';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import './CatalogSkeleton.css';

const categoryPlaceholders = [1, 2, 3, 4, 5, 6];
const brandPlaceholders = [1, 2, 3, 4, 5, 6];

const ToolbarSkeleton = () => (
  <div className="catalog-toolbar catalog-skeleton-toolbar">
    <Skeleton width="145px" height="14px" />
    <div className="catalog-skeleton-sort">
      <Skeleton width="78px" height="13px" />
      <Skeleton width="170px" height="32px" style={{ borderRadius: '8px' }} />
    </div>
  </div>
);

const CategoryCatalogSkeleton = () => (
  <div className="cat-master-wrapper catalog-skeleton-page catalog-skeleton-page--category" aria-hidden="true">
    <div className="cat-container">
      <div className="breadcumb-container catalog-skeleton-breadcrumb">
        <Skeleton width="42%" height="13px" />
      </div>

      <div className="cat-header-section catalog-skeleton-banner">
        <Skeleton width="100%" height="100%" />
      </div>

      <div className="cat-content-layout catalog-skeleton-layout">
        <aside className="cat-sidebar-left catalog-skeleton-sidebar">
          <div className="cat-sidebar-header-mobile">
            <div className="cat-sidebar-label">
              <Skeleton width="78px" height="10px" />
            </div>
          </div>

          <div className="cat-sidebar-nav">
            {categoryPlaceholders.map((item) => (
              <div className="cat-nav-item catalog-skeleton-category" key={`category-sk-${item}`}>
                <div className="cat-nav-icon">
                  <Skeleton width="24px" height="24px" style={{ borderRadius: '50%' }} />
                </div>
                <Skeleton width="68px" height="10px" />
              </div>
            ))}
          </div>
        </aside>

        <section className="cat-right-column">
          <div className="cat-subcategories-bar catalog-skeleton-subcategories">
            <div className="cat-sub-pill catalog-skeleton-pill"><Skeleton width="105px" height="12px" /></div>
            <div className="cat-sub-pill catalog-skeleton-pill"><Skeleton width="82px" height="12px" /></div>
          </div>

          <ToolbarSkeleton />

          <div className="cat-grid-products catalog-skeleton-products">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={`category-product-sk-${index}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

const BrandCatalogSkeleton = () => (
  <div className="brand-container catalog-skeleton-page catalog-skeleton-page--brand" aria-hidden="true">
    <section className="brand-hero catalog-skeleton-brand-hero">
      <Skeleton width="100%" height="100%" />
    </section>

    <div className="brand-layout catalog-skeleton-brand-layout">
      <aside className="sidebar-filters catalog-skeleton-brand-sidebar">
        <div className="cat-sidebar-header-mobile">
          <span className="sidebar-label-grey">
            <Skeleton width="78px" height="10px" />
          </span>
          <div className="catalog-skeleton-mobile-arrows">
            <Skeleton width="30px" height="30px" style={{ borderRadius: '50%' }} />
            <Skeleton width="30px" height="30px" style={{ borderRadius: '50%' }} />
          </div>
        </div>

        <div className="categories-stack">
          {brandPlaceholders.map((item) => (
            <div className="category-card-btn catalog-skeleton-brand-category" key={`brand-category-sk-${item}`}>
              <div className="cat-img-box">
                <Skeleton width="24px" height="24px" style={{ borderRadius: '50%' }} />
              </div>
              <Skeleton width="96px" height="10px" />
            </div>
          ))}
        </div>
      </aside>

      <main className="products-area">
        <ToolbarSkeleton />

        <div className="grid-container catalog-skeleton-brand-products">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={`brand-product-sk-${index}`} />
          ))}
        </div>
      </main>
    </div>
  </div>
);

export const CatalogSkeleton = ({ variant = 'category' }) => (
  variant === 'brand' ? <BrandCatalogSkeleton /> : <CategoryCatalogSkeleton />
);

export default CatalogSkeleton;
