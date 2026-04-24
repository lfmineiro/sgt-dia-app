import type { Aluno } from '../types/aluno.types';
import { api } from './api';


// Vamos pegar apenas o primeiro aluno da lista para testar
export const buscarSargentoDeDia = async (): Promise<Aluno | null> => {
  try {
    const response = await api.get('/alunos');
    if (response.data && response.data.length > 0) {
      // console.log(response.data)
      return response.data[0]; 
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar Sargento de Dia:", error);
    return null;
  }
};

export const buscarAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};