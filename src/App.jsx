import React from 'react'; 
import { Toaster } from 'react-hot-toast'; // Notificaciones rápidas
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. IMPORTAR
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import WelcomeSplash from 'components/ui/WelcomeSplash/WelcomeSplash';
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
      gcTime: 1000 * 60 * 60 * 24, // 24 horas de vida en disco
      staleTime: 1000 * 60 * 5,    // 5 minutos de "frescura" total
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 2. Crear el persistidor (Guarda la data en localStorage)
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// 3. Unir el cliente con la persistencia
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // Tiempo máximo de validez
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
          <WelcomeSplash />
          
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