import React from 'react'; 
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast'; // Notificaciones rápidas
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. IMPORTAR

import ScrollToTop from 'components/ui/Button/ScrollToTop';
import AppRouter from './routes/AppRouter';
import Header from './components/layouts/Header/Header';
import Footer from './components/layouts/Footer/Footer';
import FloatingWidgets from "./components/ui/FloatingWidgets";
import './App.css';

// 2. CONFIGURAR EL CLIENTE DE TANSTACK QUERY
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita recargas innecesarias al cambiar de pestaña
      retry: 1, // Reintenta una vez si falla
    },
  },
});

function App() {
  return (
    // 3. ENVOLVER CON EL PROVIDER
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div className="App">
          {/* Toaster para las notificaciones de Zustand y Query */}
          <Toaster /> 

          {/* Componentes estructurales sin props (usan Zustand internamente) */}
          <Header /> 
          
          <ScrollToTop/>
          
          <main>
            <AppRouter />
          </main>
          
          <FloatingWidgets />
          <Footer />
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;