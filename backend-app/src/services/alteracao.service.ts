import type { Alteracao } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type {
  AtualizarAlteracaoInput,
  CriarAlteracaoInput,
  ListarAlteracoesQueryInput,
} from "../schemas/alteracao.schemas.js"


export const criarAlteracao = async (data: CriarAlteracaoInput): Promise<Alteracao> => {
  const servicoAtual = await prisma.servico.findFirst({
    where: {
      status: 'EM_ANDAMENTO'
    },
    select: { id: true }
  })

    if(!servicoAtual) {
      throw new Error("SERVICO_NAO_ENCONTRADO")
  }
  const alteracaoNova = await prisma.alteracao.create({
    data: {
      ...data,
      servicoId: servicoAtual.id,
      } 
  })

  return alteracaoNova
}

export const listarAlteracoes = async (
  filtros: ListarAlteracoesQueryInput = {},
): Promise<Alteracao[]> => {
  const alteracoes = await prisma.alteracao.findMany({
    where: {
      ...(filtros.status ? { status: filtros.status } : {}),
      ...(filtros.local ? { local: filtros.local } : {}),
      ...(filtros.comodo ? { comodo: filtros.comodo } : {}),
    },
    orderBy: { criadoEm: "desc" },
  })

  return alteracoes
}

export const buscarAlteracoesPorServico = async (servicoId: string): Promise<Alteracao[]> => {
  const alteracoes = await prisma.alteracao.findMany({
    where: { servicoId },
    orderBy: { criadoEm: "asc" },
  })

  return alteracoes
}

export const atualizarStatusAlteracao = async (
  id: string,
  status: Alteracao["status"],
): Promise<Alteracao> => {
  const alteracaoExistente = await prisma.alteracao.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!alteracaoExistente) {
    throw new Error("ALTERACAO_NAO_ENCONTRADA")
  }

  return await prisma.alteracao.update({
    where: { id },
    data: { status },
  })
}

export const atualizarAlteracao = async (
  id: string,
  data: AtualizarAlteracaoInput,
): Promise<Alteracao> => {
  const alteracaoExistente = await prisma.alteracao.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!alteracaoExistente) {
    throw new Error("ALTERACAO_NAO_ENCONTRADA")
  }

  const dadosParaAtualizacao = Object.fromEntries(
    Object.entries(data).filter(([, valor]) => valor !== undefined),
  )

  return prisma.alteracao.update({
    where: { id },
    data: dadosParaAtualizacao,
  })
}

export const deletarAlteracao = async (id: string): Promise<void> => {
  const alteracaoExistente = await prisma.alteracao.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!alteracaoExistente) {
    throw new Error("ALTERACAO_NAO_ENCONTRADA")
  }

  await prisma.alteracao.delete({
    where: { id },
  })
}