import type { Setor } from "../constants/locais"

export interface Alteracao {
  id: string,
  descricao: string,
  local: Setor,
  fotoUrl: string | null,
  comodo: string,
}

export interface CriarAlteracaoInput {
  descricao: string
  local: Setor
  comodo: string
  fotoUrl: string | null
}