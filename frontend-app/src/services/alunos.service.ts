import { api } from './api';

export interface Aluno {
  numero: number;
  nomeGuerra: string;
  nomeCompleto: string;
  anoFormatura: number
  curso: string
}

// Vamos pegar apenas o primeiro aluno da lista para testar
export const buscarSargentoDeDia = async (): Promise<Aluno | null> => {
  try {
    const response = await api.get('/alunos');
    if (response.data && response.data.length > 0) {
      console.log(response.data)
      return response.data[0]; 
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar Sargento de Dia:", error);
    return null;
  }
};