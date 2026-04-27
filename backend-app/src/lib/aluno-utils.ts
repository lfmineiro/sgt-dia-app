export const calcularAnoAluno = (
  anoFormatura: number,
  anoAtual: number = new Date().getFullYear(),
): number | undefined => {
  if (typeof anoFormatura !== "number" || Number.isNaN(anoFormatura)) return undefined
  const ano = 5 - (anoFormatura - anoAtual)
  if (!Number.isFinite(ano)) return undefined
  if (ano < 1 || ano > 5) return undefined
  return Math.trunc(ano)
}

export const verificarCompanhiaDoAluno = (
  anoAluno: number | undefined,
  companhia: number,
): boolean => {
  if (typeof anoAluno !== "number") return false
  if (companhia === 1) return anoAluno === 1 || anoAluno === 2
  if (companhia === 2) return anoAluno === 3 || anoAluno === 4
  return false
}

export const ordinal = (n: number) => `${n}º`
