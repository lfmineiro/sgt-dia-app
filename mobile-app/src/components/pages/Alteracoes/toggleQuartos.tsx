import { getSetorByAba, MAPEAMENTO_QUARTOS } from "@/src/constants/locais"
import { ComodoCard } from "./ComodoCard"
import type { ToggleQuartosProps } from "@/src/types/components.types"

export const ToggleQuartos = ({ abaAtiva, alteracoes, handleResolverAlteracao, onAbrirModal }: ToggleQuartosProps) => {
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
        comodoId={comodo.id}
        status={statusLabel}
        alteracoes={alteracoesFiltradas}
        onResolverAlteracao={handleResolverAlteracao}
        onAbrirModalAdicionar={onAbrirModal}
        /> 

      )
    })
  )
}