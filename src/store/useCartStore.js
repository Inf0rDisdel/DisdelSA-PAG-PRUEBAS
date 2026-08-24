import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast'; 
import { solicitarCotizador } from '../api/VentasApi'; // Revisa que la ruta sea correcta
import { VentasModels } from '../api/ventasModels'; 

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product, quantityToAdd = 1) => {
        const { cart } = get();
        const finalPresentation = product.presentationSelected || (product.Unidad || product.Empaque || 'Unidad');
        const finalUnitType = product.unitType || (product.Unidad ? 'Y' : 'N');
        const productId = product.IdProducto || product.id;
        const parsedQuantity = Number.parseInt(quantityToAdd, 10);
        const finalQuantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0
          ? parsedQuantity
          : 1;

        const existingItem = cart.find(item => 
          item.IdProducto === productId && item.unitType === finalUnitType
        );
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              (item.IdProducto === productId && item.unitType === finalUnitType)
                ? { ...item, quantity: (item.quantity || 1) + finalQuantity } : item
            )
          });
        } else {
          set({ 
            cart: [...cart, { 
              ...product, 
              IdProducto: productId,
              presentationSelected: finalPresentation,
              unitType: finalUnitType,
              quantity: finalQuantity
            }] 
          });
        }
        toast.success(
          `${finalQuantity} ${finalQuantity === 1 ? 'unidad agregada' : 'unidades agregadas'}: ${finalPresentation}`,
          { position: 'top-center' }
        );
      },

      removeFromCart: (id, unitType) => set({ 
        cart: get().cart.filter(item => !(item.IdProducto === id && item.unitType === unitType)) 
      }),

      updateQuantity: (id, unitType, amount) => {
        const { cart } = get();
        set({
          cart: cart.map(item => 
            (item.IdProducto === id && item.unitType === unitType)
              ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) } : item
          )
        });
      },

      clearCart: () => set({ cart: [] }),

      // 🔥 ESTA FUNCIÓN AHORA SÍ DISPARA EL CORREO
      sendQuote: async (userData) => {
        const { cart } = get();
        
        // Usamos el modelo para construir el paquete exacto que quiere el servidor
        const dataParaEnviar = VentasModels.prepararCotizacion(userData, cart);

        try {
          const res = await solicitarCotizador(dataParaEnviar);
          
          if (res && res.Resultado) {
            get().clearCart();
            return { success: true, message: res.Mensaje };
          }
          return { success: false, message: res?.Mensaje || "Error en el servidor de correos" };
        } catch (error) {
          console.error("Error técnico:", error);
          return { success: false, message: "Error de conexión. Intente más tarde." };
        }
      }
    }),
    { 
      name: 'disdel-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state.setHasHydrated(true)
    }
  )
);

export default useCartStore;
