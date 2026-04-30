import React from 'react'; 
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
      refetchOnWindowFocus: false,
      retry: 1,
      // PERFORMANCE: Aumentamos el staleTime global para evitar peticiones flash
      staleTime: 1000 * 60 * 5, 
      keepPreviousData: true, 
    },
  },
});

function App() {
  return (
    // 3. ENVOLVER CON EL PROVIDER
    <QueryClientProvider client={queryClient}>
        <div className="App">
          {/* Toaster para las notificaciones de Zustand y Query */}
          <Toaster /> 

          {/* Componentes estructurales sin props (usan Zustand internamente) */}
          <Header /> 
          
          <ScrollToTop/>
          
          <main role='main'>
            <AppRouter />
          </main>
          
          <FloatingWidgets />
          <Footer />
        </div>
    </QueryClientProvider>
  );
}

export default App;