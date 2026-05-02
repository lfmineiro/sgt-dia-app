import { getSetorByAba, MAPEAMENTO_QUARTOS } from "@/src/constants/locais"
import { ComodoCard } from "./ComodoCard"
import type { Alteracao } from "@/src/types/alteracao.types"

type ToggleQuartosProps = {
  abaAtiva: string
  alteracoes: Alteracao[] | null
}

export const ToggleQuartos = ({ abaAtiva, alteracoes }: ToggleQuartosProps) => {
  const setorChave = getSetorByAba(abaAtiva)

  const comodos = MAPEAMENTO_QUARTOS[setorChave]

  const handleResolverAlteracao = (idAlteracao: string) => {
    // Aqui vai entrar a chamada da API (PATCH) depois!
    console.log("Clicou em resolver a alteração de ID:", idAlteracao);
  };
  
  return (
    comodos.map((comodo) => {
      const temAlteracaoPendente =  alteracoes?.some(
        alt => alt.comodo === comodo.id 
      )
      const alteracoesFiltradas = alteracoes ? alteracoes?.filter(alt => alt.comodo === comodo.id) : null

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