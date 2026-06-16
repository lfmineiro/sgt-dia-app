import { prisma } from "../lib/prisma.js"
import { calcularAnoAluno, verificarCompanhiaDoAluno, ordinal } from "../lib/aluno-utils.js"
import type { AtualizarSpedInput } from "../schemas/speds.schemas.js"
import { buscarAlteracoesPorServico } from "./alteracao.service.js"
import { listarServicoAtualService } from "./servicos.service.js"
import { INSTALACOES_POR_COMPANHIA, TEXTO_PENDENTES } from "../constants/instalacoes.js"
import { LOCAL_QUARTEL, SETOR_LOCAL_LABELS, SPED_SECOES, VALOR_AUSENTE } from "../constants/sped.js"
import { funcaoLabel, formatDatePt, postoRank, safeValue } from "../utils/sped.utils.js"

const PISTOLA_PADRAO = "12995"
const HORA_CAUTELA_PLACEHOLDER = "[HORA_CAUTELA]"
const HORA_DESCAUTELA_PLACEHOLDER = "[HORA_DESCAUTELA]"

const formatDateNumericPt = (d: Date): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

const companhiaOrdinal = (companhia: number): string => `${companhia}ª`

const buscarSgtDiaVizinho = async (
  dataServico: Date,
  direcao: "anterior" | "seguinte",
) => {
  const servico = await prisma.servico.findFirst({
    where: {
      data: direcao === "anterior" ? { lt: dataServico } : { gt: dataServico },
    },
    orderBy: {
      data: direcao === "anterior" ? "desc" : "asc",
    },
    include: {
      membrosGuarnicao: {
        where: { funcao: "SGT_DIA" },
        include: { aluno: true },
      },
    },
  })

  const sgtDia = servico?.membrosGuarnicao[0]
  if (!servico || !sgtDia) return null

  return {
    data: servico.data,
    aluno: sgtDia.aluno,
  }
}

const alunoSpedPadrao = (
  sgtDia: Awaited<ReturnType<typeof buscarSgtDiaVizinho>>,
  nomeFallback: string,
): string => {
  if (!sgtDia) return `Alu [ANO] Ano CFG ${nomeFallback}`

  const anoAluno = calcularAnoAluno(sgtDia.aluno.anoFormatura)
  const anoTexto = anoAluno ? ordinal(anoAluno) : "[ANO]"

  return `Alu ${anoTexto} Ano CFG ${sgtDia.aluno.nomeGuerra.toUpperCase()}`
}

const gerarTextosPadraoSped = async (servicoId: string, companhia: number) => {
  const servico = await prisma.servico.findUnique({
    where: { id: servicoId },
    select: { data: true },
  })

  if (!servico) throw new Error("SERVICO_NAO_ENCONTRADO")

  const [sgtDiaAnterior, sgtDiaSeguinte] = await Promise.all([
    buscarSgtDiaVizinho(servico.data, "anterior"),
    buscarSgtDiaVizinho(servico.data, "seguinte"),
  ])

  const dataAnterior = sgtDiaAnterior ? formatDatePt(sgtDiaAnterior.data) : "[DATA_ANTERIOR]"
  const dataSeguinte = sgtDiaSeguinte ? formatDatePt(sgtDiaSeguinte.data) : "[DATA_PROXIMO]"
  const diaSeguinte = addDays(servico.data, 1)
  const diaSeguinteNumerico = formatDateNumericPt(diaSeguinte)
  const cia = companhiaOrdinal(companhia)

  return {
    recebimento: `Recebi do ${alunoSpedPadrao(sgtDiaAnterior, "[NOME_ANTERIOR]")}, Sgt Dia da ${cia} Cia do dia ${dataAnterior}.`,
    passagem: `Passo o serviço, com todas as ordens em vigor, ao ${alunoSpedPadrao(sgtDiaSeguinte, "[NOME_PROXIMO]")}, Sgt Dia da ${cia} Cia do dia ${dataSeguinte}.`,
    armamento: [
      `a. Cautelei a pistola ${PISTOLA_PADRAO} às ${HORA_CAUTELA_PLACEHOLDER} do dia ${diaSeguinteNumerico} e descautelei às ${HORA_DESCAUTELA_PLACEHOLDER} do dia ${diaSeguinteNumerico}.`,
      `b. Cautelei 7 munições às ${HORA_CAUTELA_PLACEHOLDER} do dia ${diaSeguinteNumerico} e descautelei às ${HORA_DESCAUTELA_PLACEHOLDER} do dia ${diaSeguinteNumerico}.`,
    ].join("\n"),
  }
}

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

  return await prisma.sped.create({
    data: {
      servicoId,
      companhia,
      recebimento: "",
      passagem: "",
    },
  })
}

export const obterSpedComTextosPadraoService = async (
  servicoId: string,
  companhia: number,
) => {
  const [sped, textosPadrao] = await Promise.all([
    obterOuCriarSpedService(servicoId, companhia),
    gerarTextosPadraoSped(servicoId, companhia),
  ])

  return {
    ...sped,
    textosPadrao,
  }
}

export const atualizarSpedService = async (
  servicoId: string,
  companhia: number,
  dados: AtualizarSpedInput,
) => {
  const spedExistente = await prisma.sped.findUnique({
    where: { servicoId_companhia: { servicoId, companhia } },
  })

  if (!spedExistente) {
    throw new Error("SPED_NAO_ENCONTRADO")
  }

  return await prisma.sped.update({
    where: { servicoId_companhia: { servicoId, companhia } },
    data: dados,
  })
}

export const gerarTextoSpedService = async (
  servicoId: string,
  companhia: number,
): Promise<string> => {
  return await gerarTextoSpedCompletoService(servicoId, companhia)
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
    const postoDisplay = postoRaw ? (SETOR_LOCAL_LABELS[postoRaw] ?? postoRaw) : "Sem posto"
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
    const parts = items.map((it) => `**${it.nome}**`)
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
    const lista = groups.get(a.local) ?? []
    lista.push({ descricao: a.descricao, status: a.status })
    groups.set(a.local, lista)
  }

  if (mapa.length === 0) return ""

  const lines: string[] = []
  for (let i = 0; i < mapa.length; i++) {
    const entry = mapa[i]
    if (!entry) continue
    const { local, label } = entry
    const letra = String.fromCharCode(97 + i)
    const itens = groups.get(local) ?? []

    const novas = itens.filter((x) => x.status === "NOVA").map((x) => x.descricao)
    const resolvidas = itens.filter((x) => x.status === "RESOLVIDA").map((x) => x.descricao)

    const novasText = novas.length > 0 ? novas.join("; ") : VALOR_AUSENTE
    const resolvidasText = resolvidas.length > 0 ? resolvidas.join("; ") : VALOR_AUSENTE

    lines.push(`${letra}. ${label}:`)
    lines.push(`1) Novas: ${novasText};`)
    lines.push(`2) Pendentes: ${TEXTO_PENDENTES};`)
    lines.push(`3) Resolvidas: ${resolvidasText}.`)
    lines.push("")
  }

  if (lines[lines.length - 1] === "") lines.pop()

  return lines.join("\n")
}

export const gerarTextoRodapeService = async (): Promise<string> => {
  const sgt = await listarServicoAtualService()
  if (!sgt) return VALOR_AUSENTE

  const dataStr = formatDatePt(sgt.dataServico)
  const ano = calcularAnoAluno(sgt.anoFormatura)
  const aluPart = ano ? `ALU ${ordinal(ano)} Ano ${sgt.nomeCompleto}` : `ALU ${sgt.nomeCompleto}`

  return `${LOCAL_QUARTEL}, ${dataStr}\n${aluPart.toUpperCase()}`
}

export const gerarTextoSpedCompletoService = async (
  servicoId: string,
  companhia: number,
): Promise<string> => {
  const sped =
    (await prisma.sped.findUnique({
      where: { servicoId_companhia: { servicoId, companhia } },
    })) ?? (await obterOuCriarSpedService(servicoId, companhia))

  const alunosTexto = await gerarTextoAlunosService(servicoId, companhia)
  const instalacoesTexto = await gerarTextoInstalacoesService(servicoId, companhia)
  const rodapeTexto = await gerarTextoRodapeService()

  const parts = [
    `**${SPED_SECOES.RECEBIMENTO}:** ${safeValue(sped.recebimento)}`,
    alunosTexto
      ? `**${SPED_SECOES.MILITARES}:**\n${alunosTexto}`
      : `**${SPED_SECOES.MILITARES}:** ${VALOR_AUSENTE}`,
    `**${SPED_SECOES.ARMAMENTO}:** ${safeValue(sped.armamento)}`,
    `**${SPED_SECOES.PUNIDOS}:** ${safeValue(sped.punidos)}`,
    `**${SPED_SECOES.MATERIAL_CARGA}:** ${safeValue(sped.materialCarga)}`,
    `**${SPED_SECOES.VISITA_MEDICA}:** ${safeValue(sped.visitaMedica)}`,
    `**${SPED_SECOES.ALUNOS_DISPENSA}:** ${safeValue(sped.alunosDispensa)}`,
    `**${SPED_SECOES.REFEICOES}:** ${safeValue(sped.refeicoes)}`,
    `**${SPED_SECOES.RONDA}:** ${safeValue(sped.ronda)}`,
    `**${SPED_SECOES.REVISTA_RECOLHER}:** ${safeValue(sped.revistaRecolher)}`,
    instalacoesTexto
      ? `**${SPED_SECOES.INSTALACOES}:**\n${instalacoesTexto}`
      : `**${SPED_SECOES.INSTALACOES}:** ${VALOR_AUSENTE}`,
    `**${SPED_SECOES.OCORRENCIAS}:** ${safeValue(sped.ocorrencias)}`,
    `**${SPED_SECOES.PASSAGEM}:** ${safeValue(sped.passagem)}`,
  ].filter(Boolean)

  if (rodapeTexto) parts.push(rodapeTexto)

  return parts.join("\n\n")
}
