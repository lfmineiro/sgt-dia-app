import type { Alteracao } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type { CriarAlteracaoInput } from "../schemas/alteracao.schemas.js"


export const criarAlteracao = async (data: CriarAlteracaoInput): Promise<Alteracao> => {
  const servicoAtual = await prisma.servico.findFirst({
    where: {
      status: 'EM_ANDAMENTO'
    }
  })

  const alteracaoNova = await prisma.alteracao.create({
    data: data
  })

  return alteracaoNova
}

export const listarAlteracoesAtuais = async (): Promise<Alteracao[]> => {

  const alteracoes = await prisma.alteracao.findMany({
    where: {
      status: 'PENDENTE',
    }
  })

  return alteracoes
}