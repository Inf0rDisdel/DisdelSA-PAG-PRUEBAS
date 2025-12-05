import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './MegaMenu.module.css';

import kcpImage from 'assets/images/categories/KCP.jpg'; 
import post3MImage from 'assets/images/categories/POST3M.jpg'; 
import postWieseImage from 'assets/images/categories/POSTWIESE.jpg';
import postSilverImage from 'assets/images/categories/POSTSILVER.jpg';
import todosDeptosImage from 'assets/images/categories/KCPro.jpg'; 
import botiquinDeptosImage from 'assets/images/categories/Botiquin.jpg';  
import cafeteriaDeptosImage from 'assets/images/categories/BañosHigiene.jpg';   
import higieneDeptosImage from 'assets/images/categories/Cafetería.jpg'; 
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
                    { name: 'Botiquín', promotion: { title: 'Botiquín y Primeros Auxilios', text: 'Todo lo indispensable para la seguridad y el cuidado en tu empresa.', image: botiquinDeptosImage, buttonText: 'Ver Botiquines' } },
                    { name: 'Cafetería', promotion: { title: 'Insumos para Cafetería', text: 'Café, snacks y todo lo que necesitas para tu área de descanso.', image: cafeteriaDeptosImage, buttonText: 'Ver Productos' } },
                    { name: 'Limpieza', promotion: { title: 'Artículos de Limpieza', text: 'Mantén tus espacios impecables con nuestros productos de alta calidad.', image: limpiezaDeptosImage, buttonText: 'Explorar Limpieza' } },
                    { name: 'Higiene', promotion: { title: 'Higiene Personal y Baños', text: 'Soluciones completas para la higiene y el bienestar.', image: higieneDeptosImage, buttonText: 'Explorar Higiene' } },
                    { name: 'EPP', promotion: { title: 'Equipo de Protección Personal', text: 'La mejor protección para tu equipo de trabajo.', image: EPPDeptosImage, buttonText: 'Explorar EPP' } },
                    { name: 'Ferreteria', promotion: { title: 'Ferretería General', text: 'Herramientas y materiales para cualquier proyecto.', image: FerreteriaDeptosImage, buttonText: 'Explorar Ferretería' } },
                    { name: 'Quimicos para Limpieza', promotion: { title: 'Químicos de Limpieza', text: 'Fórmulas potentes para una limpieza profesional.', image: QuimicosDeptosImage, buttonText: 'Ver Químicos' } },
                    { name: 'Material de Oficina', promotion: { title: 'Material de Oficina', text: 'Todo lo que necesitas para la productividad de tu oficina.', image: MaterialDeptosImage, buttonText: 'Ver Materiales' } },
                ]
            }
        ],
        promotion: { title: 'Explora Nuestros Departamentos', text: 'Encuentra todo lo que necesitas para tu empresa y hogar en un solo lugar.', image: todosDeptosImage,  } 
    },
    { name: 'KCP', icon: kcpIcon, subCategories: [/*...*/], promotion: { title: 'Kimberly Clark Profesional', image: kcpImage, buttonText: 'Ver Productos' } },
    { name: '3M', icon: tresMIcon, subCategories: [/*...*/], promotion: { title: 'Productos 3M', image: post3MImage, buttonText: 'Ver Productos' } },
    { name: 'WIESE', icon: wieseIcon, subCategories: [/*...*/], promotion: { title: 'Productos WIESE', image: postWieseImage, buttonText: 'Ver Productos' } },
    { name: 'SILVER', icon: silverIcon, subCategories: [/*...*/], promotion: { title: 'Productos SILVER', image: postSilverImage, buttonText: 'Ver Productos' } },
];


const MegaMenu = () => {
    const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
    const [activeSubItemPromo, setActiveSubItemPromo] = useState(null);

    const currentCategoryData = menuCategories.find(cat => cat.name === activeCategory);
    const promotionToShow = activeSubItemPromo || (currentCategoryData ? currentCategoryData.promotion : null);

    const createSlug = (text) => {
        return text.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    };

    return (
        <div className={styles.megaMenuContainer}>
            
            <div className={`${styles.megaMenuColumn} ${styles.categoriesColumn}`}>
                <ul>
                    {menuCategories.map((category) => (
                        <li
                            key={category.name}
                            className={activeCategory === category.name ? styles.active : ''}
                            onMouseEnter={() => {
                                setActiveCategory(category.name);
                                setActiveSubItemPromo(null); 
                            }}
                        >
                            <Link to={`/categoria/${createSlug(category.name)}`} className={styles.categoryLink}>
                                <img src={category.icon} alt={category.name} className={styles.categoryIcon} />
                                <span>{category.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

           
            <div 
                className={`${styles.megaMenuColumn} ${styles.subcategoriesColumn}`}
                onMouseLeave={() => setActiveSubItemPromo(null)}
            >
                {currentCategoryData && currentCategoryData.subCategories.map((subCat) => (
                    <div key={subCat.title} className={styles.subcategoryGroup}>
                        <h4>{subCat.title}</h4>
                        <ul>
                            {subCat.items && subCat.items.map(item => (
                                <li 
                                    key={item.name}
                                    onMouseEnter={() => setActiveSubItemPromo(item.promotion)}
                                >
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
                        <Link to="/ofertas" className={styles.promoButton}>
                            {promotionToShow.buttonText}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MegaMenu;