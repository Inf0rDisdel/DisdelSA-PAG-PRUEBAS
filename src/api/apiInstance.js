// src/api/apiInstance.js
import axios from 'axios';
import { AppConfig } from 'config/AppConfig';

// Instancia para Cotizaciones (Puerto 60839)
export const apiVentas = axios.create({
    baseURL: AppConfig.baseUrlVentas,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Instancia para Suscripciones (Puerto 56110)
export const apiSuscripcion = axios.create({
    baseURL: AppConfig.baseUrlSuscripcion, // Asegúrate de tener esta clave en AppConfig.js
    headers: {
        'Content-Type': 'application/json'
    }
});