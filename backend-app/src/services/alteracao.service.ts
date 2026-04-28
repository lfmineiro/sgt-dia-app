import type { Alteracao } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type { CriarAlteracaoInput } from "../schemas/alteracao.schemas.js"


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

export const listarAlteracoesAtuais = async (): Promise<Alteracao[]> => {

  const alteracoes = await prisma.alteracao.findMany({
    where: {
      status: {
        in: ['PENDENTE', 'NOVA' ]
      },
    }
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