import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  LABEL_SETOR,
  MAPEAMENTO_QUARTOS,
  ORDEM_SETORES,
  type Setor,
} from "../constants/locais"
import { fetchAlteracoes } from "../services/alteracao.service"
import type { Alteracao } from "../types/alterecao.types"

export const useAlteracoesPage = () => {
  const [setorAtivo, setSetorAtivo] = useState<Setor>(ORDEM_SETORES[0])

  const { data: alteracoes = [], isLoading, isError } = useQuery<Alteracao[]>({
    queryKey: ["alteracoesAtuais"],
    queryFn: async () => {
      const result = await fetchAlteracoes()
      return result ?? []
    },
  })

  const listaAlteracoes = alteracoes as Alteracao[]
  const abaAtiva = LABEL_SETOR[setorAtivo]
  const comodosSetorAtivo = MAPEAMENTO_QUARTOS[setorAtivo]
  const alteracoesSetorAtivo = listaAlteracoes.filter(
    (alteracao: Alteracao) => alteracao.local === setorAtivo,
  )

  const alteracoesPendentesSetorAtivo = alteracoesSetorAtivo.filter(
    (alteracao: Alteracao) => alteracao.status !== 'RESOLVIDA',
  )

  return {
    setorAtivo,
    setSetorAtivo,
    listaAlteracoes,
    abaAtiva,
    comodosSetorAtivo,
    alteracoesSetorAtivo,
    alteracoesPendentesSetorAtivo,
    isLoading,
    isError,
  }
}
