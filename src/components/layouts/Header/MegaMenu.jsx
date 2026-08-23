import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './MegaMenu.module.css';

import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';
import { useBanners } from 'hooks/useBanners';
import { createSlug } from 'utils/slugify';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const brandKeywords = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];

const MegaMenu = () => {

    const { data: bannerData } = useBanners();
    const { data: menuData, isLoading, isError } = useMenu();

    const [activeCategory, setActiveCategory] = useState('Todas las Categorias');
    const [activeSubItem, setActiveSubItem] = useState(null);

    const defaultIcon = useMemo(() => {
        const found = bannerData?.ImagenPredeterminado?.find(i=> i.Titulo?.trim() === "ImagenDefault2");
        const fileName = found?.BannerImagenMovil;
        return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
    }, [bannerData]);

    const menuStructure = useMemo(() => {
        if (!menuData) return [];

        const genericSegments = menuData.filter(seg => 
            !brandKeywords.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
        );

        const brandSegments = menuData.filter(seg => 
            brandKeywords.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
        );

        // 1. Estructura de "Todos los Departamentos" (Van a /categoria/)
        const allDepartments = {
            name: 'Todas las Categorias',
            icon: defaultIcon, 
            isStatic: true,
            subCategories: [
                {
                    title: 'Nuestros Departamentos',
                    items: genericSegments.map(seg => ({
                        name: seg.NombreSegmento,
                        id: seg.IdSegmento,
                        type: 'categoria', // Indica la ruta base
                        image: seg.Imagen ? `${AppConfig.baseImageUrl}${seg.Imagen}` : defaultIcon
                    }))
                }
            ],
            promotion: { 
                title: 'Catálogo Disdel', 
                text: 'Higiene y Limpieza Profesional', 
                image: defaultIcon, 
                buttonText: 'Ver Todo' 
            }
        };

        // 2. Estructura de Marcas (Van a /marca/)
        const mappedBrands = brandSegments.map(seg => ({
            name: seg.NombreSegmento,
            id: seg.IdSegmento,
            icon: seg.Imagen ? `${AppConfig.baseImageUrl}${seg.Imagen}` : defaultIcon,
            subCategories: [
                {
                    title: `Categorías ${seg.NombreSegmento}`,
                    items: seg.Categorias?.map(cat => ({
                        name: cat.NombreCategoria,
                        id: cat.IdCategoria,
                        parentSlug: createSlug(seg.NombreSegmento), // Guardamos el slug del padre (marca)
                        type: 'marca', 
                        image: cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultIcon
                    })) || []
                }
            ],
            promotion: { 
                title: seg.NombreSegmento, 
                image: seg.Imagen ? `${AppConfig.baseImageUrl}${seg.Imagen}` : defaultIcon, 
                buttonText: 'Ver Productos' 
            }
        }));

        return [allDepartments, ...mappedBrands];
    }, [menuData, defaultIcon]);

    const currentCategoryData = useMemo(() => 
        menuStructure.find(cat => cat.name === activeCategory),
    [menuStructure, activeCategory]);

    const getLinkProps = useCallback((item) => {
        if (!item) return { to: '#' };
        if (item.type === 'marca') {
            return {
                to: `/marca/${item.parentSlug}/${createSlug(item.name)}`,
                title: `Ver productos de ${item.name} en Disdel`
            };
        }
        return { 
            to: `/categoria/${createSlug(item.name)}`,
            title: `Explorar categoría ${item.name}`
        };
    }, []);
    // Datos para la columna de Promoción
    //const promoImage = activeSubItem?.image || currentCategoryData?.promotion?.image;
    //const promoTitle = activeSubItem?.name || currentCategoryData?.promotion?.title;
    
    // Link del botón de promoción
    const getPromoButtonLink = useCallback(() => {
        if (activeSubItem) return getLinkProps(activeSubItem);
        if (currentCategoryData?.isStatic) return { to: '/buscar?q=suministros' };
        return { to: `/marca/${createSlug(currentCategoryData?.name)}` };
    }, [activeSubItem, currentCategoryData, getLinkProps]);

    if (isLoading || isError || !menuData) return null;

    return (
        <nav className={styles.megaMenuContainer} aria-label="Menú de categorías">
            {/* Columna 1: Segmentos / Marcas */}
            <div className={`${styles.megaMenuColumn} ${styles.categoriesColumn}`}>
                <ul className={styles.menuList}>
                    {menuStructure.map((category) => (
                        <li
                            key={category.name}
                            className={`${styles.menuListItem} ${activeCategory === category.name ? styles.active : ''}`}
                            onMouseEnter={() => {
                                setActiveCategory(category.name);
                                setActiveSubItem(null); 
                            }}
                        >
                            <button
                                type="button"
                                className={styles.categoryLink}
                                aria-pressed={activeCategory === category.name}
                                onFocus={() => {
                                    setActiveCategory(category.name);
                                    setActiveSubItem(null);
                                }}
                                onClick={() => {
                                    setActiveCategory(category.name);
                                    setActiveSubItem(null);
                                }}
                            >
                                <OptimizedImage
                                    src={category.icon || defaultIcon} 
                                    alt="" 
                                    aria-hidden="true" 
                                    className={styles.categoryIcon} 
                                    widths={[32, 48]}
                                    targetWidth={48}
                                    quality={80}
                                    sizes="24px"
                                    width="24"
                                    height="24"
                                    loading="lazy"
                                    decoding="async"
                                    fetchPriority="low"
                                />
                                <span>{category.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Columna 2: Subcategorías */}
            <div 
                className={`${styles.megaMenuColumn} ${styles.subcategoriesColumn}`} 
                onMouseLeave={() => setActiveSubItem(null)}
            >
                {currentCategoryData && currentCategoryData.subCategories.map((group, index) => (
                    <div key={index} className={styles.subcategoryGroup}>
                        <h4>{group.title}</h4>
                        <ul>
                            {group.items?.map(item => (
                                <li key={item.name} onMouseEnter={() => setActiveSubItem(item)}>
                                    <Link 
                                        {...getLinkProps(item)} 
                                        className={styles.subLink}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            {/* Columna 3: Promoción Visual */}
            <div className={`${styles.megaMenuColumn} ${styles.promotionColumn}`}>
                <div className={styles.promotionCard}>
                    <div className={styles.promoImageContainer}>
                        <OptimizedImage
                            src={activeSubItem?.image || currentCategoryData?.promotion?.image || defaultIcon} 
                            alt={activeSubItem?.name || currentCategoryData?.promotion?.title} 
                            widths={[240, 320, 480]}
                            targetWidth={480}
                            quality={78}
                            sizes="320px"
                            width="320"
                            height="240"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            className={styles.promoImg}
                        />
                    </div>
                     <h3 className={styles.promoTitle}>
                        {activeSubItem?.name || currentCategoryData?.promotion?.title}
                    </h3>
                    <p className={styles.promoText}>
                        {activeSubItem 
                            ? `Descubre las mejores soluciones institucionales de ${activeSubItem.name}.` 
                            : currentCategoryData?.promotion?.text || 'Expertos en abastecimiento técnico.'}
                    </p>
                    <Link {...getPromoButtonLink()} className={styles.promoButton}>
                        {activeSubItem ? 'Ver Ahora' : currentCategoryData?.promotion?.buttonText}
                    </Link>
                </div>
            </div>
        </nav>
    );    
};

export default MegaMenu;
