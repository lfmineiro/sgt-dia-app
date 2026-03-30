import { api } from "./api";

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
