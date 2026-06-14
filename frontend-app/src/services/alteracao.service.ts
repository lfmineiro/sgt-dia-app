import { api } from "./api"
import type {
  AtualizarAlteracaoInput,
  Alteracao,
  CriarAlteracaoInput,
  StatusAlteracao,
} from "../types/alterecao.types"

export const fetchAlteracoes = async (
  params?: Partial<{ status: StatusAlteracao; local: string; comodo: string }>,
): Promise<Alteracao[] | null> => {
  try {
    const response = await api.get('/alteracoes', { params })
    if(response.data) {
      return response.data
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar alterações: ", error)
    return null
  }
}

export const uploadFotoAlteracao = async (
  file: File,
): Promise<{ fotoUrl: string; publicId: string } | null> => {
  try {
    const formData = new FormData()
    formData.append("foto", file)

    const response = await api.post('/alteracoes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data?.fotoUrl && response.data?.publicId) {
      return {
        fotoUrl: response.data.fotoUrl,
        publicId: response.data.publicId,
      }
    }

    return null
  } catch (error) {
    console.error("Erro ao fazer upload da foto da alteração: ", error)
    return null
  }
}

export const criarAlteracao = async (
  payload: CriarAlteracaoInput,
): Promise<Alteracao | null> => {
  try {
    const response = await api.post('/alteracoes', payload)

    if (response.data) {
      return response.data
    }

    return null
  } catch (error) {
    console.error("Erro ao criar alteração: ", error)
    return null
  }
}

export const atualizarAlteracao = async (
  alteracaoId: string,
  payload: AtualizarAlteracaoInput,
): Promise<Alteracao | null> => {
  try {
    const response = await api.patch(`/alteracoes/${alteracaoId}`, payload)

    if (response.data) {
      return response.data
    }

    return null
  } catch (error) {
    console.error("Erro ao atualizar alteração: ", error)
    return null
  }
}

export async function atualizarStatusAlteracao(
  alteracaoId: string,
  status: StatusAlteracao = "RESOLVIDA",
): Promise<Alteracao | null> {
  try {
    const response = await api.patch(`/alteracoes/${alteracaoId}/status`, { status })

    if (response.data) {
      return response.data
    }

    return null
  } catch (error) {
    console.error("Erro ao atualizar status da alteração: ", error)
    return null
  }
}

export const removerAlteracao = async (alteracaoId: string): Promise<boolean> => {
  try {
    await api.delete(`/alteracoes/${alteracaoId}`)
    return true
  } catch (error) {
    console.error("Erro ao remover alteração: ", error)
    return false
  }
}