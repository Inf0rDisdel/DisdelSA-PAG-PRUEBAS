import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './MegaMenu.module.css';

import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';
import defaultIcon from 'assets/images/KCP.webp'; 

const MegaMenu = () => {
    const { data: menuData, isLoading, isError } = useMenu();
    const [activeCategory, setActiveCategory] = useState('Todos los Departamentos');
    const [activeSubItem, setActiveSubItem] = useState(null);

    const brandKeywords = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];

    // Helper para Slugs
    const createSlug = (text) => {
        if(!text) return '';
        return text.toString().toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/\s+/g, '-');
    };

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
            name: 'Todos los Departamentos',
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
                buttonText: 'Ver Marca' 
            }
        }));

        return [allDepartments, ...mappedBrands];
    }, [menuData]);

    const currentCategoryData = menuStructure.find(cat => cat.name === activeCategory);

    // Lógica de Links Dinámicos
    const getLinkProps = (item) => {
        if (!item) return { to: '#' };

        if (item.type === 'marca') {
            // Si es marca: /marca/3m y mandamos el ID de categoria por state
            return {
                to: `/marca/${item.parentSlug}`,
                state: { preSelectedCatId: item.id }
            };
        } else {
            // Si es categoria: /categoria/herramientas-limpieza
            return {
                to: `/categoria/${createSlug(item.name)}`
            };
        }
    };

    // Datos para la columna de Promoción
    const promoImage = activeSubItem?.image || currentCategoryData?.promotion?.image;
    const promoTitle = activeSubItem?.name || currentCategoryData?.promotion?.title;
    
    // Link del botón de promoción
    const getPromoButtonLink = () => {
        if (activeSubItem) return getLinkProps(activeSubItem);
        if (currentCategoryData?.isStatic) return { to: '/categoria/todos' };
        return { to: `/marca/${createSlug(currentCategoryData?.name)}` };
    };

    if (isLoading || isError || !menuData) return null;

    return (
        <div className={styles.megaMenuContainer}>
            {/* Columna 1: Segmentos / Marcas */}
            <div className={`${styles.megaMenuColumn} ${styles.categoriesColumn}`}>
                <ul>
                    {menuStructure.map((category) => (
                        <li
                            key={category.name}
                            className={activeCategory === category.name ? styles.active : ''}
                            onMouseEnter={() => {
                                setActiveCategory(category.name);
                                setActiveSubItem(null); 
                            }}
                        >
                            <div className={styles.categoryLink}>
                                <img src={category.icon} alt={category.name} className={styles.categoryIcon} />
                                <span>{category.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Columna 2: Subcategorías */}
            <div className={`${styles.megaMenuColumn} ${styles.subcategoriesColumn}`} onMouseLeave={() => setActiveSubItem(null)}>
                {currentCategoryData && currentCategoryData.subCategories.map((group, index) => (
                    <div key={index} className={styles.subcategoryGroup}>
                        <h4>{group.title}</h4>
                        <ul>
                            {group.items?.map(item => {
                                const linkProps = getLinkProps(item);
                                return (
                                    <li key={item.name} onMouseEnter={() => setActiveSubItem(item)}>
                                        <Link {...linkProps}>
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            
            {/* Columna 3: Promoción Visual */}
            <div className={`${styles.megaMenuColumn} ${styles.promotionColumn}`}>
                <div className={styles.promotionCard}>
                    <div className={styles.promoImageContainer}>
                        {promoImage && <img src={promoImage} alt={promoTitle} />}
                    </div>
                    <h3>{promoTitle}</h3>
                    <p>{activeSubItem ? 'Ver productos de esta categoría' : currentCategoryData?.promotion?.text}</p>
                    
                    <Link {...getPromoButtonLink()} className={styles.promoButton}>
                        {activeSubItem ? 'Ir a Productos' : currentCategoryData?.promotion?.buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;