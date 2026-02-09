import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { solicitarCotizador } from 'api/VentasApi';
import { VentasModels } from 'api/ventasModels';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) => item.IdProducto === product.IdProducto && item.unitType === product.unitType
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.IdProducto === product.IdProducto && item.unitType === product.unitType
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          });
        } else {
          // 🔥 Aseguramos que se guarden estas propiedades fundamentales
          set({ 
            cart: [
              ...cart, 
              { 
                ...product, 
                quantity: 1,
                presentationSelected: product.presentationSelected || product.Unidad || 'Unidad',
                unitType: product.unitType || 'Y'
              }
            ] 
          });
        }
      },

      removeFromCart: (productId, unitType) => {
        set({
          cart: get().cart.filter(
            (item) => !(item.IdProducto === productId && item.unitType === unitType)
          ),
        });
      },

      updateQuantity: (productId, unitType, amount) => {
        const cart = get().cart;
        set({
          cart: cart.map((item) => {
            if (item.IdProducto === productId && item.unitType === unitType) {
              const newQty = (item.quantity || 1) + amount;
              return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ cart: [] }),

      sendQuote: async (userData) => {
        const currentCart = get().cart;
        let miDocumento = VentasModels.crearDocAuxDTO();
        miDocumento.Encabezado = VentasModels.crearDocDTO();
        
        miDocumento.Encabezado.NombreCliente = `${userData.name} ${userData.lastname}`;
        miDocumento.Encabezado.U_DoctoNIT = userData.nit;
        miDocumento.Encabezado.U_NumTel = userData.phone;
        miDocumento.Encabezado.U_Correo = userData.email;
        miDocumento.Encabezado.Comments = `Empresa: ${userData.company}. Dirección: ${userData.address}`;

        currentCart.forEach(item => {
          miDocumento.Detalle.push(
            VentasModels.crearDocDetalleDTO(
              item.IdProducto, 
              item.quantity, 
              0,
              item.unitType 
            )
          );
        });

        try {
          const res = await solicitarCotizador(miDocumento);
          if (res.Resultado) {
            get().clearCart();
            return { success: true, message: res.Mensaje, docEntry: res.DocEntry };
          }
          return { success: false, message: res.Mensaje };
        } catch (error) {
          return { success: false, message: "Error de conexión con el servidor" };
        }
      },
    }),
    {
      name: 'disdel-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  )
);

export default useCartStore;