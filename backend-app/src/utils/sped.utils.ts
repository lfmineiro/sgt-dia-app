import { FUNCAO_LABELS, MESES_PT, VALOR_AUSENTE } from "../constants/sped.js"

export const funcaoLabel = (funcao: string): string =>
  FUNCAO_LABELS[funcao] ?? funcao

export const postoRank = (postoRaw?: string): number => {
  if (!postoRaw) return 4
  const s = postoRaw.toLowerCase()
  if (s.includes("3")) return 0
  if (s.includes("4")) return 1
  if (s.includes("5")) return 2
  if (s.includes("aloj") && s.includes("fem")) return 3
  return 4
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
