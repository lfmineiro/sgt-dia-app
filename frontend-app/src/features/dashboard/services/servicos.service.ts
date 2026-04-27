import { api } from "../../../services/api";

interface PayloadNovoServico {
  data: string;
  membros: {
    alunoNumero: number
    funcao: string
  }[]
}

export const criarNovoServico = async (payload: PayloadNovoServico) => {
  const response = await api.post('/servicos', payload);
  return response.data;
};

export interface ServicoAtualSgtDiaDTO {
  servicoId: string
  dataServico: string
  statusServico: "EM_ANDAMENTO" | "FECHADO"
  numero: number
  nomeGuerra: string
  nomeCompleto: string
  anoFormatura: number
  curso: string | null
}

export const buscarSgtDeDia = async (): Promise<ServicoAtualSgtDiaDTO | null> => {
  try {
    const response = await api.get<ServicoAtualSgtDiaDTO>('/servicos/atual');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Sargento de Dia:", error);
    return null;
  }
};
