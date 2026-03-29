import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { MembroGuarnicao } from "@prisma/client"

// Instancia o novo serviço e tem que desativar os outros (no caso só o anterior já que ele é o que)

export const criarServico = async (req: Request, res: Response) => {
  const { data, membros } = req.body;
  // console.log(membros)
  const novoServico = await prisma.servico.create({
    data: {
      data: new Date(data),
      membrosGuarnicao: {
        create: membros.map((membro: MembroGuarnicao)  => ({
          alunoNumero: membro.alunoNumero,
          funcao: membro.funcao,
        }))
      }
    },
    include: {
      membrosGuarnicao: true,
    }
  })
  return res.status(201).json(novoServico);
} 