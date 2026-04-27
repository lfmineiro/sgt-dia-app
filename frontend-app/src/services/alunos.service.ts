import { api } from './api';

export const buscarAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};