import { useEffect, useState } from "react"
import { Alteracao } from "../types/alteracao.types"
import { fetchAlteracoes } from "../services/alteracao.service"

export const useAlteracoes = () => {
  const [alteracoes, setAlteracoes] = useState<Alteracao[] | null>([])

  const carregarDados = async () => {
    const dados = await fetchAlteracoes() 
    setAlteracoes(dados)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return { alteracoes, refetch: carregarDados }
}