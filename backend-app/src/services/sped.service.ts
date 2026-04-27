import { prisma } from "../lib/prisma.js"
import { calcularAnoAluno, verificarCompanhiaDoAluno, ordinal } from "../lib/aluno-utils.js"
import type { AtualizarSpedInput } from "../schemas/speds.schemas.js"
import { buscarAlteracoesPorServico } from "./alteracao.service.js"
import { listarServicoAtualService } from "./servicos.service.js"
import { INSTALACOES_POR_COMPANHIA, TEXTO_PENDENTES } from "../constants/instalacoes.js"

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
  const alunosTexto = await gerarTextoAlunosService(servicoId, companhia)
  const instalacoesTexto = await gerarTextoInstalacoesService(servicoId, companhia)
  const rodapeTexto = await gerarTextoRodapeService()

  const parts: string[] = []
  if (alunosTexto) parts.push(alunosTexto)
  if (instalacoesTexto) parts.push("11. Instalações:\n" + instalacoesTexto)

  if (rodapeTexto) parts.push(rodapeTexto)

  return parts.join("\n\n")
}

export const gerarTextoAlunosService = async (
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

  const militares = servico.membrosGuarnicao
    .map((m) => {
      const ano = calcularAnoAluno(m.aluno.anoFormatura)
      return { membro: m, ano }
    })
    .filter(({ ano }) => verificarCompanhiaDoAluno(ano, companhia))

  if (militares.length === 0) return ""

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
    items.sort((x, y) => x.nome.localeCompare(y.nome))
    const parts = items.map((it) => `Alu ${ordinal(it.ano)} Ano ${it.curso ?? "CFG"} ${it.nome}`)
    lines.push(`${key}: ${parts.join("; ")};`)
  }

  return lines.join("\n")
}

export const gerarTextoInstalacoesService = async (
  servicoId: string,
  companhia: number,
): Promise<string> => {
  const mapa = INSTALACOES_POR_COMPANHIA[companhia] ?? []
  const alteracoes = await buscarAlteracoesPorServico(servicoId)

  const groups = new Map<string, Array<{ descricao: string; status: string }>>()
  for (const a of alteracoes) {
    const key = a.local
    const lista = groups.get(key) ?? []
    lista.push({ descricao: a.descricao, status: a.status })
    groups.set(key, lista)
  }

  if (mapa.length === 0) return ""

  const lines: string[] = []
  for (let i = 0; i < mapa.length; i++) {
    const entry = mapa[i]
    if (!entry) continue
    const { local, label } = entry
    const letra = String.fromCharCode(97 + i) // a, b, c...
    const itens = groups.get(local) ?? []

    const novas = itens.filter((x) => x.status === "NOVA").map((x) => x.descricao)
    const resolvidas = itens.filter((x) => x.status === "RESOLVIDA").map((x) => x.descricao)

    const novasText = novas.length > 0 ? novas.join("; ") : "S/A"
    const pendentesText = TEXTO_PENDENTES
    const resolvidasText = resolvidas.length > 0 ? resolvidas.join("; ") : "S/A"

    lines.push(`${letra}. ${label}:`)
    lines.push(`1) Novas: ${novasText};`)
    lines.push(`2) Pendentes: ${pendentesText};`)
    lines.push(`3) Resolvidas: ${resolvidasText}.`)
    lines.push("")
  }

  // remove last blank line
  if (lines[lines.length - 1] === "") lines.pop()

  return lines.join("\n")
}

const formatDatePt = (d?: Date | string | null) => {
  if (!d) return ""
  const date = d instanceof Date ? d : new Date(d)
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]
  const day = date.getDate()
  const month = months[date.getMonth()] || ""
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

export const gerarTextoRodapeService = async (): Promise<string> => {
  const sgt = await listarServicoAtualService()
  if (!sgt) return "S/A"

  const local = "Quartel da Praia Vermelha"
  const dataStr = formatDatePt(sgt.dataServico)

  const ano = calcularAnoAluno(sgt.anoFormatura)
  const aluPart = ano ? `ALU ${ordinal(ano)} Ano ${sgt.nomeGuerra} ${sgt.nomeCompleto}` : `ALU ${sgt.nomeGuerra} ${sgt.nomeCompleto}`

  const linha1 = `${local}, ${dataStr}`
  const linha2 = aluPart.toUpperCase()

  return `${linha1}\n${linha2}`
}


