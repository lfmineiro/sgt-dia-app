import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { criarAlunoSchema } from "../schemas/alunos.schemas.js";

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
  res.status(201).json(getAlunos);
}

// export const editarAlunos = async (res: Response, req: Request) => {
//   const { id } = req.params
//   const dadosValidados = criarAlunoSchema.parse(req.body)
// }
 
