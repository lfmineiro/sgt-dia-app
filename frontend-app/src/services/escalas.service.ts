import { api } from './api';

export interface EscalaLinha {
  id: string;
  membroGuarnicaoId: string;
  posto: string;
  turno: number;
  horario: string;
  aluno: string;
  quarto: string | null;
  cama: string | null;
  nr: number;
}

export interface ConfigurarEscalaAlocacao {
  membroGuarnicaoId: string;
  turno?: number;
  quarto?: string | null;
  cama?: string | null;
}

export interface ConfigurarEscalaPayload {
  posto: string;
  alocacoes: ConfigurarEscalaAlocacao[];
}

export interface AtualizarEscalaPayload {
  quarto?: string | null;
  cama?: string | null;
}

export interface BuscarMembrosEscalaParams {
  busca?: string;
  servicoId?: string;
  limit?: number;
}

export interface MembroEscalaOption {
  id: string;
  servicoId: string;
  funcao: string;
  nr: number;
  alunoNomeGuerra: string;
  alunoNomeCompleto: string;
  label: string;
}

export const configurarPostoEscalaService = async (
  payload: ConfigurarEscalaPayload,
): Promise<EscalaLinha[]> => {
  const response = await api.post('/escalas/configurar', payload);
  return response.data;
};

export const listarEscalasPorPostoService = async (
  posto: string,
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