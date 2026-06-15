import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
	alteracaoIdParamSchema,
	atualizarAlteracaoSchema,
	atualizarStatusAlteracaoSchema,
	listarAlteracoesQuerySchema,
	criarAlteracaoSchema,
	type AtualizarStatusAlteracaoInput,
	type AtualizarAlteracaoInput,
} from "../schemas/alteracao.schemas.js";
import {
	atualizarAlteracao,
	atualizarStatusAlteracao,
	criarAlteracao,
	listarAlteracoes,
	deletarAlteracao,
} from "../services/alteracao.service.js";
import { uploadAlteracaoImage } from "../lib/cloudinary.js";

const handleZodError = (res: Response, err: unknown) => {
	if (err instanceof ZodError) {
		return res.status(400).json({
			error: "Dados inválidos",
			details: err.issues,
		});
	}
	return null;
};

type SchemaComParse = {
	parse: (value: unknown) => unknown;
};

const responderAtualizacaoDaAlteracao = async (
	req: Request,
	res: Response,
	schema: SchemaComParse,
	atualizar: (id: string, dados: unknown) => Promise<unknown>,
	errorLog: string,
	errorResposta: string,
) => {
	try {
		const paramsValidados = alteracaoIdParamSchema.parse(req.params);
		const dadosValidados = schema.parse(req.body);

		const alteracaoAtualizada = await atualizar(paramsValidados.id, dadosValidados);

		return res.status(200).json(alteracaoAtualizada);
	} catch (err: unknown) {
		const zodResponse = handleZodError(res, err);
		if (zodResponse) return zodResponse;

		if (err instanceof Error && err.message === "ALTERACAO_NAO_ENCONTRADA") {
			return res.status(404).json({
				error: "Alteração não encontrada",
			});
		}

		console.error(errorLog, err);
		return res.status(500).json({
			error: errorResposta,
		});
	}
};

export const listarAlteracoesTodas = async (req: Request, res: Response) => {
	try {
		const filtrosValidados = listarAlteracoesQuerySchema.parse(req.query);
		const alteracoes = await listarAlteracoes(filtrosValidados);
		return res.status(200).json(alteracoes);
	} catch (err: unknown) {
		const zodResponse = handleZodError(res, err);
		if (zodResponse) return zodResponse;

		console.error("Erro ao listar alterações: ", err);
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
	return responderAtualizacaoDaAlteracao(
		req,
		res,
		atualizarStatusAlteracaoSchema,
		async (id, dados) => atualizarStatusAlteracao(id, (dados as AtualizarStatusAlteracaoInput).status),
		"Erro ao atualizar status da alteração: ",
		"Erro interno do servidor ao atualizar status",
	);
};

export const atualizarDadosDaAlteracao = async (req: Request, res: Response) => {
return responderAtualizacaoDaAlteracao(
	req,
	res,
	atualizarAlteracaoSchema,
	async (id, dados) => atualizarAlteracao(id, dados as AtualizarAlteracaoInput),
	"Erro ao atualizar alteração: ",
	"Erro interno do servidor ao atualizar alteração",
);
};

export const uploadFotoAlteracao = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				error: "Arquivo de foto é obrigatório",
			});
		}

		const { fotoUrl, publicId } = await uploadAlteracaoImage(
			req.file.buffer,
			req.file.mimetype,
		);

		return res.status(201).json({ fotoUrl, publicId });
	} catch (err: unknown) {
		console.error("Erro ao fazer upload da foto da alteração: ", err);
		return res.status(500).json({
			error: "Erro interno do servidor ao fazer upload da foto",
		});
	}
};

export const removerAlteracao = async (req: Request, res: Response) => {
	try {
		const paramsValidados = alteracaoIdParamSchema.parse(req.params);
		await deletarAlteracao(paramsValidados.id);
		return res.status(204).send();
	} catch (err: unknown) {
		const zodResponse = handleZodError(res, err);
		if (zodResponse) return zodResponse;

		if (err instanceof Error && err.message === "ALTERACAO_NAO_ENCONTRADA") {
			return res.status(404).json({
				error: "Alteração não encontrada",
			});
		}

		console.error("Erro ao remover alteração: ", err);
		return res.status(500).json({
			error: "Erro interno do servidor ao remover alteração",
		});
	}
};
