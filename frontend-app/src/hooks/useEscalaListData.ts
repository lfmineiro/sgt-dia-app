import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SetorLocal } from '../constants/setor-local';
import { buscarMembrosEscalaService, listarEscalasPorPostoService } from '../services/escalas.service';
import type { MembroEscalaOption } from '../types/escala.types';
import {
  deduplicarMembrosPorNr,
  filtrarMembrosPorTermo,
  labelDoMembro,
} from '../utils/escala.helpers';

const formatarDataExtenso = () => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
};

export const useEscalaListData = (postoAtivo: SetorLocal) => {

  const dataExtenso = useMemo(() => formatarDataExtenso(), []);

  const escalasQuery = useQuery({
    queryKey: ['escalas', postoAtivo],
    queryFn: () => listarEscalasPorPostoService(postoAtivo),
  });

  const membrosQuery = useQuery({
    queryKey: ['escalas-membros'],
    queryFn: () => buscarMembrosEscalaService({ limit: 50 }),
    enabled: true,
  });

  const membrosDisponiveis = useMemo(() => {
    return deduplicarMembrosPorNr(membrosQuery.data ?? []);
  }, [membrosQuery.data]);

  const membrosPorLabel = useMemo(() => {
    const map = new Map<string, MembroEscalaOption>();
    membrosDisponiveis.forEach((membro) => {
      map.set(labelDoMembro(membro), membro);
    });
    return map;
  }, [membrosDisponiveis]);

  const filtrarMembros = (termo: string): MembroEscalaOption[] => {
    return filtrarMembrosPorTermo(termo, membrosDisponiveis);
  };

  return {
    dataExtenso,
    escalasQuery,
    filtrarMembros,
    linhasEscala: escalasQuery.data ?? [],
    membrosDisponiveis,
    membrosPorLabel,
    isCarregandoEscalas: escalasQuery.isLoading,
  };
};
