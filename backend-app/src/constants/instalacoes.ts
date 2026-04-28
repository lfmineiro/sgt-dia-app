import { SetorLocal } from "@prisma/client"

export const INSTALACOES_POR_COMPANHIA: Record<number, Array<{ local: SetorLocal; label: string }>> = {
  1: [
    { local: SetorLocal.SEG_FEM, label: "Alojamento Feminino" },
    { local: SetorLocal.ALA_5_PISO, label: "ALA 5º PISO" },
  ],
  2: [
    { local: SetorLocal.ALA_3_PISO, label: "ALA 3º PISO" },
    { local: SetorLocal.ALA_4_PISO, label: "ALA 4º PISO" },
  ],
}

export const TEXTO_PENDENTES = "Conforme documento em anexo e planilha no seguinte link"

export default INSTALACOES_POR_COMPANHIA
