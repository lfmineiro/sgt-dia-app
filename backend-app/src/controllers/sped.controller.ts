import type { Request, Response } from "express";
import { ZodError } from "zod";
import { criarSpedSchema, atualizarSpedSchema, spedParamSchema } from "../schemas/speds.schemas.js";
import {
  obterOuCriarSpedService,
  obterSpedComTextosPadraoService,
  atualizarSpedService,
  gerarTextoSpedService,
} from "../services/sped.service.js";

const handleZodError = (res: Response, err: unknown) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.issues,
    });
  }
  return null;
};

export const criarSped = async (req: Request, res: Response) => {
  try {
    const dadosValidados = criarSpedSchema.parse(req.body);
    const novoSped = await obterOuCriarSpedService(dadosValidados.servicoId, dadosValidados.companhia);

    return res.status(201).json(novoSped);
  } catch (err: unknown) {
    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao criar SPED: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição",
    });
  }
};

export const obterSped = async (req: Request, res: Response) => {
  try {
    const paramsValidados = spedParamSchema.parse(req.params);

    const sped = await obterSpedComTextosPadraoService(paramsValidados.servicoId, paramsValidados.companhia);

    return res.status(200).json(sped);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SERVICO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao obter SPED: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição",
    });
  }
};

export const atualizarSped = async (req: Request, res: Response) => {
  try {
    const paramsValidados = spedParamSchema.parse(req.params);
    const dadosValidados = atualizarSpedSchema.parse(req.body);

    const spedAtualizado = await atualizarSpedService(paramsValidados.servicoId, paramsValidados.companhia, dadosValidados);

    return res.status(200).json(spedAtualizado);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SPED_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "SPED não encontrado",
      });
    }

    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao atualizar SPED: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição",
    });
  }
};

export const obterTextoSped = async (req: Request, res: Response) => {
  try {
    const paramsValidados = spedParamSchema.parse(req.params);

    const texto = await gerarTextoSpedService(paramsValidados.servicoId, paramsValidados.companhia);

    return res.status(200).json({ texto });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SERVICO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    const zodResponse = handleZodError(res, err);
    if (zodResponse) return zodResponse;

    console.error("Erro ao gerar texto SPED: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição",
    });
  }
};
