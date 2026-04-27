import { prisma } from "../lib/prisma.js"
import { calcularAnoAluno, verificarCompanhiaDoAluno, ordinal } from "../lib/aluno-utils.js"
import type { AtualizarSpedInput } from "../schemas/speds.schemas.js"

export const obterOuCriarSpedService = async (
  servicoId: string,
  companhia: number,
) => {
  const spedExistente = await prisma.sped.findFirst({
    where: { servicoId, companhia },
  })

  if (spedExistente) {
    return spedExistente
  }

  const novoSped = await prisma.sped.create({
    data: {
      servicoId,
      companhia,
      recebimento: "",
      passagem: "",
    },
  })

  return novoSped
}

export const atualizarSpedService = async (
  servicoId: string,
  companhia: number,
  dados: AtualizarSpedInput,
) => {
  const spedExistente = await prisma.sped.findUnique({
    where: {
      servicoId_companhia: {
        servicoId,
        companhia,
      },
    },
  })

  if (!spedExistente) {
    throw new Error("SPED_NAO_ENCONTRADO")
  }

  return await prisma.sped.update({
    where: {
      servicoId_companhia: {
        servicoId,
        companhia,
      },
    },
    data: dados,
  })
}

export const gerarTextoSpedService = async (
  servicoId: string,
  companhia: number,
): Promise<string> => {
  const servico = await prisma.servico.findUnique({
    where: { id: servicoId },
    include: {
      membrosGuarnicao: {
        include: { aluno: true, escalas: true },
      },
    },
  })

  if (!servico) throw new Error("SERVICO_NAO_ENCONTRADO")

  // map enum funcao -> label
  const funcaoLabel = (funcao: string) => {
    switch (funcao) {
      case "SGT_DIA":
        return "Sgt de dia"
      case "CB_DIA":
        return "Cb de dia"
      case "PLANTAO":
        return "Plantões"
      case "PERMANENCIA":
        return "Permanência"
      default:
        return funcao
    }
  }

  const postoRank = (postoRaw?: string) => {
    if (!postoRaw) return 4
    const s = postoRaw.toLowerCase()
    if (s.includes("3")) return 0
    if (s.includes("4")) return 1
    if (s.includes("5")) return 2
    if (s.includes("aloj") && s.includes("fem")) return 3
    return 4
  }

  // filter by companhia and compute ano
  const militares = servico.membrosGuarnicao
    .map((m) => {
      const ano = calcularAnoAluno(m.aluno.anoFormatura)
      return { membro: m, ano }
    })
    .filter(({ ano }) => verificarCompanhiaDoAluno(ano, companhia))

  if (militares.length === 0) return ""

  // group by funcao + posto (use first escala if present)
  const groups = new Map<string, Array<{ nome: string; ano: number; curso?: string }>>()

  for (const { membro, ano } of militares) {
    if (!ano) continue
    const func = funcaoLabel(membro.funcao)
    const postoRaw = membro.escalas?.[0]?.posto
    const postoDisplay = postoRaw ?? "Sem posto"
    const key = `${func} ${postoDisplay}`
    const lista = groups.get(key) ?? []
    const item: { nome: string; ano: number; curso?: string } = { nome: membro.aluno.nomeGuerra, ano }
    if (membro.aluno.curso) item.curso = membro.aluno.curso
    lista.push(item)
    groups.set(key, lista)
  }

  // Sort keys by posto order and funcao (stable)
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    const funcA = (a.split(" ")[0] ?? "") as string
    const funcB = (b.split(" ")[0] ?? "") as string
    const postoLabelA = a.replace(`${funcA} `, "")
    const postoLabelB = b.replace(`${funcB} `, "")
    const r = postoRank(postoLabelA) - postoRank(postoLabelB)
    if (r !== 0) return r
    return funcA.localeCompare(funcB)
  })

  const lines: string[] = []

  for (const key of sortedKeys) {
    const items = groups.get(key) ?? []
    // order by nomeGuerra
    items.sort((x, y) => x.nome.localeCompare(y.nome))
    const parts = items.map((it) => `Alu ${ordinal(it.ano)} Ano ${it.curso ?? "CFG"} ${it.nome}`)
    lines.push(`${key}: ${parts.join("; ")};`)
  }

  return lines.join("\n")
}


