import { api } from "./api"
import type { Alteracao, CriarAlteracaoInput, PayloadUploadFoto, StatusAlteracao } from "../types/alteracao.types"

const urlAlteracoes = 'api/alteracoes'

export const fetchAlteracoes = async (): Promise<Alteracao[] | null> => {
  try {
    const response = await api.get(urlAlteracoes)
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
    const response = await api.patch(`${urlAlteracoes}/${alteracaoId}/status`, { status })
    if(response.data) { return response.data }
    return null
  } catch (error) {
    console.error("Erro ao atualizar status da alteracao: ", error)
    return null
  }
}


export const uploadFotoAlteracao = async (imagemUri: string): Promise<PayloadUploadFoto | null> => {
  
  const formData = new FormData()
  formData.append(
    "foto",
    {
      uri: imagemUri,
      name:`alteracao-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any
  )
  const response = await api.post(`${urlAlteracoes}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data?.fotoUrl && response.data?.publicId) {
      return {
        fotoUrl: response.data.fotoUrl,
        publicId: response.data.publicId,
      }
    }
  return null
}

export const criarAlteracao = async (payload: CriarAlteracaoInput): Promise<Alteracao | null> => {
  try {
    const response = await api.post(urlAlteracoes, payload)
    if(response.data) { return response.data }
    return null
  } catch (error) {
    console.error("Erro ao criar alteracao: ", error)
    return null
  }
}