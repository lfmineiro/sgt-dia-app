import type { Setor } from "../constants/locais"

export type StatusAlteracao = "NOVA" | "PENDENTE" | "RESOLVIDA"

export interface Alteracao {
  id: string,
  descricao: string,
  local: Setor,
  fotoUrl: string | null,
  comodo: string,
  status: StatusAlteracao
}

export interface CriarAlteracaoInput {
  descricao: string
  local: Setor
  comodo: string
  fotoUrl: string | null
}

export interface PayloadUploadFoto {fotoUrl: string, publicId: string}

export interface CriarAlteracaoParams {
  descricao: string
  imagemUri: string | null
  local: Setor
  comodo: string
}
