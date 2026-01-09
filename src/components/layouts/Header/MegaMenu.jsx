import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './MegaMenu.module.css';

// IMPORTS DE IMÁGENES (Se mantienen igual)
import kcpImage from 'assets/images/categories/KCP.jpg'; 
import post3MImage from 'assets/images/categories/POST3M.jpg'; 
import postWieseImage from 'assets/images/categories/POSTWIESE.jpg';
import postSilverImage from 'assets/images/categories/POSTSILVER.jpg';
import todosDeptosImage from 'assets/images/categories/KCPro.jpg'; 
import botiquinDeptosImage from 'assets/images/categories/Botiquin.jpg';  
import higieneDeptosImage from 'assets/images/categories/BañosHigiene.jpg';   
import cafeteriaDeptosImage from 'assets/images/categories/Cafetería.jpg'; 
import limpiezaDeptosImage from 'assets/images/categories/HerramientasPLimpieza.jpg'; 
import EPPDeptosImage from 'assets/images/categories/EPP.jpg'; 
import FerreteriaDeptosImage from 'assets/images/categories/Ferreteria.jpg'; 
import QuimicosDeptosImage from 'assets/images/categories/QuimicosLimpieza.jpg'; 
import MaterialDeptosImage from 'assets/images/categories/MaterialOficina.jpg'; 
import todosDeptosIcon from 'assets/images/categories/KCP.jpg';
import kcpIcon from 'assets/images/categories/KCPro.jpg';
import tresMIcon from 'assets/images/categories/POST3M.jpg';
import wieseIcon from 'assets/images/categories/POSTWIESE.jpg';
import silverIcon from 'assets/images/categories/POSTSILVER.jpg';

const menuCategories = [
    {
        name: 'Todos los Departamentos',
        icon: todosDeptosIcon,
        subCategories: [
            {
                title: 'Nuestros Departamentos',
                items: [
                    { name: 'EPP', promotion: { title: 'EPP', text: 'La mejor protección...', image: EPPDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Botiquín', promotion: { title: 'Botiquín', text: 'Todo lo indispensable...', image: botiquinDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Cafetería', promotion: { title: 'Cafetería', text: 'Café, snacks...', image: cafeteriaDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Ferretería', promotion: { title: 'Ferretería', text: 'Herramientas y materiales...', image: FerreteriaDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Baños e Higiene', promotion: { title: 'Baños e Higiene', text: 'Soluciones completas...', image: higieneDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Material de Oficina', promotion: { title: 'Material de Oficina', text: 'Todo para la productividad...', image: MaterialDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Químicos para Limpieza', promotion: { title: 'Químicos para Limpieza', text: 'Fórmulas potentes...', image: QuimicosDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Herramientas para Limpieza', promotion: { title: 'Herramientas para Limpieza', text: 'Mantén tus espacios...', image: limpiezaDeptosImage, buttonText: 'Ver Productos' } },
                ]
            }
        ],
        promotion: { title: 'Explora Nuestros Departamentos', text: 'Encuentra todo lo que necesitas.', image: todosDeptosImage, buttonText: 'Ver Todo' } 
    },
    // CORRECCIÓN: Kimberly Clark (sin la C de más)
    { name: 'Kimberly Clark', icon: kcpIcon, subCategories: [], promotion: { title: 'Kimberly Clark Profesional', image: kcpImage, buttonText: 'Ver Marca' } },
    { name: '3M', icon: tresMIcon, subCategories: [], promotion: { title: 'Productos 3M', image: post3MImage, buttonText: 'Ver Marca' } },
    { name: 'WIESE', icon: wieseIcon, subCategories: [], promotion: { title: 'Productos WIESE', image: postWieseImage, buttonText: 'Ver Marca' } },
    { name: 'SILVER', icon: silverIcon, subCategories: [], promotion: { title: 'Productos SILVER', image: postSilverImage, buttonText: 'Ver Marca' } },
];

const MegaMenu = () => {
    const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
    const [activeSubItem, setActiveSubItem] = useState(null);

    const currentCategoryData = menuCategories.find(cat => cat.name === activeCategory);
    const promotionToShow = activeSubItem?.promotion || currentCategoryData?.promotion;

    // Función unificada para slugs
    const createSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, '-');

    return (
        <div className={styles.megaMenuContainer}>
            <div className={`${styles.megaMenuColumn} ${styles.categoriesColumn}`}>
                <ul>
                    {menuCategories.map((category) => {
                        // LÓGICA DE RUTA: Si no es "Todos los Deptos", es una Marca
                        const isBrand = category.name !== 'Todos los Departamentos';
                        const targetPath = isBrand 
                            ? `/marca/${createSlug(category.name)}` 
                            : `/categoria/${createSlug(category.name)}`;

                        return (
                            <li
                                key={category.name}
                                className={activeCategory === category.name ? styles.active : ''}
                                onMouseEnter={() => {
                                    setActiveCategory(category.name);
                                    setActiveSubItem(null); 
                                }}
                            >
                                <Link to={targetPath} className={styles.categoryLink}>
                                    <img src={category.icon} alt={category.name} className={styles.categoryIcon} />
                                    <span>{category.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className={`${styles.megaMenuColumn} ${styles.subcategoriesColumn}`} onMouseLeave={() => setActiveSubItem(null)}>
                {currentCategoryData && currentCategoryData.subCategories.map((subCat) => (
                    <div key={subCat.title} className={styles.subcategoryGroup}>
                        <h4>{subCat.title}</h4>
                        <ul>
                            {subCat.items && subCat.items.map(item => (
                                <li key={item.name} onMouseEnter={() => setActiveSubItem(item)}>
                                    <Link to={`/departamento/${createSlug(item.name)}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div className={`${styles.megaMenuColumn} ${styles.promotionColumn}`}>
                {promotionToShow && (
                    <div className={styles.promotionCard}>
                        <img src={promotionToShow.image} alt={promotionToShow.title} />
                        <h3>{promotionToShow.title}</h3>
                        <p>{promotionToShow.text}</p>
                        
                        <Link 
                            to={activeSubItem 
                                ? `/departamento/${createSlug(activeSubItem.name)}` 
                                : (activeCategory === 'Todos los Departamentos' ? '/ofertas' : `/marca/${createSlug(activeCategory)}`)
                            } 
                            className={styles.promoButton}
                        >
                            {promotionToShow.buttonText}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MegaMenu;