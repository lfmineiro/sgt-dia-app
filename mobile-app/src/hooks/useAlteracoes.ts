import { useEffect, useState } from "react"
import { Alteracao } from "../types/alteracao.types"
import { atualizarStatusAlteracao, fetchAlteracoes } from "../services/alteracao.service"

export const useAlteracoes = () => {
  const [alteracoes, setAlteracoes] = useState<Alteracao[] | null>([])

  const carregarDados = async () => {
    const dados = await fetchAlteracoes() 
    setAlteracoes(dados)
  }

  
  const handleResolverAlteracao = async (alteracaoId: string) => {
    // renderização otimista para melhorar UX
    setAlteracoes(prev => (prev ? prev.filter(alteracao => alteracao.id !== alteracaoId) : prev))
    try{
      const alteracaoAtualizada = await atualizarStatusAlteracao(alteracaoId)
      if(!alteracaoAtualizada) {
        await carregarDados()
        return null
      }
    } catch (error) {    
      console.error("Erro ao atualizar status da alteração: ", error)
      await carregarDados()
      return null

    }
  }

  useEffect(() => {
    carregarDados()
  }, [])
  
  return { 
    alteracoes,
    handleResolverAlteracao,
    refetch: carregarDados
  }
}