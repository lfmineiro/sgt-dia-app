import { api } from "./api"
import type { Alteracao, StatusAlteracao } from "../types/alteracao.types"

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

export const atualizarStatusAlteracao = async (
  alteracaoId: string,
  status: StatusAlteracao = "RESOLVIDA"
): Promise<Alteracao | null> => {
  
  try {
    const response = await api.patch(`api/alteracoes/${alteracaoId}/status`, { status })
    if(response.data) { return response.data }
    return null
  } catch (error) {
    console.error("Erro ao atualizar status da alteracao: ", error)
    return null
  }
}