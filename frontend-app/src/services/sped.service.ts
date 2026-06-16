import { api } from "./api";

export interface CriarSpedPayload {
  servicoId: string;
  companhia: number;
}

export interface AtualizarSpedPayload {
  recebimento?: string;
  passagem?: string;
  armamento?: string;
  punidos?: string;
  visitaMedica?: string;
  alunosDispensa?: string;
  materialCarga?: string;
  refeicoes?: string;
  ronda?: string;
  revistaRecolher?: string;
  ocorrencias?: string;
}

export interface SpedTextosPadrao {
  recebimento: string;
  passagem: string;
  armamento: string;
}

export interface SpedResponse {
  id?: string;
  servicoId: string;
  companhia: number;
  recebimento?: string | null;
  passagem?: string | null;
  armamento?: string | null;
  punidos?: string | null;
  visitaMedica?: string | null;
  alunosDispensa?: string | null;
  materialCarga?: string | null;
  refeicoes?: string | null;
  ronda?: string | null;
  revistaRecolher?: string | null;
  ocorrencias?: string | null;
  textosPadrao?: SpedTextosPadrao;
}

export interface SpedTextoResponse {
  texto: string;
}

/**
 * Cria ou obtém um SPED existente
 */
export const criarSped = async (
  payload: CriarSpedPayload,
): Promise<SpedResponse | null> => {
  try {
    const response = await api.post<SpedResponse>("/servicos/sped", payload);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao criar SPED: ", error);
    return null;
  }
};

/**
 * Obtém um SPED existente
 */
export const obterSped = async (
  servicoId: string,
  companhia: number,
): Promise<SpedResponse | null> => {
  try {
    const response = await api.get<SpedResponse>(
      `/servicos/${servicoId}/sped/${companhia}`,
    );
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter SPED: ", error);
    return null;
  }
};

/**
 * Atualiza um SPED existente
 */
export const atualizarSped = async (
  servicoId: string,
  companhia: number,
  payload: AtualizarSpedPayload,
): Promise<SpedResponse | null> => {
  try {
    const response = await api.put<SpedResponse>(
      `/servicos/${servicoId}/sped/${companhia}`,
      payload,
    );
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao atualizar SPED: ", error);
    return null;
  }
};

/**
 * Gera e obtém o texto formatado do SPED
 */
export const obterTextoSped = async (
  servicoId: string,
  companhia: number,
): Promise<string | null> => {
  try {
    const response = await api.get<SpedTextoResponse>(
      `/servicos/${servicoId}/sped/${companhia}/texto`,
    );
    if (response.data?.texto) {
      return response.data.texto;
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter texto do SPED: ", error);
    return null;
  }
};
