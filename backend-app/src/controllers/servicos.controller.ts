import type { Request, Response } from "express";
import { Prisma, StatusAlteracao } from "@prisma/client";
import { ZodError } from "zod";
import { CriarServicoSchema, servicoIdParamSchema, atualizarServicoSchema } from "../schemas/servicos.schema.js";
import { criarNovoServico, listarServicoAtualService, listarServicosService, atualizarServicoService } from "../services/servicos.service.js";

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

export const listarServicos = async (req: Request, res: Response) => {
 try{
     const getServicos = await listarServicosService();
     res.status(200).json(getServicos);
   } catch (err: unknown) {
     console.error("Erro ao listar os Serviços:", err)
     return res.status(500).json({
       error: "Erro interno do servidor ao processar a informação"
     })
   }
} 

export const listarServicoAtual = async (req: Request, res: Response) => {
  try{
      const getServicoAtual = await listarServicoAtualService();
      if (!getServicoAtual) {
       return res.status(404).json({ message: "Nenhum SGT de dia encontrado para o serviço em andamento." });
     }

      return res.status(200).json(getServicoAtual);

    } catch (err: unknown) {
      console.error("Erro ao listar o Serviço Atual: ", err)
      return res.status(500).json({
        error: "Erro interno do servidor ao processar a informação"
      })
    }
}

export const atualizarServico = async (req: Request, res: Response) => {
  try {
    const { id } = servicoIdParamSchema.parse(req.params);
    const dadosValidados = atualizarServicoSchema.parse(req.body);

    const servicoAtualizado = await atualizarServicoService(id, dadosValidados);

    return res.status(200).json(servicoAtualizado);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: err.issues,
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          error: "Serviço não encontrado",
        });
      }
    }

    console.error("Erro ao atualizar serviço: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao atualizar serviço",
    });
  }
};