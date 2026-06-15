import { prisma } from "../lib/prisma.js";
import { FuncaoMembroGuarnicao } from "@prisma/client";
import type { CriarServicoBody, ServicoAtualSgtDiaDTO, AtualizarServicoInput } from "../schemas/servicos.schema.js";

export const criarNovoServico = async (input: CriarServicoBody ) => {
  const servicoCriado = await prisma.$transaction(async (tx) => {
    
    // Primeiro vamos fechar o serviço anterior
    await tx.servico.updateMany({
      where: { status: 'EM_ANDAMENTO' },
      data: { status: 'FECHADO' }
    })

    // As alterações que estavam como novas, vão para pendentes
    await tx.alteracao.updateMany({
      where: { status: 'NOVA' },
      data: { status: 'PENDENTE' }
    })


    const novoServico = await tx.servico.create({
          data: {
            data: input.data,
            membrosGuarnicao: {
              create: input.membros.map((m: { alunoNumero: number; funcao: FuncaoMembroGuarnicao }) => ({
                alunoNumero: m.alunoNumero,
                funcao: m.funcao,
              })),
            },
          },
          include: {
            membrosGuarnicao: true,
          },
        });
        return novoServico
  }) 
  return servicoCriado
}

export const listarServicosService = async () => {
  const servicos = await prisma.servico.findMany({
    include: {
      membrosGuarnicao: true
    },
    orderBy: {
      data: 'desc'
    }
  })
  return servicos
}

export const listarServicoAtualService = async () => {
  const servicoAtual = await prisma.servico.findFirst({
    where: { status: 'EM_ANDAMENTO' },
    include: {
      membrosGuarnicao: {
        include: {
          aluno: true,
        },
      },
    },
  })

  if (!servicoAtual) {
    return null
  }

  const sgtDia = servicoAtual.membrosGuarnicao.find(
    (membro) => membro.funcao === FuncaoMembroGuarnicao.SGT_DIA,
  )

  if (!sgtDia) {
    return null
  }

  const dto: ServicoAtualSgtDiaDTO = {
    servicoId: servicoAtual.id,
    dataServico: servicoAtual.data,
    statusServico: servicoAtual.status,
    numero: sgtDia.aluno.numero,
    nomeGuerra: sgtDia.aluno.nomeGuerra,
    nomeCompleto: sgtDia.aluno.nomeCompleto,
    anoFormatura: sgtDia.aluno.anoFormatura,
    curso: sgtDia.aluno.curso,
  }

  return dto
}

export const atualizarServicoService = async (
  servicoId: string,
  dados: AtualizarServicoInput
) => {
  const { status, data, membros } = dados

  return await prisma.$transaction(async (tx) => {
    if (membros) {
      // Remover membros antigos
      await tx.membroGuarnicao.deleteMany({
        where: { servicoId }
      })

      // Adicionar novos membros
      await tx.servico.update({
        where: { id: servicoId },
        data: {
          membrosGuarnicao: {
            create: membros.map((m: { alunoNumero: number; funcao: string }) => ({
              alunoNumero: m.alunoNumero,
              funcao: m.funcao as FuncaoMembroGuarnicao,
            })),
          },
        },
      })
    }

    // Atualizar outros campos
    const servicoAtualizado = await tx.servico.update({
      where: { id: servicoId },
      data: {
        ...(status ? { status } : {}),
        ...(data ? { data } : {}),
      },
      include: {
        membrosGuarnicao: true
      }
    })

    return servicoAtualizado
  })
}