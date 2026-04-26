import { prisma } from "../lib/prisma.js";
import type { CriarServicoBody } from "../schemas/servicos.schema.js";

export const criarNovoServico = async (input: CriarServicoBody ) => {
  const parsedDate = new Date(input.data ?? "")

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
            data: parsedDate,
            membrosGuarnicao: {
              create: input.membros.map((m) => ({
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