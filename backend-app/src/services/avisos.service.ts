import type { Aviso } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { CriarAvisoInput } from "../schemas/avisos.schemas.js";

const obterServicoAtualId = async (): Promise<string> => {

  //codigo se repete bastante no backend -> centralizar 
  const servicoAtual = await prisma.servico.findFirst({
    where: { status: "EM_ANDAMENTO" },
    select: { id: true },
  });

  if (!servicoAtual) {
    throw new Error("SERVICO_NAO_ENCONTRADO");
  }

  return servicoAtual.id;
};

export const criarAvisoService = async (input: CriarAvisoInput): Promise<Aviso> => {
  const servicoId = await obterServicoAtualId();

  return prisma.aviso.create({
    data: {
      ...input,
      servicoId,
    },
  });
};

export const listarAvisosServicoAtualService = async (): Promise<Aviso[]> => {
  const servicoId = await obterServicoAtualId();

  return prisma.aviso.findMany({
    where: { servicoId },
    orderBy: { criadoEm: "desc" },
  });
};
