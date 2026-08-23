// src/api/apiInstance.js
import axios from 'axios';
import { AppConfig } from 'config/AppConfig';

const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000, // 15 segundos máximo
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Interceptor para peticiones (útil para añadir tokens de auth después)
  instance.interceptors.request.use(config => {
    // Si necesitas añadir un API Key o Token B2B aquí es el lugar
    return config;
  }, error => Promise.reject(error));

  // Interceptor para respuestas (Manejo global de errores)
  instance.interceptors.response.use(
    response => response,
    error => {
      const message = error.response?.data?.message || 'Error de conexión';
      // Algunas consultas son complementarias y ya disponen de un fallback local.
      // Esas consultas gestionan el error en su propio hook para no llenar la
      // consola con falsos positivos cuando el servicio auxiliar no está activo.
      if (!error.config?.suppressErrorLog) {
        console.error(`[API Error] ${error.config?.url || 'URL desconocida'}:`, message);
      }
      // Aquí podrías integrar un sistema de logs como Sentry
      return Promise.reject(error);
    }
  );

  return instance;
};

// Usar la función que creaste para todas las instancias
export const apiVentas = createInstance(AppConfig.baseUrlVentas);
export const apiSuscripcion = createInstance(AppConfig.baseUrlSuscripcion);
export const ApiMobil = createInstance(AppConfig.baseUrlMobil);
