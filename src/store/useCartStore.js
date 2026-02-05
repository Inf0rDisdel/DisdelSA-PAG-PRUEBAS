import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { solicitarCotizador } from 'api/VentasApi';
import { VentasModels } from 'api/ventasModels';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false, // Flag para saber cuando los datos ya cargaron del disco

      // Función para marcar que ya se cargó la info del LocalStorage
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // AGREGAR AL CARRITO
      addItem: (product) => {
        const cart = get().cart;
        // Buscamos si el producto con esa unidad ya existe
        const existingItem = cart.find(
          (item) => item.IdProducto === product.IdProducto && item.unitType === product.unitType
        );

        if (existingItem) {
          // Si ya existe, solo subimos la cantidad
          set({
            cart: cart.map((item) =>
              item.IdProducto === product.IdProducto && item.unitType === product.unitType
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          });
        } else {
          // Si es nuevo, lo agregamos con cantidad 1
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      // ELIMINAR DEL CARRITO
      removeFromCart: (productId, unitType) => {
        set({
          cart: get().cart.filter(
            (item) => !(item.IdProducto === productId && item.unitType === unitType)
          ),
        });
      },

      // ACTUALIZAR CANTIDADES (+1 o -1)
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

      // VACIAR TODO
      clearCart: () => set({ cart: [] }),

      // ENVIAR COTIZACIÓN A SAP / API
      sendQuote: async (userData) => {
        const currentCart = get().cart;
        
        // Construimos el modelo DTO que requiere tu API
        let miDocumento = VentasModels.crearDocAuxDTO();
        miDocumento.Encabezado = VentasModels.crearDocDTO();
        
        miDocumento.Encabezado.NombreCliente = `${userData.name} ${userData.lastname}`;
        miDocumento.Encabezado.U_DoctoNIT = userData.nit;
        miDocumento.Encabezado.U_NumTel = userData.phone;
        miDocumento.Encabezado.U_Correo = userData.email;
        miDocumento.Encabezado.Comments = `Empresa: ${userData.company}. Dirección: ${userData.address}`;

        // Pasamos los items del carrito al formato de la API
        currentCart.forEach(item => {
          miDocumento.Detalle.push(
            VentasModels.crearDocDetalleDTO(
              item.IdProducto, 
              item.quantity, 
              0, // Precio usualmente se maneja en backend para cotizaciones
              item.unitType // 'Y' o 'N'
            )
          );
        });

        try {
          const res = await solicitarCotizador(miDocumento);
          if (res.Resultado) {
            get().clearCart(); // Si tuvo éxito, vaciamos el carrito
            return { success: true, message: res.Mensaje, docEntry: res.DocEntry };
          }
          return { success: false, message: res.Mensaje };
        } catch (error) {
          return { success: false, message: "Error de conexión con el servidor" };
        }
      },
    }),
    {
      name: 'disdel-cart-storage', // Nombre de la "llave" en LocalStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Cuando termine de leer el disco, avisamos a la App
        state.setHasHydrated(true);
      },
    }
  )
);

export default useCartStore;