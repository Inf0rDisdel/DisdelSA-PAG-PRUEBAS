import bannerImagen from '../assets/50Años.jpg';
const BANNERS_API_URL = 'URL_DE_TU_API_DE_BANNERS';
const PRODUCTS_API_URL = 'URL_DE_TU_API_DE_PRODUCTOS';
const CATEGORIES_API_URL = 'URL_DE_TU_API_DE_CATEGORIAS';



export const getBanners = async () => {
  // Simulación de una llamada a la API
  return [
    { id: 1, imageUrl: bannerImagen, altText: 'Banner Promocional 50 Años' }
  ];
  // Código real:
  // const response = await fetch(BANNERS_API_URL);
  // return await response.json();
};

export const getProducts = async () => {
  // Simulación
  return [
    { id: 1, name: 'Categoria 1', description: 'Descripción del producto 1', price: 100, img: '../assets/logo.png' },
    { id: 2, name: 'Categoria 2', description: 'Descripción del producto 2', price: 200, imag: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Categoria 3', description: 'Descripción del producto 1', price: 100, imag: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Categoria 4', description: 'Descripción del producto 1', price: 100, imag: 'https://via.placeholder.com/150' }
  ];
  // const response = await fetch(PRODUCTS_API_URL);
  // return await response.json();
};

export const getCategories = async () => {
  // Simulación
  return [
    { id: 1, name: 'KimberlyClark' },
    { id: 2, name: '3M' },
    { id: 3, name: 'SilverChemical' },
    { id: 4, name: 'Wiese' }
  ];
  // const response = await fetch(CATEGORIES_API_URL);
  // return await response.json();
};

// Agrega aquí la función para enviar el correo