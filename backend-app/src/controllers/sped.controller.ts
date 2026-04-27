import type { Request, Response } from "express";
import { atualizarSpedSchema, spedParamSchema } from "../schemas/speds.schemas.js";
import { obterOuCriarSpedService, atualizarSpedService, gerarTextoSpedService } from "../services/sped.service.js";

export const obterSped = async (req: Request, res: Response) => {
  try {
    const paramsValidados = spedParamSchema.parse(req.params);

    const sped = await obterOuCriarSpedService(paramsValidados.servicoId, paramsValidados.companhia);

    return res.status(200).json(sped);
  } catch (err: any) {
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
  } catch (err: any) {
    if (err.message === "SPED_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "SPED não encontrado",
      });
    }

    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Dados inválidos",
        details: err.errors,
      });
    }

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
  } catch (err: any) {
    if (err.message === "SERVICO_NAO_ENCONTRADO") {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    console.error("Erro ao gerar texto SPED: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição",
    });
  }
};
