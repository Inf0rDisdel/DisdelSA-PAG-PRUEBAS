// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { solicitarCotizador } from 'api/VentasApi';
import { VentasModels } from 'api/ventasModels';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        const { cart } = get();
        const found = cart.find(item => item.id === product.id);
        if (found) {
          set({ cart: cart.map(item => item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } : item) 
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => set({ cart: get().cart.filter(item => item.id !== id) }),

      updateQuantity: (id, delta) => set({
        cart: get().cart.map(item => item.id === id 
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item)
      }),

      clearCart: () => set({ cart: [] }),

      // PROCESO DE COTIZACIÓN
      sendQuote: async (formData) => {
        const { cart } = get();
        
        // 1. Usamos tu modelo base
        const dataParaEnviar = VentasModels.crearDocAuxDTO();

        // 2. Llenamos el Encabezado (Quitamos captcha como pediste)
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

        // 3. Mapeamos el detalle usando tu modelo de detalle
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