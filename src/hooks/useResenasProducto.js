import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiMobil } from '../api/apiInstance';
import { AppConfig } from '../config/AppConfig';

const normalizarIdProducto = (idProducto) => {
  if (idProducto === null || idProducto === undefined) {
    return '';
  }

  return String(idProducto).trim().toUpperCase();
};

const obtenerResenasProducto = async (idProducto) => {
  const codigoProducto = normalizarIdProducto(idProducto);

  if (!codigoProducto) {
    return [];
  }

  const { data } = await ApiMobil.get(
    `/api/PaginaWeb/GetResenasProducto/${encodeURIComponent(codigoProducto)}`
  );

  return Array.isArray(data) ? data : [];
};

const crearResenaProducto = async ({
  idProducto,
  datosResena,
}) => {
  const codigoProducto = normalizarIdProducto(idProducto);

  if (!codigoProducto) {
    throw new Error('El código del producto es obligatorio.');
  }

  const cuerpo = {
    IdCompañia: AppConfig.idCompania,
    NombrePublico: datosResena.NombrePublico,
    Correo: datosResena.Correo,
    Calificacion: Number(datosResena.Calificacion),
    Comentario: datosResena.Comentario,
    AceptarPublicacion: Boolean(
      datosResena.AceptarPublicacion
    ),
  };

  const { data } = await ApiMobil.post(
    `/api/PaginaWeb/CrearResenaProducto/${encodeURIComponent(
      codigoProducto
    )}`,
    cuerpo
  );

  return data;
};

export const useResenasProducto = (idProducto) => {
  const queryClient = useQueryClient();
  const codigoProducto = normalizarIdProducto(idProducto);
  const consultaHabilitada = Boolean(codigoProducto);

  const consultaResenas = useQuery({
    queryKey: ['resenas-producto', codigoProducto],
    queryFn: () => obtenerResenasProducto(codigoProducto),
    enabled: consultaHabilitada,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const crearResena = useMutation({
    mutationFn: (datosResena) =>
      crearResenaProducto({
        idProducto: codigoProducto,
        datosResena,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['resenas-producto', codigoProducto],
      });

      queryClient.invalidateQueries({
        queryKey: ['producto-detalle', codigoProducto.toLowerCase()],
      });
    },
  });

  return {
    resenas: consultaResenas.data ?? [],

    estaCargando: consultaResenas.isLoading,

    ocurrioError: consultaResenas.isError,

    error: consultaResenas.error,

    enviarResena: crearResena.mutateAsync,
    estaEnviando: crearResena.isPending,
    errorEnvio: crearResena.error,
  };
};
