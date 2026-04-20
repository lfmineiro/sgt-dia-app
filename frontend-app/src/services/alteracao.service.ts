import { api } from "./api"

export interface Alteracao {
  id: string,
  descricao: string,
  local: string,
  fotoUrl: string,

}


export const fetchAlteracoes = async (): Promise<Alteracao[] | null> => {
  try {
    const response = await api.get('/alteracoes')
    if(response.data) {
      return response.data
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar alterações: ", error)
    return null
  }
}