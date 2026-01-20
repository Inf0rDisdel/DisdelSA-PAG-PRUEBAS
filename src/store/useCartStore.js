import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast'; 
import { solicitarCotizador } from '../api/VentasApi';
import { VentasModels } from '../api/ventasModels'; 

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        const { cart } = get();
        // Normalizamos el ID para la búsqueda
        const productId = product.id || product.disdelId;
        const existingItem = cart.find(item => (item.id || item.disdelId) === productId);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              (item.id || item.disdelId) === productId 
                ? { ...item, quantity: (item.quantity || 1) + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }

        toast.success(`${product.name} agregado`, {
          position: "bottom-right",
          style: { background: '#135eab', color: '#fff', borderRadius: '10px' },
        });
      },

      removeFromCart: (id) => set({ 
        cart: get().cart.filter(item => (item.id || item.disdelId) !== id) 
      }),

      // CORRECCIÓN AQUÍ: Aseguramos que el estado se actualice correctamente
      updateQuantity: (id, amount) => {
        const { cart } = get();
        const updatedCart = cart.map(item => {
          if ((item.id || item.disdelId) === id) {
            const currentQty = item.quantity || 1;
            const newQty = currentQty + amount;
            return { ...item, quantity: newQty < 1 ? 1 : newQty };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),

      sendQuote: async (formData) => {
        const { cart } = get();
        const dataParaEnviar = VentasModels.crearDocAuxDTO();
        
        dataParaEnviar.Encabezado = {
          NombreCliente: formData.company || `${formData.name} ${formData.lastname}`,
          Autor: `${formData.name} ${formData.lastname}`,
          Empresa: formData.company,
          AuxTelefono: formData.phone,
          Correo: formData.email,
          DireccionEntrega: formData.address,
          U_DoctoNIT: "C/F",
          Recaptcha_key: "", 
          PaginaProvenienteRecaptcha: window.location.hostname,
          BaseDatos: "SBO_DISDELSA_2013",
          Almacen: "03",
          TipoCliente: "Minorista"
        };

        // IMPORTANTE: Asegúrate que VentasModels use item.quantity
        dataParaEnviar.Detalle = cart.map(item => VentasModels.crearDocDetalleDTO(item));

        try {
          const respuesta = await solicitarCotizador(dataParaEnviar);
          if (respuesta.Resultado) {
            get().clearCart();
            return { success: true, message: respuesta.Mensaje };
          }
          return { success: false, message: respuesta.Mensaje };
        } catch (error) {
          return { success: false, message: "Error técnico al conectar con SAP" };
        }
      }
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;