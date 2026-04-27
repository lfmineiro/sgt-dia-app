import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  LABEL_SETOR,
  MAPEAMENTO_QUARTOS,
  ORDEM_SETORES,
  type Setor,
} from "../constants/locais"
import { fetchAlteracoes } from "../services/alteracao.service"

export const useAlteracoesPage = () => {
  const [setorAtivo, setSetorAtivo] = useState<Setor>(ORDEM_SETORES[0])

  const { data: alteracoes, isLoading, isError } = useQuery({
    queryKey: ["alteracoesAtuais"],
    queryFn: fetchAlteracoes,
  })

  const listaAlteracoes = alteracoes ?? []
  const abaAtiva = LABEL_SETOR[setorAtivo]
  const comodosSetorAtivo = MAPEAMENTO_QUARTOS[setorAtivo]
  const alteracoesSetorAtivo = listaAlteracoes.filter(
    (alteracao) => alteracao.local === setorAtivo,
  )


  return {
    setorAtivo,
    setSetorAtivo,
    listaAlteracoes,
    abaAtiva,
    comodosSetorAtivo,
    alteracoesSetorAtivo,
    isLoading,
    isError,
  }
}
