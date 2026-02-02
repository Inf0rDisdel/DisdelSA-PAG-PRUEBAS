// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast'; 
import { solicitarCotizador } from '../api/VentasApi';
import { VentasModels } from '../api/ventasModels'; 
const useCartStore = create(
  persist(
    (set, get) => ({
            cart: [],
      _hasHydrated: false, // Nuevo estado para saber si ya cargó
      setHasHydrated: (state) => set({ _hasHydrated: state }),



       // src/store/useCartStore.js

// src/store/useCartStore.js

addItem: (product) => {
    const { cart } = get();

    // 1. EXTRAER EL TEXTO REAL DE LA PRESENTACIÓN
    // Prioridad: 
    // - Si ya viene seleccionado del detalle, usamos ese.
    // - Si no, buscamos en el campo 'Unidad' de la API (ej: "Blister 2x1").
    // - Si no hay Unidad, buscamos en 'Empaque'.
    const finalPresentation = product.presentationSelected || (product.Unidad || product.Empaque || 'Unidad');
    
    // 2. ASIGNAR EL TIPO PARA SAP (Y / N)
    // Si el texto viene del campo 'Unidad', es "Y". De lo contrario "N".
    const finalUnitType = product.unitType || (product.Unidad ? 'Y' : 'N');

    const productId = product.IdProducto || product.id;
    const descripcion = product.Descripcion || product.name;

    // 3. BUSCAR COINCIDENCIA EN EL CARRITO
    // Ahora comparamos por ID y por el TEXTO de la presentación
    const existingItem = cart.find(item => 
      item.IdProducto === productId && item.presentationSelected === finalPresentation
    );
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          (item.IdProducto === productId && item.presentationSelected === finalPresentation)
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        )
      });
    } else {
      set({ 
        cart: [...cart, { 
          ...product, 
          IdProducto: productId,
          Descripcion: descripcion,
          presentationSelected: finalPresentation, // Aquí guardará "Blister 2x1"
          unitType: finalUnitType, // Aquí guardará "Y"
          quantity: 1 
        }] 
      });
    }
    toast.success(`Agregado: ${finalPresentation}`);
},

    removeFromCart: (id, unitType) => set({ 
      cart: get().cart.filter(item => 
        // Borra solo si coincide el ID Y el tipo (Y/N)
        !(item.IdProducto === id && item.unitType === unitType)
      ) 
    }),

    updateQuantity: (id, unitType, amount) => {
      const { cart } = get();
      set({
        cart: cart.map(item => 
          (item.IdProducto === id && item.unitType === unitType)
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) } 
            : item
        )
      });
    },


      clearCart: () => set({ cart: [] }),

      // PROCESO DE ENVÍO
      sendQuote: async (formData) => {
        const { cart } = get();
        
        // 1. Preparamos la data usando el Modelo
        const dataParaEnviar = VentasModels.prepararCotizacion(formData, cart);

        try {
          // 2. Llamada al API
          const respuesta = await solicitarCotizador(dataParaEnviar);
          
          if (respuesta.Resultado) {
            get().clearCart(); // Limpiar si tuvo éxito
            return { success: true, message: respuesta.Mensaje };
          } else {
            return { success: false, message: respuesta.Mensaje || "Error en el servidor" };
          }
        } catch (error) {
          console.error("Error técnico:", error);
          return { success: false, message: "Error de conexión con el servicio de ventas" };
        }
      }
    }),
    { name: 'cart-storage',
      
          onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);

     }
     }
  )
);

export default useCartStore;