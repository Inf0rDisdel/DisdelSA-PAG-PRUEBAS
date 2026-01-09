import axios from 'axios';
import { AppConfig } from 'config/AppConfig';

const apiInstance = axios.create({
    baseURL: AppConfig.baseUrlVentas,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiInstance;