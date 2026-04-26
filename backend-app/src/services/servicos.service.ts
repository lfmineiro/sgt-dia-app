import { prisma } from "../lib/prisma.js";
import type { CriarServicoBody } from "../schemas/servicos.schema.js";

export const criarNovoServico = async (input: CriarServicoBody ) => {
  const parsedDate = new Date(input.data ?? "")

  const novoServico = await prisma.servico.create({
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
}