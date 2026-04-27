import { prisma } from "../lib/prisma.js"
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
