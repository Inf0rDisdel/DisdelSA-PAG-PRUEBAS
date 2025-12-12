import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BrandPage.css';

import bannerKimberly from 'assets/images/banners/BANNER-KCP.png'; 
import bannerSilver from 'assets/images/banners/banners_silver-2.jpg';
import banner3m from 'assets/images/banners/BANNERS-3M.png';
import bannerWiese from 'assets/images/banners/BANNERS-WIESE.jpg';

import imgPastillas from 'assets/images/categories/BañosHigiene.jpg'; 
import imgDispensador from 'assets/images/categories/Botiquin.jpg';
import imgPapel from 'assets/images/categories/EPP.jpg';
import imgDiscos from 'assets/images/categories/KCP.jpg';
import imgQuimicos from 'assets/images/categories/Ferreteria.jpg'; 
import Automotriz from 'assets/images/brands/1975.png'

// --- ICONO PARA "VER TODO" ---
// Puedes usar uno específico o repetir uno genérico por ahora
import iconVerTodo from 'assets/images/categories/BañosHigiene.jpg'; // O usa un icono de "Home"

const brandConfig = {
  "kimberly-clark": { banner: bannerKimberly, color: "#00558C" },
  "wiese": { banner: bannerWiese, color: "#692C90" },
  "3m": { banner: banner3m, color: "#EE2737" },
  "silver": { banner: bannerSilver, color: "#76BD1D" }
};

const categoryImagesMap = {
  "Pastillas de Baño": imgPastillas,
  "Dispensadores": imgDispensador,
  "Papel Higiénico": imgPapel,
  "Químicos de Limpieza": imgQuimicos,
  "Automotriz": Automotriz,
  "Aromatizantes": imgPastillas,
  "Discos de Piso": imgDiscos,
  "Herramientas de Limpieza": imgDiscos
};

const mockProducts = [
  // --- WIESE ---
  { id: 1, name: "Aromatizante Lavanda", category: "Aromatizantes", brand: "wiese", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 5 },
  { id: 2, name: "Pastilla para Tanque", category: "Pastillas de Baño", brand: "wiese", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 4 },
  { id: 3, name: "Dispensador Aerosol", category: "Dispensadores", brand: "wiese", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 5 },
  { id: 4, name: "Aromatizante Cítrico", category: "Aromatizantes", brand: "wiese", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 4 },
  { id: 5, name: "Pastilla Azul Wiese", category: "Pastillas de Baño", brand: "wiese", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 3 },
  // --- KIMBERLY-CLARK ---
  { id: 6, name: "Papel Jumbo Roll", category: "Papel Higiénico", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/135858-imgS-19-2-2020-84206-.jpg?w=380&h=380", rating: 5 },
  { id: 7, name: "Toalla Scott Interdoblada", category: "Papel Higiénico", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/135858-imgS-19-2-2020-84206-.jpg?w=380&h=380", rating: 4 },
  { id: 8, name: "Jabonera Mod", category: "Dispensadores", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 5 },
  { id: 9, name: "Pañuelos Kleenex", category: "Papel Higiénico", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/135858-imgS-19-2-2020-84206-.jpg?w=380&h=380", rating: 5 },
  { id: 10, name: "Dispensador de Toalla", category: "Dispensadores", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 4 },
  { id: 11, name: "Jabón en Espuma", category: "Dispensadores", brand: "kimberly-clark", img: "https://disdelsa.com/imagenes/productos/PTQ4025-imgS-11-11-2024-92600-.jpg?w=380&h=380", rating: 5 },
  // --- 3M ---
  { id: 12, name: "Disco Rojo 20 Pulgadas", category: "Discos de Piso", brand: "3m", img: "https://via.placeholder.com/150", rating: 5 },
  { id: 13, name: "Disco Negro Removedor", category: "Discos de Piso", brand: "3m", img: "https://via.placeholder.com/150", rating: 5 },
  { id: 14, name: "Fibra Esponja P96", category: "Herramientas de Limpieza", brand: "3m", img: "https://via.placeholder.com/150", rating: 4 },
  { id: 15, name: "Paño de Microfibra", category: "Herramientas de Limpieza", brand: "3m", img: "https://via.placeholder.com/150", rating: 5 },
  // --- SILVER ---
  { id: 16, name: "Desinfectante Galón", category: "Químicos de Limpieza", brand: "silver", img: "https://via.placeholder.com/150", rating: 4 },
  { id: 17, name: "Cloro Líquido", category: "Químicos de Limpieza", brand: "silver", img: "https://via.placeholder.com/150", rating: 5 },
  { id: 18, name: "Limpiador de Vidrios", category: "Químicos de Limpieza", brand: "silver", img: "https://via.placeholder.com/150", rating: 4 },
  { id: 19, name: "Shampoo para Carros", category: "Automotriz", brand: "silver", img: "https://via.placeholder.com/150", rating: 5 },
];

const BrandPage = () => {
  const { slug } = useParams();
  const currentBrand = slug ? slug.toLowerCase().trim().replace(/\s+/g, '-') : "";
  const brandData = brandConfig[currentBrand] || { banner: null, color: "#004aad" };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // ESTADO NUEVO: Para saber cuál botón está activo (y resaltar el de "Ver Todo")
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    // 1. Cargar productos INICIALES (Todos los de la marca)
    const brandSpecificProducts = mockProducts.filter(
      p => p.brand.toLowerCase() === currentBrand
    );
    setProducts(brandSpecificProducts);

    // 2. Generar lista de categorías
    const uniqueCats = [...new Set(brandSpecificProducts.map(p => p.category))];
    setCategories(uniqueCats);
    
    // 3. Resetear el filtro visual a "all"
    setActiveCategory("all");

  }, [currentBrand]);

  // FUNCIÓN PARA MANEJAR EL CLIC
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName); // Marcamos el botón como activo

    if (categoryName === "all") {
      // SI ES "VER TODO": Mostramos TODOS los productos de la marca (Regresamos al inicio)
      const allBrandProducts = mockProducts.filter(
        p => p.brand.toLowerCase() === currentBrand
      );
      setProducts(allBrandProducts);
    } else {
      // SI ES UNA CATEGORÍA: Filtramos
      const filtered = mockProducts.filter(
        p => p.brand.toLowerCase() === currentBrand && p.category === categoryName
      );
      setProducts(filtered);
    }
  };

  return (
    <div className="brand-container" style={{ '--brand-color': brandData.color }}>
      
      {/* BANNER */}
      <div className="brand-hero">
        {brandData.banner ? (
          <img src={brandData.banner} alt={`${slug} Banner`} />
        ) : (
          <div style={{width: '100%', height: '250px', background: brandData.color}}></div>
        )}
      </div>

      <div className="brand-layout">
        
        {/* SIDEBAR */}
        <aside className="sidebar-filters">
          <span className="sidebar-title">Categorías</span>
          
          <div className="categories-stack">
            
            {/* --- 1. BOTÓN DE INICIO / VER TODO --- */}
            <div 
              className="category-card-btn" 
              // Si la categoría activa es "all", le damos un estilo diferente (opcional) o lo dejamos igual
              style={activeCategory === "all" ? { filter: 'brightness(0.8)' } : {}}
              onClick={() => handleCategoryClick("all")}
            >
              <div className="cat-img-box">
                {/* Icono genérico para "Ver Todo" */}
                <img src={iconVerTodo} alt="Ver Todo" />
              </div>
              <span className="cat-text">Inicio</span>
            </div>

            {/* --- 2. LISTA DE CATEGORÍAS DINÁMICAS --- */}
            {categories.map((cat, index) => {
              const catImage = categoryImagesMap[cat] || imgPastillas; 
              return (
                <div 
                  key={index} 
                  className="category-card-btn" 
                  // Resaltamos visualmente si esta es la categoría activa
                  style={activeCategory === cat ? { filter: 'brightness(0.8)', border: '2px solid white' } : {}}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="cat-img-box">
                    <img src={catImage} alt={cat} />
                  </div>
                  <span className="cat-text">{cat}</span>
                </div>
              );
            })}
          </div>

          <div className="rating-section">
            <span className="sidebar-title" style={{fontSize: '18px'}}>Valoración</span>
            <div className="rating-row"><span className="stars">★★★★★</span> 5.0</div>
            <div className="rating-row"><span className="stars">★★★★☆</span> 4.0 y más</div>
          </div>
        </aside>

        {/* GRILLA */}
        <main className="products-area">
          <div className="grid-container">
            {products.map((prod) => (
              <div className="product-card" key={prod.id}>
                <div className="prod-img-container">
                  <img src={prod.img} alt={prod.name} />
                </div>
                <div className="prod-category">{prod.category}</div>
                <div className="prod-title">{prod.name}</div>
                <div className="prod-stars">{'★'.repeat(prod.rating)}</div>
                <button className="btn-details">Ver detalles</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandPage;