import { getSetorByAba, MAPEAMENTO_QUARTOS } from "@/src/constants/locais"
import { ComodoCard } from "./ComodoCard"
import type { Alteracao } from "@/src/types/alteracao.types"
import { useAlteracoes } from "@/src/hooks/useAlteracoes"

type ToggleQuartosProps = {
  abaAtiva: string
  alteracoes: Alteracao[] | null
  handleResolverAlteracao: ((id: string) => void)
}

export const ToggleQuartos = ({ abaAtiva, alteracoes, handleResolverAlteracao }: ToggleQuartosProps) => {
  const setorChave = getSetorByAba(abaAtiva)

  const comodos = MAPEAMENTO_QUARTOS[setorChave]

  return (
    comodos.map((comodo) => {
      const alteracoesFiltradas = alteracoes ? alteracoes?.filter(alt => alt.comodo === comodo.id && alt.status !== "RESOLVIDA") : null
      
      const temAlteracaoPendente =  (alteracoesFiltradas?.length ?? 0) > 0
      
      const statusLabel = temAlteracaoPendente ? "Pendente" : "Verificado"

      return (
        <ComodoCard
        key={comodo.id}
        nomeComodo={comodo.label}
        status={statusLabel}
        alteracoes={alteracoesFiltradas}
        onResolverAlteracao={handleResolverAlteracao}
        /> 

      )
    })
  )
}