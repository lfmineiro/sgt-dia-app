import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
	alteracaoIdParamSchema,
	atualizarStatusAlteracaoSchema,
	criarAlteracaoSchema,
} from "../schemas/alteracao.schemas.js";
import {
	atualizarStatusAlteracao,
	criarAlteracao,
	listarAlteracoesAtuais,
} from "../services/alteracao.service.js";

const handleZodError = (res: Response, err: unknown) => {
	if (err instanceof ZodError) {
		return res.status(400).json({
			error: "Dados inválidos",
			details: err.issues,
		});
	}
	return null;
};

export const listarAlteracoesPendentes = async (req: Request, res: Response) => {
	try {
		const alteracoes = await listarAlteracoesAtuais();
		return res.status(200).json(alteracoes);
	} catch (err: unknown) {
		console.error("Erro ao listar alterações pendentes: ", err);
		return res.status(500).json({
			error: "Erro interno do servidor ao listar alterações",
		});
	}
};

export const criarNovaAlteracao = async (req: Request, res: Response) => {
	try {
		const dadosValidados = criarAlteracaoSchema.parse(req.body);
		const alteracaoNova = await criarAlteracao(dadosValidados);
		return res.status(201).json(alteracaoNova);
	} catch (err: unknown) {
		const zodResponse = handleZodError(res, err);
		if (zodResponse) return zodResponse;

		if (err instanceof Error && err.message === "SERVICO_NAO_ENCONTRADO") {
			return res.status(404).json({
				error: "Serviço não encontrado",
			});
		}

		console.error("Erro ao criar alteração: ", err);
		return res.status(500).json({
			error: "Erro interno do servidor ao criar alteração",
		});
	}
};

export const atualizarStatusDaAlteracao = async (req: Request, res: Response) => {
	try {
		const paramsValidados = alteracaoIdParamSchema.parse(req.params);
		const dadosValidados = atualizarStatusAlteracaoSchema.parse(req.body);

		const alteracaoAtualizada = await atualizarStatusAlteracao(
			paramsValidados.id,
			dadosValidados.status,
		);

		return res.status(200).json(alteracaoAtualizada);
	} catch (err: unknown) {
		const zodResponse = handleZodError(res, err);
		if (zodResponse) return zodResponse;

		if (err instanceof Error && err.message === "ALTERACAO_NAO_ENCONTRADA") {
			return res.status(404).json({
				error: "Alteração não encontrada",
			});
		}

		console.error("Erro ao atualizar status da alteração: ", err);
		return res.status(500).json({
			error: "Erro interno do servidor ao atualizar status",
		});
	}
};
