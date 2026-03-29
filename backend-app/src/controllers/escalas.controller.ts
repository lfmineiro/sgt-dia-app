import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  atualizarEscalaSchema,
  configurarEscalaSchema,
  escalaIdParamSchema,
  listarMembrosEscalaQuerySchema,
  postoParamSchema,
} from "../schemas/escalas.schemas.js";
import {
  atualizarEscalaService,
  configurarEscalaService,
  listarEscalasPorPostoService,
  listarMembrosEscalaService,
} from "../services/escalas.service.js";

const handleZodError = (res: Response, err: unknown) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.issues,
    });
  }
  return null;
};

export const configurarEscalasPorPosto = async (req: Request, res: Response) => {
  try {
    const dadosValidados = configurarEscalaSchema.parse(req.body);
    const escalas = await configurarEscalaService(dadosValidados);
    return res.status(201).json(escalas);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    if (err instanceof Error && err.message === "MEMBRO_GUARNICAO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Um ou mais membros da guarnição não foram encontrados",
      });
    }

    if (err instanceof Error && err.message === "MEMBROS_DE_SERVICOS_DIFERENTES") {
      return res.status(409).json({
        error: "A configuração deve usar membros do mesmo serviço",
      });
    }

    if (err instanceof Error && err.message === "MEMBRO_REPETIDO_NA_CONFIGURACAO") {
      return res.status(409).json({
        error: "Não repita o mesmo militar na configuração",
      });
    }

    console.error("Erro ao configurar escala do posto: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao configurar o posto",
    });
  }
};

export const listarEscalasPorPosto = async (req: Request, res: Response) => {
  try {
    const paramsValidados = postoParamSchema.parse(req.params);
    const escalas = await listarEscalasPorPostoService(paramsValidados.posto);
    return res.status(200).json(escalas);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao listar escalas por posto: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao listar escalas",
    });
  }
};

export const atualizarEscala = async (req: Request, res: Response) => {
  try {
    const paramsValidados = escalaIdParamSchema.parse(req.params);
    const dadosValidados = atualizarEscalaSchema.parse(req.body);

    const escalaAtualizada = await atualizarEscalaService(
      paramsValidados.id,
      dadosValidados,
    );

    return res.status(200).json(escalaAtualizada);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    if (err instanceof Error && err.message === "ESCALA_NAO_ENCONTRADA") {
      return res.status(404).json({
        error: "Escala não encontrada",
      });
    }

    console.error("Erro ao atualizar escala: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao atualizar a escala",
    });
  }
};

export const listarMembrosEscala = async (req: Request, res: Response) => {
  try {
    const queryValidada = listarMembrosEscalaQuerySchema.parse(req.query);
    const membros = await listarMembrosEscalaService(queryValidada);
    return res.status(200).json(membros);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao listar membros para escala: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao listar membros",
    });
  }
};