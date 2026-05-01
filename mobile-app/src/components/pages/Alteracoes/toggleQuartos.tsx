import { getSetorByAba, MAPEAMENTO_QUARTOS } from "@/src/constants/locais"
import { ComodoCard } from "./comodoCard"

type ToggleQuartosProps = {
  abaAtiva: string
}

export const ToggleQuartos = ({ abaAtiva }: ToggleQuartosProps) => {
  const setorChave = getSetorByAba(abaAtiva)

  const comodos = MAPEAMENTO_QUARTOS[setorChave]

  return (
    comodos.map((comodo) => {
      return (
        <ComodoCard
        key={comodo.id}
        nomeComodo={comodo.label}
        status="Pendente"
        onPress={() => console.log('Vai abrir o toggle')}
        /> 

      )
    })
  )
}