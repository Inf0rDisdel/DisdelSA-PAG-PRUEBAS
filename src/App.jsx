import React from 'react'; 
import { Toaster } from 'react-hot-toast'; // Notificaciones rápidas
import { QueryClient } from '@tanstack/react-query'; // 1. IMPORTAR
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

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
      networkMode: 'offlineFirst',
    },
  },
});

// 2. Crear el persistidor (Guarda la data en localStorage)
const localStoragePersister =
  typeof window !== 'undefined'
      ? createSyncStoragePersister({
        storage: window.localStorage,
        // Evita serializaciones síncronas durante el render crítico.
        throttleTime: 5000,
      })
    : undefined;

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        buster: 'disdel-cache-v2',
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => (
            query.state.status === 'success' &&
            query.queryKey[0] !== 'productos-all'
          ),
        },
      }}
    >
      <div className="App">

        <Toaster/>

        <Header />

        <ScrollToTop />

        <AppRouter />

        <FloatingWidgets />

        <Footer />

      </div>
    </PersistQueryClientProvider>
  );
}

export default App;
