import { api } from './api';
import type { SetorLocal } from '../constants/setor-local';
import type {
  AtualizarEscalaPayload,
  BuscarMembrosEscalaParams,
  ConfigurarEscalaPayload,
  EscalaLinha,
  MembroEscalaOption,
} from '../types/escala.types';

export type {
  AtualizarEscalaPayload,
  BuscarMembrosEscalaParams,
  ConfigurarEscalaPayload,
  EscalaLinha,
  MembroEscalaOption,
} from '../types/escala.types';

export const configurarPostoEscalaService = async (
  payload: ConfigurarEscalaPayload,
): Promise<EscalaLinha[]> => {
  const response = await api.post('/escalas/configurar', payload);
  return response.data;
};

export const listarEscalasPorPostoService = async (
  posto: SetorLocal,
): Promise<EscalaLinha[]> => {
  const response = await api.get(`/escalas/${encodeURIComponent(posto)}`);
  return response.data;
};

export const atualizarEscalaService = async (
  id: string,
  payload: AtualizarEscalaPayload,
): Promise<EscalaLinha> => {
  const response = await api.patch(`/escalas/${id}`, payload);
  return response.data;
};

export const buscarMembrosEscalaService = async (
  params: BuscarMembrosEscalaParams = {},
): Promise<MembroEscalaOption[]> => {
  const response = await api.get('/escalas/membros', { params });
  return response.data;
};