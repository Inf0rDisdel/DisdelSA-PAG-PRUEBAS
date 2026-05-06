import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './MegaMenu.module.css';

import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';
import { useBanners } from 'hooks/useBanners';
import { createSlug } from 'utils/slugify';

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

    // Helper para Slugs
    const createSlug = useCallback((text) => {
        if (!text) return '';
        return text.toString().toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/ñ/g, 'n') // Sincronizado
            .replace(/[^a-z0-9 -]/g, '') 
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }, []);

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
                to: `/marca/${item.parentSlug}`,
                state: { preSelectedCatId: item.id },
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
        <nav className={styles.megaMenuContainer} role ="navigation" arial-label="Menú de categorias">
            {/* Columna 1: Segmentos / Marcas */}
            <div className={`${styles.megaMenuColumn} ${styles.categoriesColumn}`}>
                <ul role="menubar" className={styles.menuList}>
                    {menuStructure.map((category) => (
                        <li
                            key={category.name}
                            role="none"
                            className={`${styles.menuListItem} ${activeCategory === category.name ? styles.active : ''}`}
                            onMouseEnter={() => {
                                setActiveCategory(category.name);
                                setActiveSubItem(null); 
                            }}
                        >
                            <div className={styles.categoryLink}>
                                <img 
                                    src={category.icon || defaultIcon} 
                                    alt={`Icono ${category.name}`} 
                                    aria-hidden="true" 
                                    className={styles.categoryIcon} 
                                    loading="lazy" 
                                />
                                <span>{category.name}</span>
                            </div>
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
                        <ul role="menu">
                            {group.items?.map(item => (
                                <li key={item.name} role="none" onMouseEnter={() => setActiveSubItem(item)}>
                                    <Link 
                                        {...getLinkProps(item)} 
                                        role="menuitem"
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
                        <img 
                            src={activeSubItem?.image || currentCategoryData?.promotion?.image || defaultIcon} 
                            alt={activeSubItem?.name || currentCategoryData?.promotion?.title} 
                            loading="lazy"
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