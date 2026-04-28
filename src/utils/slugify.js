export const createSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '') // Quita caracteres especiales
    .replace(/\s+/g, '-') // Espacios por guiones
    .replace(/-+/g, '-'); // Quita guiones dobles
};