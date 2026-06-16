import { FUNCAO_LABELS, MESES_PT, VALOR_AUSENTE } from "../constants/sped.js"

export const funcaoLabel = (funcao: string): string =>
  FUNCAO_LABELS[funcao] ?? funcao

export const postoRank = (postoRaw?: string): number => {
  switch (postoRaw) {
    case "ALA_3_PISO": return 0
    case "ALA_4_PISO": return 1
    case "ALA_5_PISO": return 2
    case "SEG_FEM":    return 3
    default:           return 4
  }
}

export const formatDatePt = (d?: Date | string | null): string => {
  if (!d) return ""
  const date = d instanceof Date ? d : new Date(d)
  const day = date.getDate()
  const month = MESES_PT[date.getMonth()] ?? ""
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

export const safeValue = (v?: string | null): string =>
  v && v.trim() !== "" ? v : VALOR_AUSENTE
