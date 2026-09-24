import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { ApiMobil } from '../api/apiInstance';
import { AppConfig } from '../config/AppConfig';

const obtenerResenasGenerales = async () => {
  const { data } = await ApiMobil.get(
    '/api/PaginaWeb/GetResenasGenerales'
  );

  return Array.isArray(data) ? data : [];
};

const crearResenaGeneral = async (datosResena) => {
  const cuerpo = {
    IdCompañia: AppConfig.idCompania,
    NombrePublico: datosResena.NombrePublico.trim(),
    Correo: datosResena.Correo.trim(),
    Calificacion: Number(datosResena.Calificacion),
    Comentario: datosResena.Comentario.trim(),
    AceptarPublicacion: Boolean(
      datosResena.AceptarPublicacion
    ),
  };

  const { data } = await ApiMobil.post(
    '/api/PaginaWeb/CrearResenaGeneral',
    cuerpo
  );

  return data;
};

export const useResenasGenerales = () => {
  const consultaResenas = useQuery({
    queryKey: ['resenas-generales'],
    queryFn: obtenerResenasGenerales,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const crearResena = useMutation({
    mutationFn: crearResenaGeneral,
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
