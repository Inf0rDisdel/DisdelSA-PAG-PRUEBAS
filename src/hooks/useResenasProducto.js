import {
  useMutation,
  useQuery,
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

const obtenerResumenResenasProducto = async (idProducto) => {
  const codigoProducto = normalizarIdProducto(idProducto);

  if (!codigoProducto) {
    return {
      TotalResenas: 0,
      Promedio: 0,
    };
  }

  const { data } = await ApiMobil.get(
    `/api/PaginaWeb/GetResumenResenasProducto/${encodeURIComponent(
      codigoProducto
    )}`
  );

  return {
    TotalResenas: Number(data?.TotalResenas ?? 0),
    Promedio: Number(data?.Promedio ?? 0),
  };
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

  const consultaResumen = useQuery({
    queryKey: ['resumen-resenas-producto', codigoProducto],
    queryFn: () =>
      obtenerResumenResenasProducto(codigoProducto),
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
  });

  return {
    resenas: consultaResenas.data ?? [],

    resumen: consultaResumen.data ?? {
      TotalResenas: 0,
      Promedio: 0,
    },

    estaCargando:
      consultaResenas.isLoading ||
      consultaResumen.isLoading,

    ocurrioError:
      consultaResenas.isError ||
      consultaResumen.isError,

    error:
      consultaResenas.error ||
      consultaResumen.error,

    enviarResena: crearResena.mutateAsync,
    estaEnviando: crearResena.isPending,
    errorEnvio: crearResena.error,
  };
};
