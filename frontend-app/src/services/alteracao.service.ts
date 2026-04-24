import { api } from "./api"

export interface Alteracao {
  id: string,
  descricao: string,
  local: string,
  fotoUrl: string | null,
  comodo: string,
}

export interface CriarAlteracaoInput {
  descricao: string
  local: string
  comodo: string
  fotoUrl: string | null
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