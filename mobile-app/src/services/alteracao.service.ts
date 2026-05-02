import { api } from "./api"
import type { Alteracao } from "../types/alteracao.types"

export const fetchAlteracoes = async (): Promise<Alteracao[] | null> => {
  try {
    const response = await api.get('api/alteracoes')
    if(response.data) {
      return response.data
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar alterações: ", error)
    return null
  }
}