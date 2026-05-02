import { getSetorByAba, MAPEAMENTO_QUARTOS } from "@/src/constants/locais"
import { ComodoCard } from "./comodoCard"
import type { Alteracao } from "@/src/types/alteracao.types"

type ToggleQuartosProps = {
  abaAtiva: string
  alteracoes: Alteracao[] | null
}

export const ToggleQuartos = ({ abaAtiva, alteracoes }: ToggleQuartosProps) => {
  const setorChave = getSetorByAba(abaAtiva)

  const comodos = MAPEAMENTO_QUARTOS[setorChave]

  
  return (
    comodos.map((comodo) => {
      const temAlteracaoPendente =  alteracoes?.some(
        alt => alt.comodo === comodo.id 
      )
      const statusLabel = temAlteracaoPendente ? "Pendente" : "Verificado"
      return (
        <ComodoCard
        key={comodo.id}
        nomeComodo={comodo.label}
        status={statusLabel}
        onPress={() => console.log('Vai abrir o toggle')}
        /> 

      )
    })
  )
}