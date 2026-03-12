import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { alunoNumeroParamSchema, atualizarAlunoSchema, criarAlunoSchema } from "../schemas/alunos.schemas.js";

export const criarAluno = async (req: Request, res: Response) => {
  try {
    
    const dadosValidados = criarAlunoSchema.parse(req.body)
  
    // Verificar unicidade
    const alunoExistente = await prisma.aluno.findUnique({
      where: { numero: dadosValidados.numero }
    })
    // Erro 409 pois conflita com o estado atual do servidor 
    if (alunoExistente) {
        return res.status(409).json({ error: "Aluno já cadastrado." });
      }
    const novoAluno = await prisma.aluno.create({
      data: dadosValidados
    })
      return res.status(201).json(novoAluno)
  } catch (err) {
    console.error('Erro ao criar o aluno: ', err)
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição"
    })
  }
} 

export const listarAlunos = async (req: Request, res: Response) => {
  const getAlunos = await prisma.aluno.findMany({
    orderBy: {
      anoFormatura: 'asc'
    }
  })
  res.status(200).json(getAlunos);
}

export const atualizarAluno = async (req: Request, res: Response) => {
  const paramResult = alunoNumeroParamSchema.parse(req.params)

  const numeroAtual = paramResult.numero
  const dadosValidados = atualizarAlunoSchema.parse(req.body)
  
  // Repetindo código, vou refatorar logo
  // Verificar unicidade
    const alunoExistente = await prisma.aluno.findUnique({
      where: { numero: numeroAtual }
    })
    if (!alunoExistente) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

        // Se for alterar o número, valida conflito
    if ("numero" in dadosValidados && dadosValidados.numero !== numeroAtual) {
      const conflito = await prisma.aluno.findUnique({
        where: { numero: dadosValidados.numero },
      });

      if (conflito) {
        return res.status(409).json({ error: "Novo número já está em uso." });
      }

    }
    const alunoAtualizado = await prisma.aluno.update({
      where: {numero: numeroAtual},
      data: {
        ...dadosValidados
      }
    })
    
    return res.status(200).json(alunoAtualizado)
}

export const deletarAluno = async (req: Request, res: Response) => {
  const paramResult = alunoNumeroParamSchema.parse(req.params)

  const numero = paramResult.numero

   // Repetindo código, vou refatorar logo
  // Verificar unicidade
    const alunoExistente = await prisma.aluno.findUnique({
      where: { numero: numero }
    })
 
    if (!alunoExistente) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

    await prisma.aluno.delete({
      where: { numero },
    });

    return res.status(204).send();

}
 
