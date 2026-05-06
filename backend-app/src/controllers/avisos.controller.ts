import type { Request, Response } from "express";
import { ZodError } from "zod";
import { criarAvisoSchema } from "../schemas/avisos.schemas.js";
import { criarAvisoService, listarAvisosServicoAtualService } from "../services/avisos.service.js";

const handleZodError = (res: Response, err: unknown) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.issues,
    });
  }

  return null;
};

export const criarAviso = async (req: Request, res: Response) => {
  try {
    const dadosValidados = criarAvisoSchema.parse(req.body);
    const avisoCriado = await criarAvisoService(dadosValidados);
    return res.status(201).json(avisoCriado);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    if (err instanceof Error && err.message === "SERVICO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    console.error("Erro ao criar aviso: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao criar aviso",
    });
  }
};

export const listarAvisos = async (req: Request, res: Response) => {
  try {
    const avisos = await listarAvisosServicoAtualService();
    return res.status(200).json(avisos);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SERVICO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    console.error("Erro ao listar avisos: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao listar avisos",
    });
  }
};
