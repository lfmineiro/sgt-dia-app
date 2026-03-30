import type { Request, Response } from "express";
import { Prisma, type FuncaoMembroGuarnicao } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

type CriarServicoBody = {
  data: string;
  membros: Array<{ alunoNumero: number; funcao: FuncaoMembroGuarnicao }>;
};

const PRISMA_CONFLICT_ERRORS: Record<string, string> = {
  P2002: "Já existe um serviço cadastrado para essa data",
  P2003: "Um ou mais membros informados não existem",
};

export const criarServico = async (req: Request, res: Response) => {
  try {
    const { data, membros } = req.body as Partial<CriarServicoBody>;
    const parsedDate = new Date(data ?? "");

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Data inválida" });
    }

    if (!Array.isArray(membros) || membros.length === 0) {
      return res
        .status(400)
        .json({ error: "Informe ao menos um membro para o serviço" });
    }

    const novoServico = await prisma.servico.create({
      data: {
        data: parsedDate,
        membrosGuarnicao: {
          create: membros.map((m) => ({
            alunoNumero: m.alunoNumero,
            funcao: m.funcao,
          })),
        },
      },
      include: {
        membrosGuarnicao: true,
      },
    });

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