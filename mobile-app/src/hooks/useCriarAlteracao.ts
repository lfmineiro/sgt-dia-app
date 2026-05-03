import { useState } from "react"
import { criarAlteracao, uploadFotoAlteracao } from "../services/alteracao.service"
import type { CriarAlteracaoParams } from "../types/alteracao.types"

type UseCriarAlteracaoParams = {
  onSucesso?: () => void | Promise<void>
}

export const useCriarAlteracao = ({ onSucesso }: UseCriarAlteracaoParams) => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleCriarAlteracao = async ({
      descricao,
      imagemUri,
      local,
      comodo,
    }: CriarAlteracaoParams): Promise<boolean> => {
      const descricaoLimpa = descricao.trim()
      if(!descricaoLimpa) return false
    
      setIsSubmitting(true)
      setErro(null)
      
      try{

        let fotoUrl: string | null = null
    
        if(imagemUri) {
          const upload = await uploadFotoAlteracao(imagemUri)
          if (!upload) {
            setErro("Não foi possível enviar a foto.")
            return false
          }
          fotoUrl = upload.fotoUrl
        }
        const novaAlteracao = await criarAlteracao({
          descricao: descricaoLimpa,
          local,
          comodo,
          fotoUrl
        })
    
        if(!novaAlteracao) {
          setErro("Não foi possível criar a alteração.")
          return false
        }
        await onSucesso?.()
        return true
      } catch (error) {
        console.error("Erro ao criar alteração: ", error)
        setErro("Não foi possível criar a alteração.")
        return false
      } finally {
      setIsSubmitting(false)
    }
    }
  
    return { 
      handleCriarAlteracao,
      isSubmitting,
      erro
     }
}