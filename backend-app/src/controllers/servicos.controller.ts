import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { CriarServicoSchema, type CriarServicoBody } from "../schemas/servicos.schema.js";
import { criarNovoServico } from "../services/servicos.service.js";

const PRISMA_CONFLICT_ERRORS: Record<string, string> = {
  P2002: "Já existe um serviço cadastrado para essa data",
  P2003: "Um ou mais membros informados não existem",
};

// -> Definir o sgt dia 
// -> setar status FECHADO no serviço que estava EM_ANDAMENTO
// -> Alterações com status NOVA vão ser passadas para PENDENTE

export const criarServico = async (req: Request, res: Response) => {
  try {
    const dadosValidados = CriarServicoSchema.parse(req.body);
    const novoServico = await criarNovoServico(dadosValidados)

    return res.status(201).json(novoServico);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const error = PRISMA_CONFLICT_ERRORS[err.code];
      if (error) {
        return res.status(409).json({ error });
      }
    }

    console.error("Erro ao criar serviço: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao criar o serviço",
    });
  }
};